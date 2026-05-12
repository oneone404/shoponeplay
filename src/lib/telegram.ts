import { prisma } from "./prisma";

/**
 * Lấy cấu hình Telegram từ Database
 */
async function getTelegramConfig() {
  const configs = await prisma.config.findMany({
    where: {
      key: {
        in: ["TELEGRAM_TOKEN", "TELEGRAM_ID", "TELEGRAM_ENABLED", "TELEGRAM_NOTIFY_ORDER", "TELEGRAM_NOTIFY_WITHDRAW", "TELEGRAM_NOTIFY_TOPUP_QR"]
      }
    }
  });

  console.log("[TELEGRAM_DEBUG] Found config keys:", configs.map(c => c.key));

  const configMap = new Map(configs.map(c => [c.key, c.value]));

  return {
    token: configMap.get("TELEGRAM_TOKEN") || "",
    chatId: configMap.get("TELEGRAM_ID") || "",
    isEnabled: configMap.get("TELEGRAM_ENABLED") === "true",
    notifyOrder: configMap.get("TELEGRAM_NOTIFY_ORDER") === "true",
    notifyWithdraw: configMap.get("TELEGRAM_NOTIFY_WITHDRAW") === "true",
    notifyTopupQr: configMap.get("TELEGRAM_NOTIFY_TOPUP_QR") === "true"
  };
}

/**
 * Gửi ảnh dạng Buffer (để tránh lỗi Telegram crawler), fallback sang text nếu lỗi tải ảnh
 */
async function sendTelegramPhotoWithFallback(
  config: { token: string; chatId: string },
  photoUrl: string,
  message: string,
  replyMarkup?: any
) {
  try {
    const res = await fetch(photoUrl);
    if (!res.ok) throw new Error(`Lỗi tải ảnh: HTTP ${res.status}`);

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("image")) {
      throw new Error(`Định dạng không phải ảnh: ${contentType}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: contentType });

    const formData = new FormData();
    formData.append("chat_id", config.chatId);
    formData.append("caption", message);
    formData.append("parse_mode", "HTML");
    if (replyMarkup) formData.append("reply_markup", JSON.stringify(replyMarkup));
    formData.append("photo", blob, "qrcode.png");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const tgRes = await fetch(`https://api.telegram.org/bot${config.token}/sendPhoto`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeout);

    const tgData = await tgRes.json();
    if (!tgData.ok) {
      if (tgData.error_code === 429) {
        throw new Error(`RATE_LIMIT:${tgData.parameters?.retry_after || 5}`);
      }
      throw new Error(`Lỗi Telegram: ${tgData.description}`);
    }
    return tgData;
  } catch (error: any) {
    if (error.message?.startsWith("RATE_LIMIT:")) throw error;

    console.warn("[TELEGRAM_PHOTO_FAILED] Fallback to text:", error.message || error);
    const textUrl = `https://api.telegram.org/bot${config.token}/sendMessage`;
    const textRes = await fetch(textUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message + "\n\n⚠️ <i>(Ảnh QR tạm thời không khả dụng, hãy nhập thủ công hoặc tạo mã thủ công)</i>",
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: replyMarkup
      })
    });
    return await textRes.json();
  }
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
    const qrUrl = `https://qr.sepay.vn/img?acc=${details.accountNumber}&bank=${bankId}&amount=${details.amount}&des=${addInfo}`;

    const replyMarkup = {
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
    };

    return await sendTelegramPhotoWithFallback(config as { token: string; chatId: string }, qrUrl, message, replyMarkup);
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

/**
 * Thông báo nạp gói thành công/lỗi (Topup)
 */
