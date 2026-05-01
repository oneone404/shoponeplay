import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail, sendAccountVerificationEmail } from "@/lib/mail"
import { auth } from "../../../../auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email: newEmail, type } = await req.json()
    if (!newEmail || !newEmail.includes("@")) {
      return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 })
    }

    const currentEmail = session.user.email
    if (!currentEmail) {
      return NextResponse.json({ error: "Không tìm thấy email hiện tại" }, { status: 400 })
    }

    // Generate 6-digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete old codes for this email and create new one
    await prisma.emailVerificationCode.deleteMany({
      where: { email: newEmail },
    })
    await prisma.emailVerificationCode.create({
      data: { email: newEmail, code: otp, expiresAt },
    })

    // Send Email based on type
    if (type === "verify") {
      await sendAccountVerificationEmail(currentEmail, otp)
    } else {
      await sendVerificationEmail(currentEmail, otp)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("SEND_OTP_ERROR", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
