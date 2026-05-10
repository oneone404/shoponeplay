/**
 * API: Kiem tra trang thai don nap tu dong
 * GET /api/topup/status?orderId=xxx
 */

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Chua dang nhap" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Thieu orderId" }, { status: 400 })
    }

    const order = await prisma.topupOrder.findUnique({
      where: { id: orderId },
      include: { product: { select: { name: true, vngProductId: true } } }
    })

    if (!order) {
      return NextResponse.json({ success: false, error: "Don hang khong ton tai" }, { status: 404 })
    }

    // Chi cho phep user xem don cua chinh minh
    if (order.userId !== session.user.id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Khong co quyen xem don hang nay" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        productName: order.product.name,
        roleId: order.roleId,
        roleName: order.roleName,
        amount: order.amount,
        retryCount: order.retryCount,
        errorMessage: order.errorMessage,
        statusLog: order.statusLog,
        createdAt: order.createdAt,
        completedAt: order.completedAt,
      }
    })
  } catch (error: any) {
    console.error("[TOPUP_STATUS]", error)
    return NextResponse.json({ success: false, error: "Loi he thong" }, { status: 500 })
  }
}
