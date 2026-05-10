import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { HackVietService } from "@/lib/hackviet-service";
import { getSiteConfig } from "@/lib/configUtils";

const RESET_FEE = 5000;

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const keyValue = searchParams.get("key");

    if (!keyValue) return NextResponse.json({ error: "Thiếu mã Key" }, { status: 400 });

    // Verify key belongs to user
    const order = await prisma.hackOrder.findFirst({
      where: { userId: session.user.id, key: keyValue }
    });

    if (!order) return NextResponse.json({ error: "Key không thuộc quyền sở hữu của bạn" }, { status: 403 });

    const config = await getSiteConfig();
    const hvService = new HackVietService({
      baseUrl: config.HACKVIET_BASE_URL,
      email: config.HACKVIET_EMAIL,
      password: config.HACKVIET_PASSWORD
    });

    const details = await hvService.getKeyDetails(keyValue);
    return NextResponse.json(details);

  } catch (error: any) {
    console.error("[MANAGE_DEVICES_GET_ERROR]", error);
    return NextResponse.json({ error: error.message || "Lỗi hệ thống" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { keyValue, action, deviceIds } = body; // action: 'reset' | 'delete'

    if (!keyValue || !action) return NextResponse.json({ error: "Thông tin không hợp lệ" }, { status: 400 });

    // 1. Verify key & User balance
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.balance < RESET_FEE) {
      return NextResponse.json({ error: `Số dư không đủ. Phí quản lý thiết bị là ${RESET_FEE.toLocaleString()} VND` }, { status: 400 });
    }

    const order = await prisma.hackOrder.findFirst({
      where: { userId: session.user.id, key: keyValue }
    });
    if (!order) return NextResponse.json({ error: "Key không hợp lệ" }, { status: 403 });

    const config = await getSiteConfig();
    const hvService = new HackVietService({
      baseUrl: config.HACKVIET_BASE_URL,
      email: config.HACKVIET_EMAIL,
      password: config.HACKVIET_PASSWORD
    });

    // 2. Get system ID of the key first
    const details = await hvService.getKeyDetails(keyValue);
    const systemId = details.id;

    // 3. Execute with Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct balance
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: RESET_FEE } }
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: -RESET_FEE,
          balanceBefore: user.balance,
          balanceAfter: user.balance - RESET_FEE,
          type: "PURCHASE",
          description: `${action === 'reset' ? 'Reset' : 'Xóa'} thiết bị cho Key: ${keyValue}`,
        }
      });

      // Call External API
      if (action === 'reset') {
        return await hvService.resetDevices(systemId);
      } else {
        return await hvService.deleteDevices(systemId, deviceIds || []);
      }
    });

    return NextResponse.json({ success: true, message: "Thao tác thành công", result });

  } catch (error: any) {
    console.error("[MANAGE_DEVICES_POST_ERROR]", error);
    return NextResponse.json({ error: error.message || "Lỗi hệ thống" }, { status: 500 });
  }
}
