import { prisma } from "./prisma";

export async function sendTelegramNotification(details: {
  userId: string;
  userName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  createdAt: Date;
  withdrawalId: string;
}) {
  try {
    // Fetch Telegram Config from DB
    const configs = await prisma.config.findMany({
      where: {
        key: {
          in: ["TELEGRAM_TOKEN", "TELEGRAM_ID", "TELEGRAM_ENABLED"]
        }
      }
    });

    const configMap = new Map(configs.map(c => [c.key, c.value]));
    
    const token = configMap.get("TELEGRAM_TOKEN");
    const chatId = configMap.get("TELEGRAM_ID");
    const isEnabled = configMap.get("TELEGRAM_ENABLED") === "true";

    if (!isEnabled || !token || !chatId) {
      console.log("[TELEGRAM] Notification skipped: Config missing or disabled.");
      return;
    }

    const formattedDate = new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(details.createdAt);

    const message = `
🔔 <b>YÊU CẦU RÚT TIỀN MỚI</b>

👤 <b>USER ID:</b> <code>${details.userId.toUpperCase()}</code>
👤 <b>TÊN SELLER:</b> ${details.userName.toUpperCase()}
💰 <b>SỐ TIỀN:</b> ${new Intl.NumberFormat("vi-VN").format(details.amount)} VND
🚥 <b>STATUS:</b> PENDING
🏦 <b>NGÂN HÀNG:</b> ${details.bankName.toUpperCase()}
💳 <b>STK:</b> <code>${details.accountNumber}</code>
👤 <b>CHỦ TK:</b> ${details.accountName.toUpperCase()}
📅 <b>NGÀY TẠO ĐƠN:</b> ${formattedDate.toUpperCase()}
    `.trim();

    const bankMapping: Record<string, string> = {
      "mbbank": "MB",
      "mb": "MB",
      "vietcombank": "VCB",
      "vcb": "VCB",
      "vietinbank": "ICB",
      "vtb": "ICB",
      "techcombank": "TCB",
      "tcb": "TCB",
      "agribank": "VBA",
      "bidv": "BIDV",
      "sacombank": "STB",
      "stb": "STB",
      "tpbank": "TPB",
      "acb": "ACB",
      "vpbank": "VPB",
      "hdbank": "HDB",
      "vib": "VIB",
    };

    const bankId = bankMapping[details.bankName.toLowerCase()] || details.bankName.toUpperCase();

    // VietQR URL for fast payment
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${details.accountNumber}-compact2.jpg?amount=${details.amount}&addInfo=RT%20${details.userId}&accountName=${encodeURIComponent(details.accountName)}`;

    const url = `https://api.telegram.org/bot${token}/sendPhoto`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: qrUrl,
        caption: message,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ HOÀN THÀNH", callback_data: `wd_done_${details.withdrawalId}` },
              { text: "❌ HUỶ BỎ", callback_data: `wd_cancel_${details.withdrawalId}` }
            ]
          ]
        }
      })
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("[TELEGRAM_ERROR]", data);
    } else {
      console.log("[TELEGRAM] Notification sent successfully.");
    }
  } catch (error) {
    console.error("[TELEGRAM_EXCEPTION]", error);
  }
}
