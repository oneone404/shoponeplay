import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { HackVietService } from "@/lib/hackviet-service";
import { getSiteConfig } from "@/lib/configUtils";

function parseDuration(label: string): { value: number, type: 'day' | 'week' | 'month' } {
  const lower = label.toLowerCase();
  const num = parseInt(label) || 1;
  
  if (lower.includes('ngày')) return { value: num, type: 'day' };
  if (lower.includes('tuần')) return { value: num * 7, type: 'day' };
  if (lower.includes('tháng')) return { value: num * 30, type: 'day' };
  if (lower.includes('năm')) return { value: num * 365, type: 'day' };
  
  return { value: num, type: 'day' };
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.name) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để mua key." }, { status: 401 });
    }

    const [body, config] = await Promise.all([
      req.json(),
      getSiteConfig()
    ]);

    const { hackId, durationLabel, machines } = body;

    if (!hackId || !durationLabel || !machines || machines < 1) {
      return NextResponse.json({ error: "Thông tin đơn hàng không hợp lệ." }, { status: 400 });
    }

    // 1. Get Hack Tool
    const hack = await prisma.hackTool.findUnique({
      where: { id: hackId }
    });

    if (!hack || hack.status === "HIDDEN") {
      return NextResponse.json({ error: "Bản hack không tồn tại hoặc đã bị ẩn." }, { status: 404 });
    }

    if (hack.status === "MAINTENANCE") {
      return NextResponse.json({ error: "Bản hack đang bảo trì, vui lòng quay lại sau." }, { status: 403 });
    }

    if (!hack.externalId) {
      return NextResponse.json({ error: "Bản hack chưa được cấu hình API đối tác." }, { status: 400 });
    }

    // 2. Get Base Price
    const prices = hack.prices as any[];
    const selectedPrice = prices.find((p: any) => p.label === durationLabel);

    if (!selectedPrice) {
      return NextResponse.json({ error: "Gói giá không hợp lệ." }, { status: 400 });
    }

    const basePrice = selectedPrice.price;
    const totalPrice = basePrice + (machines - 1) * (basePrice / 2);

    // 3. Check User Balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: "Người dùng không tồn tại." }, { status: 404 });
    }

    if (user.balance < totalPrice) {
      return NextResponse.json({ error: "Số dư tài khoản không đủ. Vui lòng nạp thêm." }, { status: 400 });
    }

    // 4. Initialize Service with DB Config
    console.log(`[DEBUG] DB CONFIG: URL=${config.HACKVIET_BASE_URL}, EMAIL=${config.HACKVIET_EMAIL}`);
    const hvService = new HackVietService({
      baseUrl: config.HACKVIET_BASE_URL,
      email: config.HACKVIET_EMAIL,
      password: config.HACKVIET_PASSWORD
    });

    // 5. Execute Transaction & External API Call
    const duration = parseDuration(durationLabel);
    const emailPrefix = user.email?.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase() || "USER";
    const keyPrefix = emailPrefix;

    const order = await prisma.$transaction(async (tx) => {
      // Deduct balance
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: totalPrice } }
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: -totalPrice,
          balanceBefore: user.balance,
          balanceAfter: user.balance - totalPrice,
          type: "PURCHASE",
          description: `Mua Key: ${hack.name} (${durationLabel} - ${machines} máy)`,
        }
      });

      // CALL HACKVIET API
      const hvRes = await hvService.createVipKey({
        game_id: hack.externalId!,
        duration_value: duration.value,
        duration_type: 'day',
        device_limit: machines,
        key_prefix: keyPrefix
      });

      const externalKey = hvRes.data[0].key;

      // Update hack tool total downloads/sales
      await tx.hackTool.update({
        where: { id: hack.id },
        data: { totalDownload: { increment: 1 } }
      });

      // Create hack order
      const hackOrder = await tx.hackOrder.create({
        data: {
          userId: user.id,
          hackId: hack.id,
          duration: durationLabel,
          machines: machines,
          totalPrice: totalPrice,
          key: externalKey,
          status: "COMPLETED"
        }
      });

      // Create general order for central history
      await tx.order.create({
        data: {
          id: hackOrder.id, // Use same ID for easy mapping
          userId: user.id,
          totalAmount: totalPrice,
          status: "COMPLETED",
          items: {
            create: [
              {
                quantity: 1,
                priceAtPurchase: totalPrice,
                titleSnapshot: `KEY VIP: ${hack.name}`,
                typeSnapshot: "HACK"
              }
            ]
          }
        }
      });

      return hackOrder;
    });

    return NextResponse.json({ 
      success: true, 
      message: "Mua key thành công!",
      order 
    });

  } catch (error: any) {
    console.error("[HACK_PURCHASE_ERROR]", error);
    return NextResponse.json({ error: error.message || "Đã có lỗi xảy ra." }, { status: 500 });
  }
}
