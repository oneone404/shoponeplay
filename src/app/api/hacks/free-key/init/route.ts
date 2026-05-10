import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/configUtils";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để nhận key miễn phí." }, { status: 401 });
    }

    const { hackId } = await req.json();
    if (!hackId) return NextResponse.json({ error: "Thiếu thông tin bản hack." }, { status: 400 });

    const [config, hack] = await Promise.all([
      getSiteConfig(),
      prisma.hackTool.findUnique({ where: { id: hackId } })
    ]);

    if (!hack) return NextResponse.json({ error: "Bản hack không tồn tại." }, { status: 404 });
    if (!config.LINK4M_API_TOKEN) return NextResponse.json({ error: "Hệ thống chưa cấu hình Link4M Token." }, { status: 500 });

    // 1. Check if user already has a pending session in last 30 mins
    const existingSession = await prisma.freeKeySession.findFirst({
      where: {
        hackId: hack.id,
        visitorId: session.user.id,
        status: "PENDING",
        createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) }
      }
    });

    if (existingSession) {
      // Return existing shortened link
      const shortUrl = await getShortenedLink(config.LINK4M_API_TOKEN, existingSession.token);
      return NextResponse.json({ success: true, shortUrl });
    }

    // 2. Create new local session
    const localToken = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999); // Expire at end of day

    await prisma.freeKeySession.create({
      data: {
        token: localToken,
        hackId: hack.id,
        visitorId: session.user.id,
        status: "PENDING",
        expiresAt
      }
    });

    // 3. Shorten with Link4M
    const shortUrl = await getShortenedLink(config.LINK4M_API_TOKEN, localToken);

    return NextResponse.json({ success: true, shortUrl });

  } catch (error: any) {
    console.error("[FREE_KEY_INIT_ERROR]", error);
    return NextResponse.json({ error: error.message || "Đã có lỗi xảy ra." }, { status: 500 });
  }
}

async function getShortenedLink(apiToken: string, localToken: string) {
  // Construct our verify URL
  const destinationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://shoponeplay.com'}/app/hacks/free-key/verify?token=${localToken}`;
  
  const link4mUrl = `https://link4m.co/api-shorten/v2?api=${apiToken}&url=${encodeURIComponent(destinationUrl)}`;
  
  const res = await fetch(link4mUrl);
  const data = await res.json();
  
  if (data.status === "success") {
    return data.shortenedUrl;
  } else {
    throw new Error(data.message || "Lỗi khi rút gọn link Link4M");
  }
}
