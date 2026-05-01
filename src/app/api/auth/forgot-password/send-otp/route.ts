import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/mail"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Email này chưa được đăng ký" }, { status: 404 })
    }

    // Generate 6-digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete old codes for this email and create new one
    await prisma.emailVerificationCode.deleteMany({
      where: { email },
    })
    await prisma.emailVerificationCode.create({
      data: { email, code: otp, expiresAt },
    })

    // Send Email
    await sendPasswordResetEmail(email, otp)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("FORGOT_PASSWORD_SEND_OTP_ERROR", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
