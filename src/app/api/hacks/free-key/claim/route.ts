import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/configUtils";
import { HackVietService } from "@/lib/hackviet-service";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 });
    }

    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Thiếu mã xác thực." }, { status: 400 });

    // 1. Validate local session
    const localSession = await prisma.freeKeySession.findUnique({
      where: { token },
      include: { hack: true }
    });

    if (!localSession || localSession.visitorId !== session.user.id) {
      return NextResponse.json({ error: "Phiên làm việc không hợp lệ." }, { status: 403 });
    }

    if (localSession.status === "CLAIMED") {
      return NextResponse.json({ success: true, key: localSession.key });
    }

    // 2. Check anti-cheat (time delay)
    const timeElapsed = Date.now() - localSession.createdAt.getTime();
    if (timeElapsed < 60 * 1000) { // Minimum 60 seconds
      return NextResponse.json({ 
        error: "Thao tác quá nhanh! Vui lòng vượt link quảng cáo trước khi nhận key.",
        isTooFast: true,
        remaining: Math.ceil((60 * 1000 - timeElapsed) / 1000)
      }, { status: 429 });
    }

    // 3. Start HackViet Flow
    const config = await getSiteConfig();
    const hvService = new HackVietService({
      baseUrl: config.HACKVIET_BASE_URL,
      email: config.HACKVIET_EMAIL,
      password: config.HACKVIET_PASSWORD
    });

    const shopSlug = config.HACKVIET_SHOP_SLUG || "shop-82-kcvara";
    // HackViet yêu cầu game_slug dạng chữ (vd: play-together)
    const gameSlug = localSession.hack.slug;

    // STEP 1: Init Session on HackViet
    const { session_code, cookies: initCookies } = await hvService.initFreeKeySession(shopSlug, gameSlug);

    // STEP 2: Bypass (Simulate ad viewing)
    const finalCookies = await hvService.bypassFreeKeyLink(session_code, shopSlug, initCookies);

    // STEP 3: Claim Key
    const claimRes = await hvService.claimFreeKey(session_code, finalCookies, shopSlug);

    if (claimRes.success) {
      const finalKey = claimRes.data.key;

      // 4. Update DB
      await prisma.freeKeySession.update({
        where: { id: localSession.id },
        data: {
          sessionCode: session_code,
          status: "CLAIMED",
          key: finalKey
        }
      });

      return NextResponse.json({ 
        success: true, 
        key: finalKey,
        message: "Chúc mừng! Bạn đã nhận key 24h thành công." 
      });
    } else {
      throw new Error(claimRes.message || "Lấy key từ đối tác thất bại.");
    }

  } catch (error: any) {
    console.error("[FREE_KEY_CLAIM_ERROR]", error);
    return NextResponse.json({ error: error.message || "Đã có lỗi xảy ra." }, { status: 500 });
  }
}
