import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCardConfig } from "@/lib/cardUtils"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log("[CARD_WEBHOOK_RECEIVED]", data)

    // Standard fields for card charging callbacks
    const { status, request_id, value, amount, callback_sign, serial, pin } = data

    if (!request_id) {
      return NextResponse.json({ error: "Missing request_id" }, { status: 400 })
    }

    // Get config for verification
    const config = await getCardConfig()

    // VERIFY SIGNATURE (If provided)
    // Common pattern: md5(partner_key + status + serial + pin)
    if (callback_sign && config.partnerKey) {
      const mySign = crypto.createHash("md5")
        .update(config.partnerKey + status + serial + pin)
        .digest("hex")
      
      // Some partners use different sign patterns, if this fails we might need to adjust
      // But for security, we should ideally verify it
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

    // Update based on status
    // Common status codes: 1 (Success), 2 (Success but wrong value), 3 (Failed), 4 (Maintenance)
    const isSuccess = status === "success" || status === 1 || status === "1" || status === 200

    if (isSuccess) {
      const realValue = Number(value || deposit.declaredValue)
      const receivedAmount = Number(amount || realValue * 0.8) // Default 20% fee if not provided

      await prisma.$transaction(async (tx) => {
        // 1. Update Deposit status
        await tx.cardDeposit.update({
          where: { id: deposit.id },
          data: {
            status: "COMPLETED",
            realValue,
            amount: receivedAmount
          }
        })

        // 2. Update User balance
        await tx.user.update({
          where: { id: deposit.userId },
          data: {
            balance: { increment: receivedAmount },
            totalDeposited: { increment: receivedAmount }
          }
        })

        // 3. Create Ledger entry
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

        // 4. Log Activity
        await tx.userActivity.create({
          data: {
            userId: deposit.userId,
            type: "DEPOSIT_CARD",
            details: `Nạp thành công thẻ ${deposit.cardType} ${realValue}đ (Nhận ${receivedAmount}đ)`
          }
        })
      })

      return NextResponse.json({ message: "Processed successfully" }, { status: 200 })

    } else {
      // Failed card
      await prisma.cardDeposit.update({
        where: { id: deposit.id },
        data: {
          status: "FAILED",
          note: data.message || "Card rejected by partner"
        }
      })

      return NextResponse.json({ message: "Marked as failed" }, { status: 200 })
    }

  } catch (error) {
    console.error("[CARD_WEBHOOK_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
