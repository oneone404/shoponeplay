/**
 * API: Callback nhan the tu NCC (TheGiare)
 * POST /api/topup/callback
 */

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { finishTopupProcess } from "@/lib/services/topup-processor"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { status, request_id, order_code, cards, callback_sign } = body

    console.log("[TOPUP_CALLBACK] Received:", { status, request_id, order_code, cardsCount: cards?.length })

    // 1. Lay Partner Key tu DB de xac thuc
    const partnerKeyConfig = await prisma.config.findUnique({ where: { key: "CARD_PARTNER_KEY" } })
    const partnerKey = partnerKeyConfig?.value || ""

    if (!partnerKey) {
      console.error("[TOPUP_CALLBACK] CARD_PARTNER_KEY not configured")
      return NextResponse.json({ success: false, error: "System configuration error" }, { status: 500 })
    }

    // 2. Kiem tra chu ky: md5(partner_key + status + request_id)
    const expectedSign = crypto.createHash('md5').update(partnerKey + status + request_id).digest('hex')
    
    if (callback_sign !== expectedSign) {
      console.warn("[TOPUP_CALLBACK] Invalid signature", { received: callback_sign, expected: expectedSign })
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 403 })
    }

    // 3. Tim don hang theo request_id
    const order = await prisma.topupOrder.findFirst({
      where: { cardRequestId: request_id },
      include: { user: true }
    })

    if (!order) {
      console.error("[TOPUP_CALLBACK] Order not found for request_id:", request_id)
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Neu don da thanh cong hoac da refund thi thoi
    if (order.status === "COMPLETED" || order.status === "REFUNDED") {
      return NextResponse.json({ success: true, message: "Order already processed" })
    }

    // 4. Xu ly theo trang thai tu NCC
    if (Number(status) === 1) {
      // THANH CONG: Co the
      if (!cards || cards.length === 0) {
        return NextResponse.json({ success: false, error: "No cards provided in success callback" }, { status: 400 })
      }

      const card = cards[0]
      const { serial, pin } = card

      console.log("[TOPUP_CALLBACK] Processing successful card for order:", order.id)
      
      // Chay tiep quy trinh nap VNG (background)
      finishTopupProcess(order.id, serial, pin).catch(err => {
        console.error("[TOPUP_CALLBACK] finishTopupProcess background error:", err)
      })

      return NextResponse.json({ success: true, message: "Callback processed, topup starting..." })
    } 
    else if (Number(status) === 3) {
      // THAT BAI: NCC khong co the hoac loi
      console.log("[TOPUP_CALLBACK] Card purchase failed for order:", order.id)

      // Hoan tien cho user
      await prisma.$transaction([
        prisma.user.update({
          where: { id: order.userId },
          data: { balance: { increment: order.amount } }
        }),
        prisma.transaction.create({
          data: {
            userId: order.userId,
            amount: order.amount,
            balanceBefore: order.user.balance,
            balanceAfter: order.user.balance + order.amount,
            type: "REFUND",
            description: `Hoàn tiền nạp tự động (NCC báo lỗi) - Đơn #${order.id.slice(-8).toUpperCase()}`
          }
        }),
        prisma.topupOrder.update({
          where: { id: order.id },
          data: { 
            status: "REFUNDED",
            errorMessage: "NCC bao loi mua the (status 3)"
          }
        })
      ])

      return NextResponse.json({ success: true, message: "Callback processed, user refunded." })
    }

    return NextResponse.json({ success: true, message: "Callback received but no action needed (status " + status + ")" })

  } catch (error: any) {
    console.error("[TOPUP_CALLBACK] Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
