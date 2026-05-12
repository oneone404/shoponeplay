import { prisma } from "@/lib/prisma";

const VNG_GC_API = "https://vgrapi-sea.vnggames.com/coordinator/api/v1/code/redeem";

const HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'vi-VN,vi;q=0.9,en-GB;q=0.8,en;q=0.7,fr-FR;q=0.6,fr;q=0.5,en-US;q=0.4',
  'cache-control': 'no-cache',
  'content-type': 'application/json',
  'origin': 'https://giftcode.vnggames.com',
  'pragma': 'no-cache',
  'priority': 'u=1, i',
  'referer': 'https://giftcode.vnggames.com/',
  'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
  'x-client-region': 'VN',
};

const ERROR_CODES: Record<number, string> = {
  2108: "Code đã được sử dụng",
  2105: "ID nhân vật sai hoặc tài khoản không tồn tại",
  2106: "Code không tồn tại",
  2121: "Hạn mức nhập code đã hết",
  1: "Thành công"
};

interface RedeemParams {
  serverId: string;
  gameCode: string;
  roleId: string;
  roleName: string;
  code: string;
}

export async function redeemGiftcode(params: RedeemParams) {
  try {
    const response = await fetch(VNG_GC_API, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(params),
    });

    const result = await response.json();
    const errorCode = result.errorCode;
    const message = result.message || "";

    // VNG logic: errorCode 1 with "Success" means success
    if (errorCode === 1 && message.toLowerCase() === "success") {
      return { success: true, message: "Nhập code thành công!", errorCode };
    }

    const errorMessage = ERROR_CODES[errorCode] || message || "Lỗi không xác định";
    return { success: false, message: errorMessage, errorCode };
  } catch (error: any) {
    console.error("[GIFTCODE_PROCESSOR] Error:", error.message);
    return { success: false, message: "Lỗi kết nối API VNG", errorCode: -1 };
  }
}

/**
 * Xử lý nhập code hàng loạt cho một người dùng (Manual Mode)
 */
export async function processBulkRedeem(userId: string, roleIds: string[], codes: string[]) {
  const results = [];
  console.log(`[GIFTCODE_PROCESS] Starting bulk redeem for User: ${userId} | IDs: ${roleIds.length} | Codes: ${codes.length}`);
  
  for (const roleId of roleIds) {
    for (const code of codes) {
      console.log(`[GIFTCODE_PROCESS] Trying Code: ${code} for ID: ${roleId}...`);
      
      // 1. Kiểm tra xem đã nhập thành công code này cho ID này chưa
      const exists = await prisma.giftcodeHistory.findFirst({
        where: { userId, roleId, code, status: "SUCCESS" }
      });

      if (exists) {
        console.log(`[GIFTCODE_PROCESS] Skipped: ${code} already redeemed for ${roleId}`);
        results.push({ roleId, code, status: "ALREADY_DONE", message: "Đã nhập thành công trước đó" });
        continue;
      }

      // 2. Nhập code
      const res = await redeemGiftcode({
        serverId: "2",
        gameCode: "661",
        roleId,
        roleName: roleId,
        code
      });

      console.log(`[GIFTCODE_PROCESS] Result for ${roleId} | ${code}: ${res.success ? "✅ SUCCESS" : "❌ FAILED"} (${res.message})`);

      // 3. Lưu lịch sử
      await prisma.giftcodeHistory.create({
        data: {
          userId,
          roleId,
          code,
          status: res.success ? "SUCCESS" : "FAILED",
          message: res.message
        }
      });

      results.push({ roleId, code, status: res.success ? "SUCCESS" : "FAILED", message: res.message });

      // Delay 500ms để tránh spam
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`[GIFTCODE_PROCESS] Completed bulk redeem for User: ${userId}`);
  return results;
}

/**
 * Tự động nhập code cho tất cả User đã bật Auto
 */
export async function triggerAutoRedeem(specificCodes?: string[]) {
  console.log(`[GIFTCODE_AUTO] Starting auto-redeem process...`);
  
  try {
    // 1. Lấy danh sách code cần chạy (nếu không truyền vào thì lấy tất cả code đang Active trong DB)
    let codesToRun = specificCodes;
    if (!codesToRun || codesToRun.length === 0) {
      const activeGlobalCodes = await prisma.globalGiftcode.findMany({
        where: { isActive: true },
        select: { code: true }
      });
      codesToRun = activeGlobalCodes.map(c => c.code);
    }

    if (!codesToRun || codesToRun.length === 0) {
      console.log("[GIFTCODE_AUTO] No active codes found to process.");
      return;
    }

    console.log(`[GIFTCODE_AUTO] Processing ${codesToRun.length} codes: ${codesToRun.join(", ")}`);

    // 2. Tìm các User bật Auto
    const users = await prisma.user.findMany({
      where: {
        config: { autoGiftcode: true }
      },
      select: {
        id: true,
        savedAccountIds: true
      }
    });

    console.log(`[GIFTCODE_AUTO] Found ${users.length} users with auto-enabled.`);

    for (const user of users) {
      const savedAccounts = Array.isArray(user.savedAccountIds) ? user.savedAccountIds : [];
      if (savedAccounts.length === 0) {
        console.log(`[GIFTCODE_AUTO] User ${user.id} has no saved accounts. Skipping.`);
        continue;
      }

      const roleIds = savedAccounts.map((acc: any) => acc.id);
      console.log(`[GIFTCODE_AUTO] Processing User: ${user.id} with ${roleIds.length} accounts...`);
      
      // Xử lý nhập code cho User này
      await processBulkRedeem(user.id, roleIds, codesToRun);
    }

    console.log(`[GIFTCODE_AUTO] Finished global auto-redeem sweep.`);
  } catch (error: any) {
    console.error("[GIFTCODE_AUTO] Fatal error:", error.message);
  }
}
