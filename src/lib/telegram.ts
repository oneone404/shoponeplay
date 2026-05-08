import { prisma } from "./prisma";

/**
 * Lấy cấu hình Telegram từ Database
 */
async function getTelegramConfig() {
  const configs = await prisma.config.findMany({
    where: {
      key: {
        in: ["TELEGRAM_TOKEN", "TELEGRAM_ID", "TELEGRAM_ENABLED", "TELEGRAM_NOTIFY_ORDER", "TELEGRAM_NOTIFY_WITHDRAW"]
      }
    }
  });

  const configMap = new Map(configs.map(c => [c.key, c.value]));

  return {
    token: configMap.get("TELEGRAM_TOKEN"),
    chatId: configMap.get("TELEGRAM_ID"),
    isEnabled: configMap.get("TELEGRAM_ENABLED") === "true",
    notifyOrder: configMap.get("TELEGRAM_NOTIFY_ORDER") === "true",
    notifyWithdraw: configMap.get("TELEGRAM_NOTIFY_WITHDRAW") === "true"
  };
}

/**
 * Thông báo yêu cầu rút tiền mới
 */
export async function sendWithdrawalNotification(details: {
  userId: string;
  userName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  createdAt: Date;
  withdrawalId: string;
}, configOverride?: { token: string; chatId: string }) {
  try {
    const config = configOverride || await getTelegramConfig();
    const isTest = !!configOverride;

    // Nếu không phải test thì mới check Enabled
    if (!isTest) {
      const dbConfig = config as any;
      if (!dbConfig.isEnabled || !dbConfig.notifyWithdraw || !config.token || !config.chatId) return;
    }

    const formattedDate = new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(details.createdAt);

    const message = `
${isTest ? "⚠️ <b>[TEST MESSAGE]</b>\n" : ""}🔔 <b>YÊU CẦU RÚT TIỀN MỚI</b>

👤 <b>USER ID:</b> <code>${details.userId.toUpperCase()}</code>
👤 <b>TÊN SELLER:</b> ${details.userName.toUpperCase()}
💰 <b>SỐ TIỀN:</b> ${new Intl.NumberFormat("vi-VN").format(details.amount)} VND
🚥 <b>STATUS:</b> ${isTest ? "TEST_SUCCESS" : "PENDING"}
🏦 <b>NGÂN HÀNG:</b> ${details.bankName.toUpperCase()}
💳 <b>STK:</b> <code>${details.accountNumber}</code>
👤 <b>CHỦ TK:</b> ${details.accountName.toUpperCase()}
📅 <b>NGÀY TẠO ĐƠN:</b> ${formattedDate.toUpperCase()}
    `.trim();

    // Improve bank ID extraction
    // Example: "Vietcombank (VCB)" -> "VCB", "MOMO" -> "MOMO"
    const bankMatch = details.bankName.match(/\(([^)]+)\)/);
    const bankShortName = bankMatch ? bankMatch[1] : details.bankName.trim();

    const bankMapping: Record<string, string> = {
      "vcb": "VCB", "vietcombank": "VCB",
      "tcb": "TCB", "techcombank": "TCB",
      "mb": "MB", "mbbank": "MB", "mb bank": "MB",
      "acb": "ACB",
      "vpb": "VPB", "vpbank": "VPB",
      "tpb": "TPB", "tpbank": "TPB",
      "stb": "STB", "sacombank": "STB",
      "bidv": "BIDV",
      "vba": "VBA", "agribank": "VBA",
      "icb": "ICB", "vietinbank": "ICB",
      "shb": "SHB",
      "hdb": "HDB", "hdbank": "HDB",
      "ocb": "OCB",
      "msb": "MSB",
      "lpb": "LPB", "lienvietpostbank": "LPB",
      "seab": "SEAB", "seabank": "SEAB",
      "eib": "EIB", "eximbank": "EIB",
      "vib": "VIB",
      "nab": "NAB", "nam a bank": "NAB",
      "bab": "BAB", "bac a bank": "BAB",
      "momo": "MOMO", "zalopay": "ZALOPAY"
    };

    const bankId = bankMapping[bankShortName.toLowerCase()] || bankShortName.toUpperCase().replace(/\s+/g, "");
    
    // URL Encode all parameters for safety
    const addInfo = encodeURIComponent(`RT ${details.userId.slice(-6).toUpperCase()}`);
    const accountName = encodeURIComponent(details.accountName.toUpperCase());
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${details.accountNumber}-compact2.jpg?amount=${details.amount}&addInfo=${addInfo}&accountName=${accountName}`;

    // Try sending photo first
    try {
      const url = `https://api.telegram.org/bot${config.token}/sendPhoto`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: config.chatId,
          photo: qrUrl,
          caption: message,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                { 
                  text: "✅ HOÀN THÀNH", 
                  callback_data: isTest ? "test_done" : `wd_done_${details.withdrawalId}` 
                },
                { 
                  text: "❌ HUỶ BỎ", 
                  callback_data: isTest ? "test_cancel" : `wd_cancel_${details.withdrawalId}` 
                }
              ]
            ]
          }
        })
      });

      const result = await res.json();
      if (result.ok) return result;
      
      // If photo fails, log it and fall through to sendMessage
      console.warn("[TELEGRAM_PHOTO_FAILED]", result);
    } catch (err) {
      console.error("[TELEGRAM_PHOTO_EXCEPTION]", err);
    }

    // Fallback to text message if photo fails
    const textUrl = `https://api.telegram.org/bot${config.token}/sendMessage`;
    const textRes = await fetch(textUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message + "\n\n⚠️ (Không thể tạo mã QR, vui lòng chuyển khoản thủ công)",
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              { 
                text: "✅ HOÀN THÀNH", 
                callback_data: isTest ? "test_done" : `wd_done_${details.withdrawalId}` 
              },
              { 
                text: "❌ HUỶ BỎ", 
                callback_data: isTest ? "test_cancel" : `wd_cancel_${details.withdrawalId}` 
              }
            ]
          ]
        }
      })
    });

    return await textRes.json();
  } catch (error) {
    console.error("[TELEGRAM_WITHDRAW_EXCEPTION]", error);
    throw error;
  }
}

