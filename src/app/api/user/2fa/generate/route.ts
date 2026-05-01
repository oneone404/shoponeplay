import { NextResponse } from "next/server";
import { generateSecret, generateURI } from "otplib";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // Generate a new secret (shorter length: 10 bytes = 16 base32 chars)
    const secret = generateSecret({ length: 10 });
    
    // Generate otpauth URL (optional but good for future QR codes)
    const otpauth = generateURI({
      issuer: "ShopOnePlay",
      label: session.user.email || "user",
      secret
    });

    return NextResponse.json({ 
      success: true, 
      secret,
      otpauth 
    });
  } catch (error) {
    console.error("2FA generate error:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
