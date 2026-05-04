import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// DELETE - Xóa vĩnh viễn tài khoản lẻ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SELLER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // If SELLER, ensure they own the product this secret belongs to
    if (session.user.role === "SELLER") {
      const secret = await prisma.accountSecret.findUnique({
        where: { id: id },
        include: { product: true }
      })

      if (!secret || secret.product.uploaderId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    await prisma.accountSecret.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}

// PATCH - Cập nhật trạng thái (Bật/Tắt) tài khoản lẻ
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SELLER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status } = body // AVAILABLE or DISABLED

    // If SELLER, ensure they own the product this secret belongs to
    if (session.user.role === "SELLER") {
      const secret = await prisma.accountSecret.findUnique({
        where: { id: id },
        include: { product: true }
      })

      if (!secret || secret.product.uploaderId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    await prisma.accountSecret.update({
      where: { id: id },
      data: { 
        status: status,
        // Also update isSold if needed for backward compatibility or simple logic
        // But status is better. Let's ensure the checkout logic filters by status=AVAILABLE
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
