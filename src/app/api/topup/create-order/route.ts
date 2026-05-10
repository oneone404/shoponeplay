/**
 * API: Tao don nap tu dong
 * POST /api/topup/create-order
 */

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { processTopupOrder } from "@/lib/services/topup-processor"

export const dynamic = "force-dynamic"
export const maxDuration = 300 // 5 phut timeout cho retry logic

export async function POST(req: Request) {
  try {
    // ======== AUTH CHECK ========
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Bạn cần đăng nhập để sử dụng tính năng này" }, { status: 401 })
    }

    const body = await req.json()
    const { topupProductId, roleId, roleName, serverId, expectedPrice, manualProduct } = body

    // ======== VALIDATION ========
    if ((!topupProductId && !manualProduct) || !roleId || !roleName || !serverId) {
      return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 })
    }
    
    let topupProduct: any = null
    let chargePrice = 0
    let productName = ""
    let vngProductId = ""
    let cardValue = 0

    // ======== GET CONFIG FOR MARKUP ========
    const configs = await prisma.config.findMany({
      where: {
        key: { in: ["NAP_GAME_MARKUP", "NAP_GAME_ROUNDING"] }
      }
    })
    const markup = Number(configs.find(c => c.key === "NAP_GAME_MARKUP")?.value || "0")
    const rounding = configs.find(c => c.key === "NAP_GAME_ROUNDING")?.value === "true"

    if (topupProductId) {
      // Kiem tra san pham tu dong nap co ton tai va dang bat
      topupProduct = await prisma.topupProduct.findUnique({
        where: { id: topupProductId }
      })

      if (!topupProduct || !topupProduct.enabled) {
        return NextResponse.json({ success: false, error: "Sản phẩm nạp tự động không tồn tại hoặc đã tắt" }, { status: 404 })
      }
      
      chargePrice = (expectedPrice && expectedPrice >= topupProduct.cardValue) 
        ? Number(expectedPrice) 
        : topupProduct.sellPrice
      
      productName = topupProduct.name
      vngProductId = topupProduct.vngProductId
      cardValue = topupProduct.cardValue
    } else if (manualProduct) {
      // Truong hop nap Manual (khong co trong database)
      const basePrice = Number(manualProduct.price)
      
      // Tinh gia ban co markup
      let calculatedPrice = basePrice + (basePrice * markup / 100)
      
      // Lam tron neu bat
      if (rounding) {
        if (calculatedPrice < 100000) {
          calculatedPrice = Math.ceil(calculatedPrice / 5000) * 5000
        } else {
          calculatedPrice = Math.ceil(calculatedPrice / 10000) * 10000
        }
      }

      chargePrice = calculatedPrice
      productName = manualProduct.name
      vngProductId = manualProduct.vngProductId
      cardValue = basePrice // GIÁ GỐC GỬI CHO VNG
    }

    // ======== RATE LIMITING ========
    // Kiem tra xem user co don hang nap tu dong nao moi tao trong vong 15 giay qua khong
    const recentOrder = await prisma.topupOrder.findFirst({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(Date.now() - 15000) // 15 seconds ago
        }
      }
    })

    if (recentOrder) {
      return NextResponse.json({ 
        success: false, 
        error: "Vui lòng đợi 15 giây trước khi tạo đơn nạp tiếp theo để tránh spam." 
      }, { status: 429 })
    }

    // ======== CHECK USER BALANCE ========
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, balance: true, name: true }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "Không tìm thấy tài khoản" }, { status: 404 })
    }

    if (user.balance < chargePrice) {
      return NextResponse.json({ 
        success: false, 
        error: `Số dư không đủ. Cần ${chargePrice.toLocaleString()} VND, hiện có ${user.balance.toLocaleString()} VND`
      }, { status: 400 })
    }

    // ======== TRU TIEN & TAO DON HANG (TRANSACTION) ========
    const order = await prisma.$transaction(async (tx) => {
      // Tru tien user
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: chargePrice } }
      })

      // Tao transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: -chargePrice,
          balanceBefore: user.balance,
          balanceAfter: updatedUser.balance,
          type: "PURCHASE",
          description: `Nạp tự động: ${productName} cho ${roleName} (${roleId})`
        }
      })

      // Tao TopupOrder
      const newOrder = await tx.topupOrder.create({
        data: {
          userId: user.id,
          productId: topupProductId || null, 
          productName: productName,
          roleId,
          roleName,
          serverId,
          amount: chargePrice,
          cardValue: cardValue,
          vngProductId: vngProductId,
          status: "PENDING",
          statusLog: [{ step: "CREATED", status: "OK", time: new Date().toISOString(), detail: `Don hang tao boi ${user.name || "User"} (${topupProductId ? "Tu dong" : "Manual QR"})` }]
        }
      })

      return newOrder
    })

    // ======== XU LY NAP TU DONG (ASYNC - khong block response) ========
    // Chay xu ly nap o background, tra response cho user ngay lap tuc
    processTopupOrder(order.id).catch(err => {
      console.error("[TOPUP_API] Background processing error:", err)
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Don hang da duoc tao. He thong dang xu ly nap tu dong."
    })

  } catch (error: any) {
    console.error("[TOPUP_CREATE_ORDER]", error)
    return NextResponse.json({ success: false, error: "Loi he thong: " + error.message }, { status: 500 })
  }
}
