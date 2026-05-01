import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, code, password } = await req.json()

    if (!email || !code || !password) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Mật khẩu phải từ 6 ký tự" }, { status: 400 })
    }

    // Verify OTP
    const verificationRecord = await prisma.emailVerificationCode.findFirst({
      where: { email, code },
    })

    if (!verificationRecord) {
      return NextResponse.json({ error: "Mã xác nhận không chính xác" }, { status: 400 })
    }

    if (verificationRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "Mã xác nhận đã hết hạn" }, { status: 400 })
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Delete the used code
    await prisma.emailVerificationCode.delete({
      where: { id: verificationRecord.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("FORGOT_PASSWORD_RESET_ERROR", error)
    return NextResponse.json({ error: "Đã xảy ra lỗi khi đặt lại mật khẩu" }, { status: 500 })
  }
}
