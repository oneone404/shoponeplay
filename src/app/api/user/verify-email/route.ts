import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "../../../../auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code } = await req.json()
    if (!code) {
      return NextResponse.json({ error: "Mã xác thực không hợp lệ" }, { status: 400 })
    }

    const email = session.user.email
    if (!email) {
      return NextResponse.json({ error: "Không tìm thấy email người dùng" }, { status: 400 })
    }

    // Find the code
    const verificationRecord = await prisma.emailVerificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() },
      },
    })

    if (!verificationRecord) {
      return NextResponse.json({ error: "Mã xác thực không đúng hoặc đã hết hạn" }, { status: 400 })
    }

    // Update user: mark email as verified
    await prisma.user.update({
      where: { id: session.user.id },
      data: { emailVerified: new Date() },
    })

    // Delete the code after use
    await prisma.emailVerificationCode.delete({
      where: { id: verificationRecord.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("VERIFY_EMAIL_ERROR", error)
    return NextResponse.json({ error: "Xác minh email thất bại" }, { status: 500 })
  }
}
