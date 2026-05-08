import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId, optionId, customerData } = body;

    // 1. Kiểm tra sự tồn tại của dịch vụ và gói
    const service = await prisma.gameService.findUnique({
      where: { id: serviceId, status: 'ACTIVE' }
    });

    const option = await prisma.serviceOption.findUnique({
      where: { id: optionId, status: 'ACTIVE', serviceId: serviceId }
    });

    if (!service || !option) {
      return NextResponse.json({ error: "Dịch vụ hoặc gói không tồn tại" }, { status: 404 });
    }

    // 2. Kiểm tra số dư người dùng (Dùng Transaction để đảm bảo tính nhất quán)
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { balance: true }
      });

      if (!user || user.balance < option.price) {
        throw new Error("Số dư tài khoản không đủ");
      }

      // 3. Trừ tiền người dùng
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: {
          balance: { decrement: option.price }
        }
      });

      // 4. Tạo bản ghi giao dịch (Ledger)
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          amount: -option.price,
          balanceBefore: user.balance,
          balanceAfter: updatedUser.balance,
          type: 'PURCHASE',
          description: `Mua dịch vụ: ${service.name} - Gói: ${option.name}`
        }
      });

      // 5. Tạo đơn hàng dịch vụ
      const order = await tx.serviceOrder.create({
        data: {
          serviceId,
          optionId,
          userId: session.user.id,
          customerData,
          totalAmount: option.price,
          status: 'PENDING'
        }
      });

      // 6. Ghi lại hoạt động người dùng
      await tx.userActivity.create({
        data: {
          userId: session.user.id,
          type: "SERVICE_ORDER",
          details: `Đặt đơn hàng dịch vụ #${order.id.slice(-8).toUpperCase()}`
        }
      });

      return NextResponse.json({ success: true, orderId: order.id });
    });

  } catch (error: any) {
    console.error("[SERVICE_CHECKOUT_ERROR]", error);
    return NextResponse.json({ error: error.message || "Đã xảy ra lỗi khi thanh toán" }, { status: 500 });
  }
}
