import { NextResponse } from "next/server";
import { verify, createGuardrails } from "otplib";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { code, secret } = await req.json();

    if (!code || !secret) {
      return NextResponse.json({ error: "Thiếu mã xác thực hoặc secret" }, { status: 400 });
    }

    // Verify the code against the secret
    // Use custom guardrails to allow shorter secrets if needed
    const isValid = await verify({ 
      token: code, 
      secret,
      guardrails: createGuardrails({ MIN_SECRET_BYTES: 6 })
    });

    if (!isValid) {
      return NextResponse.json({ error: "Mã xác thực không chính xác hoặc đã hết hạn" }, { status: 400 });
    }

    // Save the secret and enable 2FA for the user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Kích hoạt bảo mật 2 lớp thành công" 
    });
  } catch (error) {
    console.error("2FA verify error:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