export async function sendTopupNotification(details: {
  order: any;
  type: "SUCCESS" | "ERROR";
  detail: string;
}) {
  try {
    const config = await getTelegramConfig();
    if (!config.isEnabled || !config.token || !config.chatId) return;

    const { order, type, detail } = details;
    const icon = type === "SUCCESS" ? "✅" : "❌";
    const statusText = type === "SUCCESS" ? "NẠP THÀNH CÔNG" : "LỖI NẠP TỰ ĐỘNG";

    const message = `
${icon} <b>${statusText}</b>

<b>ĐƠN HÀNG:</b> <code>#${order.id.slice(-8).toUpperCase()}</code>
<b>NHÂN VẬT:</b> ${order.roleName} (ID: ${order.roleId})
<b>GÓI:</b> ${order.productName || order.product?.name || "N/A"}
<b>SỐ TIỀN:</b> ${order.amount?.toLocaleString()} VND
<b>CHI TIẾT:</b> ${detail}
<b>THỜI GIAN:</b> ${new Date().toLocaleString("vi-VN")}
    `.trim();

    const url = `https://api.telegram.org/bot${config.token}/sendMessage`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: "HTML",
      })
    });
  } catch (error) {
    console.error("[TELEGRAM_TOPUP_EXCEPTION]", error);
  }
}

/**
 * Gửi mã QR nạp tiền vào Telegram Admin (Manual QR)
 */
export async function sendTopupQRNotification(orderId: string) {
  try {
    const config = await getTelegramConfig();
    console.log("[TELEGRAM_QR] Notification attempt:", { orderId, hasToken: !!config.token, hasChatId: !!config.chatId });

    // Check if enabled
    if (!config.isEnabled || !config.notifyTopupQr || !config.token || !config.chatId) {
      console.warn("[TELEGRAM_QR] Aborted: Disabled or Config missing");
      return;
    }

    const order = await prisma.topupOrder.findUnique({
      where: { id: orderId },
      include: { user: true }
    });
    if (!order || !order.vngQrCode) {
      console.warn("[TELEGRAM_QR] Aborted: Order or QR code not found");
      return;
    }

    let qrImageUrl = "";
    let bankInfoText = "";

    // Thu bóc tách JSON de lay STK/Ngan hang (VietQR)
    try {
      if (order.vngQrCode?.startsWith("{")) {
        const qrData = JSON.parse(order.vngQrCode);
        const bankMapping: Record<string, string> = {
          "vietcombank": "VCB", "vcb": "VCB", "ngoai thuong": "VCB",
          "vietinbank": "ICB", "icb": "ICB", "cong thuong": "ICB",
          "bidv": "BIDV", "dau tu": "BIDV",
          "agribank": "VBA", "vba": "VBA", "nong nghiep": "VBA",
          "mbbank": "MB", "mb": "MB", "quan doi": "MB",
          "techcombank": "TCB", "tcb": "TCB", "ky thuong": "TCB",
          "acb": "ACB", "a chau": "ACB",
          "tpbank": "TPB", "tien phong": "TPB",
          "sacombank": "STB", "stb": "STB",
          "vpbank": "VPB", "thinh vuong": "VPB",
          "msb": "MSB", "hang hai": "MSB",
          "shb": "SHB",
          "hdbank": "HDB", "hdb": "HDB",
          "ocb": "OCB", "phuong dong": "OCB",
          "vib": "VIB",
        };

        const bankShortName = qrData.bankName?.toLowerCase() || "";
        // Tim bankId tu mapping hoac lay chu dau tien (vi du: "Vietcombank (VCB)" -> "Vietcombank")
        const bankId = bankMapping[bankShortName] ||
          bankMapping[bankShortName.split(" ")[0]] ||
          bankShortName.toUpperCase().replace(/\s+/g, "");

        const amount = order.cardValue;
        const addInfo = encodeURIComponent(order.vngOrderNumber || `TOPUP ${order.id.slice(-6)}`);

        if (qrData.bankAccount && bankId) {
          // Luon dung SePay QR
          qrImageUrl = `https://qr.sepay.vn/img?acc=${qrData.bankAccount}&bank=${bankId}&amount=${amount}&des=${addInfo}`;

          bankInfoText = `
🏦 <b>NGÂN HÀNG:</b> <code>${qrData.bankName}</code>
💳 <b>SỐ TÀI KHOẢN:</b> <code>${qrData.bankAccount}</code>
👤 <b>CHỦ TÀI KHOẢN:</b> <code>${qrData.bankAccountName}</code>`;
        }
      }
    } catch (e) {
      console.error("[TELEGRAM_QR] Bank info extraction failed:", e);
    }

    // Neu khong co anh VietQR thi thong bao loi (Khong dung QR den trang nua)
    if (!qrImageUrl) {
      console.error("[TELEGRAM_QR] Could not generate VietQR image - Missing Bank Info");
      // Co the fallback ve text thong bao thieu thong tin
      qrImageUrl = "https://placehold.co/400x400?text=LOI+TAO+MA+QR+BANK";
    }

    const caption = `
🔔 <b>ĐƠN NẠP MANUAL (VIETQR)</b>
${bankInfoText}
💰 <b>SỐ TIỀN:</b> <code>${order.cardValue.toLocaleString()} VND</code>
---------------------------
👤 <b>KHÁCH HÀNG:</b> ${order.user.name || "N/A"}
🎮 <b>NHÂN VẬT:</b> ${order.roleName} (ID: ${order.roleId})
🎁 <b>GÓI NẠP:</b> ${order.productName || "N/A"}
📅 <b>NGÀY TẠO:</b> <code>${order.createdAt.toLocaleString("vi-VN")}</code>
🔖 <b>MÃ ĐƠN VNG:</b> <code>${order.vngOrderNumber || "N/A"}</code>

⚠️ <i>Mã QR Sử Dụng Đến: ${order.vngQrExpiredAt?.toLocaleTimeString("vi-VN")}</i>
#ID:<code>${order.id}</code>`.trim();

    const replyMarkup = {
      inline_keyboard: [
        [
          { text: "✅ ĐÃ THANH TOÁN", callback_data: `topqr_done_${order.id}` },
          { text: "🔄 TẠO LẠI QR", callback_data: `topqr_retry_${order.id}` }
        ]
      ]
    };

    const sendWithRetry = async (attempt = 1): Promise<void> => {
      console.log(`[TELEGRAM_QR] Attempt ${attempt}...`);
      try {
        await sendTelegramPhotoWithFallback(config as { token: string; chatId: string }, qrImageUrl, caption, replyMarkup);
      } catch (err: any) {
        if (err.message?.startsWith("RATE_LIMIT:") && attempt < 3) {
          const retryAfter = parseInt(err.message.split(":")[1] || "5") * 1000;
          await new Promise(resolve => setTimeout(resolve, retryAfter));
          return sendWithRetry(attempt + 1);
        }
        throw err;
      }
    };

    await sendWithRetry();
    return { ok: true };
  } catch (error: any) {
    console.error("[TELEGRAM_QR_EXCEPTION]", error.message || error);
    return { ok: false, description: error.message };
  }
}

