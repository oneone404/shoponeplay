import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { sendTelegramNotification } from "@/lib/telegram"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { TELEGRAM_TOKEN, TELEGRAM_ID } = await req.json()

    if (!TELEGRAM_TOKEN || !TELEGRAM_ID) {
      return NextResponse.json({ error: "Thiếu Token hoặc ID" }, { status: 400 })
    }

    // Temporarily mock the sendTelegramNotification to use these values instead of DB
    // We'll use a trick: pass the config as part of the details if we were to modify it, 
    // but for now let's just use the real function which fetches from DB.
    // Wait, the user wants to test CURRENTLY ENTERED values before saving.
    
    const token = TELEGRAM_TOKEN;
    const chatId = TELEGRAM_ID;

    const message = `
🔔 <b>YÊU CẦU RÚT TIỀN MỚI</b>

👤 <b>USER ID:</b> <code>ADMIN_TEST</code>
👤 <b>TÊN SELLER:</b> ADMIN
💰 <b>SỐ TIỀN:</b> 100.000 VND
🚥 <b>STATUS:</b> TEST_SUCCESS
🏦 <b>NGÂN HÀNG:</b> MBBANK
💳 <b>STK:</b> <code>123456789</code>
👤 <b>CHỦ TK:</b> NGUYEN VAN ADMIN
📅 <b>NGÀY TẠO ĐƠN:</b> ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date()).toUpperCase()}
    `.trim();

    // Mock QR for test
    const qrUrl = `https://img.vietqr.io/image/MB-123456789-compact2.jpg?amount=100000&addInfo=TEST%20ADMIN&accountName=NGUYEN%20VAN%20ADMIN`;

    const url = `https://api.telegram.org/bot${token}/sendPhoto`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: qrUrl,
        caption: message,
        parse_mode: "HTML"
      })
    });

    const data = await response.json();
    if (!data.ok) {
      return NextResponse.json({ error: data.description }, { status: 400 })
    }

    return NextResponse.json({ message: "Success" })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 })
  }
}
