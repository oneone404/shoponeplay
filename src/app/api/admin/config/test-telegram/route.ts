import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { sendWithdrawalNotification, sendOrderNotification, sendTestTopupQRNotification } from "@/lib/telegram"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { TELEGRAM_TOKEN, TELEGRAM_ID, testType } = await req.json()

    if (!TELEGRAM_TOKEN || !TELEGRAM_ID) {
      return NextResponse.json({ error: "Thiếu Token hoặc ID" }, { status: 400 })
    }

    const configOverride = {
      token: TELEGRAM_TOKEN,
      chatId: TELEGRAM_ID
    }

    let result;

    if (testType === "order") {
      result = await sendOrderNotification({
        orderId: "TEST_ORDER_123",
        userName: "Người Mua Demo",
        userEmail: "admin_test@shoponeplay.vn",
        totalAmount: 500000,
        items: [
          { title: "Tài Khoản Play 1", quantity: 1, price: 200000 },
          { title: "Tài Khoản Play 2", quantity: 1, price: 300000 }
        ],
        createdAt: new Date()
      }, configOverride)
    } else if (testType === "topup_qr") {
      result = await sendTestTopupQRNotification(configOverride)
    } else {
      // Mặc định test withdrawal
      result = await sendWithdrawalNotification({
        userId: "ADMIN_TEST",
        userName: "Nguyễn Văn Admin",
        amount: 100000,
        bankName: "MBBANK",
        accountNumber: "123456789",
        accountName: "NGUYEN VAN ADMIN",
        createdAt: new Date(),
        withdrawalId: "TEST_WD_001"
      }, configOverride)
    }

    if (!result.ok) {
      return NextResponse.json({ error: result.description || "Lỗi gửi tin nhắn" }, { status: 400 })
    }

    return NextResponse.json({ message: "Success" })

  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || "Lỗi Server" }, { status: 500 })
  }
}