/**
 * Gửi thông báo test mã QR
 */
export async function sendTestTopupQRNotification(configOverride?: { token: string; chatId: string }) {
  try {
    const config = configOverride || await getTelegramConfig();
    if (!config.token || !config.chatId) return { ok: false, description: "Thiếu config" };

    // Mã QR mẫu (VietQR định dạng cơ bản)
    const testQrCode = "00020101021238540010A000000727012400069704070110842247960208QRIBFTTA5204739953037045405100005802VN6304D19E";
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(testQrCode)}`;

    const caption = `
🔔 <b>[TEST] THÔNG BÁO NẠP GÓI QR</b>

<b>KHÁCH HÀNG:</b> Admin Test
<b>NHÂN VẬT:</b> KAIA3QZ6Q6 (ID: EKEF-XUZL-LMGU)
<b>GÓI NẠP:</b> Gói 100,000 Kim Cương (Test)
<b>SỐ TIỀN TRỪ USER:</b> <code>120,000 VND</code>
<b>TIỀN THỰC CHUYỂN:</b> <code>100,000 VND</code>

Đây là tin nhắn thử nghiệm hệ thống nạp QR.
    `.trim();

    return await sendTelegramPhotoWithFallback(config as { token: string; chatId: string }, qrImageUrl, caption);
  } catch (error: any) {
    return { ok: false, description: error.message };
  }
}
