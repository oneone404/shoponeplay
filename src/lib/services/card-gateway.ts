/**
 * Card Gateway Service
 * Giao tiep voi NCC (thegiare.vn) de mua the, kiem tra so du, va tai lai the.
 */

import crypto from "crypto"
import { prisma } from "@/lib/prisma"

// ===================== TYPES =====================

interface CardInfo {
  serial: string
  pin: string
  name: string
  expired: string
}

interface BuyCardResult {
  status: number         // 1 = thanh cong, 2 = dang xu ly, khac = loi
  message: string
  cards?: CardInfo[]
  orderCode?: string
  requestId: string
}

interface BalanceResult {
  balance: number
}

interface CardGatewayConfig {
  baseUrl: string
  partnerId: string
  partnerKey: string
  walletNumber: string
  callbackUrl: string
}

// ===================== HELPER =====================

/**
 * Lay cau hinh Card Gateway tu Database (Config table)
 */
async function getCardGatewayConfig(): Promise<CardGatewayConfig> {
  const configs = await prisma.config.findMany({
    where: {
      key: {
        in: [
          "CARD_BASE_URL",
          "CARD_PARTNER_ID",
          "CARD_PARTNER_KEY",
          "CARD_WALLET_NUMBER",
          "CARD_CALLBACK_URL",
        ]
      }
    }
  })

  const configMap = new Map(configs.map(c => [c.key, c.value]))

  return {
    baseUrl: configMap.get("CARD_BASE_URL") || "",
    partnerId: configMap.get("CARD_PARTNER_ID") || "",
    partnerKey: configMap.get("CARD_PARTNER_KEY") || "",
    walletNumber: configMap.get("CARD_WALLET_NUMBER") || "",
    callbackUrl: configMap.get("CARD_CALLBACK_URL") || "",
  }
}

/**
 * Tao chu ky MD5: md5(partner_key + partner_id + command + request_id)
 */
function createSign(partnerKey: string, partnerId: string, command: string, requestId: string): string {
  const raw = partnerKey + partnerId + command + requestId
  return crypto.createHash("md5").update(raw).digest("hex")
}

/**
 * Tao request_id duy nhat (dang ULID-like)
 */
function generateRequestId(): string {
  const timestamp = Date.now().toString(36)
  const random = crypto.randomBytes(8).toString("hex")
  return `topup-${timestamp}-${random}`
}

// ===================== SERVICE =====================

/**
 * Kiem tra so du vi dai ly tai NCC
 */
export async function getAgentBalance(): Promise<BalanceResult> {
  const config = await getCardGatewayConfig()

  if (!config.baseUrl || !config.partnerId || !config.partnerKey) {
    throw new Error("Chưa cấu hình Card Gateway. Vui lòng cấu hình trong Admin > Cài đặt > Nạp Gói.")
  }

  const requestId = generateRequestId()
  const sign = createSign(config.partnerKey, config.partnerId, "getbalance", requestId)

  const params = new URLSearchParams({
    partner_id: config.partnerId,
    command: "getbalance",
    wallet_number: config.walletNumber,
    request_id: requestId,
    sign,
  })

  console.log("[CARD_GATEWAY] getbalance request:", { baseUrl: config.baseUrl, partnerId: config.partnerId, wallet: config.walletNumber, requestId })

  const response = await fetch(`${config.baseUrl}/api/cardws`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  })

  const data = await response.json()
  console.log("[CARD_GATEWAY] getbalance response:", data)

  return { balance: data.balance || 0 }
}

/**
 * Mua the tu NCC
 * @param value - Menh gia the (VND): 20000, 50000, 100000...
 * @param serviceCode - Loai the: "ZING", "GARENA", "VIETTEL"...
 * @param qty - So luong the (mac dinh 1)
 */
export async function buyCard(
  value: number,
  serviceCode: string = "ZING",
  qty: number = 1
): Promise<BuyCardResult> {
  const config = await getCardGatewayConfig()

  if (!config.baseUrl || !config.partnerId || !config.partnerKey) {
    throw new Error("Chưa cấu hình Card Gateway")
  }

  const requestId = generateRequestId()
  const sign = createSign(config.partnerKey, config.partnerId, "buycard", requestId)

  const params = new URLSearchParams({
    partner_id: config.partnerId,
    command: "buycard",
    request_id: requestId,
    service_code: serviceCode,
    value: value.toString(),
    qty: qty.toString(),
    wallet_number: config.walletNumber,
    sign,
  })

  console.log("[CARD_GATEWAY] buycard:", { value, serviceCode, requestId })

  const response = await fetch(`${config.baseUrl}/api/cardws`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  })

  const data = await response.json()
  console.log("[CARD_GATEWAY] buycard result:", { status: data.status, message: data.message })

  return {
    status: data.status,
    message: data.message || "",
    cards: data.data?.cards || undefined,
    orderCode: data.data?.order_code || undefined,
    requestId,
  }
}

/**
 * Tai lai the tu NCC (khi status = 2, NCC chua cap the)
 * @param requestId - request_id goc luc mua
 * @param orderCode - order_code tu NCC (neu co)
 */
export async function redownloadCard(
  requestId: string,
  orderCode?: string
): Promise<BuyCardResult> {
  const config = await getCardGatewayConfig()

  if (!config.baseUrl || !config.partnerId || !config.partnerKey) {
    throw new Error("Chưa cấu hình Card Gateway")
  }

  const sign = createSign(config.partnerKey, config.partnerId, "redownload", requestId)

  const params = new URLSearchParams({
    partner_id: config.partnerId,
    command: "redownload",
    request_id: requestId,
    sign,
  })

  if (orderCode) {
    params.append("order_code", orderCode)
  }

  console.log("[CARD_GATEWAY] redownload:", { requestId, orderCode })

  const response = await fetch(`${config.baseUrl}/api/cardws`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  })

  const data = await response.json()
  console.log("[CARD_GATEWAY] redownload result:", { status: data.status })

  return {
    status: data.status,
    message: data.message || "",
    cards: data.data?.cards || undefined,
    orderCode: data.data?.order_code || orderCode || undefined,
    requestId,
  }
}
