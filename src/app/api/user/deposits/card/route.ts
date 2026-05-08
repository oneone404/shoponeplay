import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getCardConfig } from "@/lib/cardUtils"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { telco, amount, serial, pin } = await req.json()

    if (!telco || !amount || !serial || !pin) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const config = await getCardConfig()
    if (!config.enabled) {
      return NextResponse.json({ error: "Card recharge is disabled" }, { status: 403 })
    }

    // Create a unique requestId
    const requestId = `CARD_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Generate Signature theo chuẩn TheSieuRe v2: md5(partner_key + pin + serial)
    const sign = crypto.createHash("md5").update(config.partnerKey + pin + serial).digest("hex")

    // Save to Database first as PENDING
    const deposit = await prisma.cardDeposit.create({
      data: {
        userId: session.user.id,
        cardType: telco,
        serial,
        pin,
        declaredValue: Number(amount),
        requestId,
        status: "PENDING"
      }
    })

    // Xây dựng URL đầy đủ từ Domain
    let finalUrl = config.apiUrl.trim()
    if (!finalUrl.startsWith("http")) {
      finalUrl = `https://${finalUrl}`
    }
    // Nếu chỉ nhập domain, tự động thêm /chargingws/v2
    if (!finalUrl.includes("/api/") && !finalUrl.includes("/chargingws/")) {
      finalUrl = finalUrl.endsWith("/") ? `${finalUrl}chargingws/v2` : `${finalUrl}/chargingws/v2`
    }

    // Send to Partner API (TheSieuRe v2)
    try {
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({

          telco,
          code: pin,
          serial,
          amount,
          request_id: requestId,
          partner_id: config.partnerId,
          sign,
          command: "charging"
        })
      })


      const result = await response.json()

      // Handle Immediate Response (1: Success, 2: Success wrong value, 99: Pending)
      const successStatuses = [1, "1", 2, "2", 99, "99", 200, "success", "PENDING"]
      const isAccepted = successStatuses.includes(result.status)
      if (isAccepted) {
        // Success in sending, now wait for webhook callback
        return NextResponse.json({ success: true, depositId: deposit.id })
      } else {
        // API returned error - Store raw message for admin
        const rawError = result.message || "Partner API rejected the card"
        await prisma.cardDeposit.update({
          where: { id: deposit.id },
          data: { status: "FAILED", note: rawError }
        })
        return NextResponse.json({ error: "Thẻ Cào Không Đúng" }, { status: 400 })
      }

    } catch (apiError) {
      console.error("[CARD_API_SUBMIT_ERROR]", apiError)
      return NextResponse.json({ error: "Failed to connect to Card Partner" }, { status: 502 })
    }

  } catch (error) {
    console.error("[CARD_DEPOSIT_POST_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