/**
 * Thông báo đơn hàng mới
 */
export async function sendOrderNotification(details: {
  orderId: string;
  userName: string;
  userEmail?: string;
  totalAmount: number;
  items: { title: string; quantity: number; price: number }[];
  createdAt: Date;
}, configOverride?: { token: string; chatId: string }) {
  try {
    const config = configOverride || await getTelegramConfig();
    const isTest = !!configOverride;

    if (!isTest) {
      const dbConfig = config as any;
      if (!dbConfig.isEnabled || !dbConfig.notifyOrder || !config.token || !config.chatId) return;
    }

    const formattedDate = new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(details.createdAt);

    const itemsList = details.items
      .map(item => `• ${item.title} x${item.quantity} (${new Intl.NumberFormat("vi-VN").format(item.price)} VND)`)
      .join("\n");

    const message = `
${isTest ? "⚠️ <b>[TEST MESSAGE]</b>\n" : ""}🛒 <b>CẬP NHẬT ĐƠN HÀNG MỚI</b>

🆔 <b>MÃ ĐƠN:</b> <code>#${details.orderId.slice(-12).toUpperCase()}</code>
👤 <b>KHÁCH HÀNG:</b> ${details.userName.toUpperCase()}
${details.userEmail ? `📧 <b>EMAIL:</b> <code>${details.userEmail}</code>` : ""}
💰 <b>TỔNG THANH TOÁN:</b> <b>${new Intl.NumberFormat("vi-VN").format(details.totalAmount)} VND</b>

📦 <b>SẢN PHẨM:</b>
${itemsList}

📅 <b>THỜI GIAN:</b> ${formattedDate.toUpperCase()}
${isTest ? "✅ <i>Đây Là Thông Báo Kiểm Tra Hệ Thống.</i>" : "✅ <i>Tài Khoản Đã Được Cung Cấp Cho Khách Hàng.</i>"}
    `.trim();

    const url = `https://api.telegram.org/bot${config.token}/sendMessage`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: "HTML",
      })
    });

    return await res.json();
  } catch (error) {
    console.error("[TELEGRAM_ORDER_EXCEPTION]", error);
    throw error;
  }
}

/**
 * Hàm cũ (để tương thích ngược nếu cần, nên chuyển sang dùng hàm mới)
 */
export const sendTelegramNotification = sendWithdrawalNotification;
