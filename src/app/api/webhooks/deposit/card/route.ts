import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCardConfig } from "@/lib/cardUtils"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log("[CARD_WEBHOOK_RECEIVED]", data)

    // Standard fields for card charging callbacks (TheSieuRe v2)
    const { status, request_id, value, amount, callback_sign, serial, code } = data

    if (!request_id) {
      return NextResponse.json({ error: "Missing request_id" }, { status: 400 })
    }

    // Get config for verification
    const config = await getCardConfig()

    // VERIFY SIGNATURE (TheSieuRe v2: md5(partner_key + code + serial))
    if (callback_sign && config.partnerKey) {
      const mySign = crypto.createHash("md5")
        .update(config.partnerKey + code + serial)
        .digest("hex")
      
      if (mySign !== callback_sign) {
        console.error("[CARD_WEBHOOK] Signature mismatch!", { mySign, callback_sign })
        // return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    // Find the deposit record
    const deposit = await prisma.cardDeposit.findUnique({
      where: { requestId: request_id },
      include: { user: true }
    })

    if (!deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 })
    }

    if (deposit.status !== "PENDING") {
      return NextResponse.json({ message: "Already processed" }, { status: 200 })
    }

    // 1 = Success, 2 = Success wrong value, 3 = Failed, 4 = Maintenance, 99 = Pending
    const statusCode = Number(status)

    // Case 1 & 2: Success (Add balance)
    const isSuccess = statusCode === 1 || statusCode === 2 || status === "success" || status === 200

    if (isSuccess) {
      const realValue = Number(value || deposit.declaredValue)
      let receivedAmount = 0

      if (config.customDiscountEnabled) {
        const telcoKey = (deposit.cardType || "").toUpperCase()
        const discount = config.telcoDiscounts[telcoKey] ?? 20
        const multiplier = (100 - discount) / 100
        receivedAmount = realValue * multiplier
      } else {
        receivedAmount = Number(amount || realValue * 0.8)
      }
      
      receivedAmount = Math.floor(receivedAmount / 1000) * 1000

      await prisma.$transaction(async (tx) => {
        await tx.cardDeposit.update({
          where: { id: deposit.id },
          data: {
            status: "COMPLETED",
            realValue,
            amount: receivedAmount,
            note: statusCode === 2 ? `Sai mệnh giá (Khai ${deposit.declaredValue}đ - Thực tế ${realValue}đ)` : null
          }
        })

        await tx.user.update({
          where: { id: deposit.userId },
          data: {
            balance: { increment: receivedAmount },
            totalDeposited: { increment: receivedAmount }
          }
        })

        await tx.transaction.create({
          data: {
            userId: deposit.userId,
            amount: receivedAmount,
            balanceBefore: deposit.user.balance,
            balanceAfter: deposit.user.balance + receivedAmount,
            type: "DEPOSIT",
            description: `Nạp thẻ ${deposit.cardType} - Mệnh giá ${realValue}đ`,
            cardDepositId: deposit.id
          }
        })

        await tx.userActivity.create({
          data: {
            userId: deposit.userId,
            type: "DEPOSIT_CARD",
            details: `Nạp thành công thẻ ${deposit.cardType} ${realValue}đ (Nhận ${receivedAmount}đ)`
          }
        })

        // Trigger Real-time Notification via Pusher
        try {
          const { pusherServer } = await import("@/lib/pusher")
          const maskedName = deposit.user.name 
            ? deposit.user.name.slice(0, 2) + "***" + deposit.user.name.slice(-1)
            : "Khách***"
          
          await pusherServer.trigger(`user-${deposit.userId}`, "new-deposit", {
            userName: "Bạn",
            amount: receivedAmount,
            time: new Date().toISOString(),
            message: `Bạn vừa nạp thành công ${receivedAmount.toLocaleString()} VND từ thẻ cào ${deposit.cardType}.`
          })
        } catch (pusherError) {
          console.error("[CARD_WEBHOOK] Pusher trigger error:", pusherError)
        }
      })

      return NextResponse.json({ message: "Processed successfully" }, { status: 200 })

    } 
    
    // Case 99: Still Pending (Do nothing, just acknowledge)
    if (statusCode === 99) {
      return NextResponse.json({ message: "Card is still pending" }, { status: 200 })
    }

    // Case 3, 4, or others: Failed
    await prisma.cardDeposit.update({
      where: { id: deposit.id },
      data: {
        status: "FAILED",
        note: data.message || (statusCode === 4 ? "MAINTENANCE" : "UNKNOWN_ERROR")
      }
    })

    return NextResponse.json({ message: "Marked as failed" }, { status: 200 })

  } catch (error) {
    console.error("[CARD_WEBHOOK_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
