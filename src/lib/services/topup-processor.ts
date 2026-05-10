/**
 * Topup Processor (Orchestrator)
 * Dieu phoi toan bo luong nap tu dong: mua the -> xac thuc VNG -> nap the vao game.
 * Su dung Huong B: Goi lai auth/quick o phia server de lay jtoken moi moi lan nap.
 */

import { prisma } from "@/lib/prisma"
import { buyCard, redownloadCard, getAgentBalance } from "./card-gateway"
import { quickAuth, getProducts, createOrder } from "./vng-billing"
import type { TopupOrderStatus } from "@prisma/client"

// ===================== TYPES =====================

interface ProcessResult {
  success: boolean
  orderId: string
  status: TopupOrderStatus
  message: string
}

// ===================== HELPERS =====================

/**
 * Ghi log tung buoc vao statusLog cua TopupOrder
 */
async function logStep(
  orderId: string,
  step: string,
  status: "OK" | "ERROR" | "WAITING",
  detail: string
) {
  const order = await prisma.topupOrder.findUnique({
    where: { id: orderId },
    select: { statusLog: true }
  })

  const currentLog = (order?.statusLog as any[]) || []
  currentLog.push({
    step,
    status,
    time: new Date().toISOString(),
    detail,
  })

  await prisma.topupOrder.update({
    where: { id: orderId },
    data: { statusLog: currentLog }
  })
}

/**
 * Cap nhat trang thai don hang
 */
async function updateOrderStatus(
  orderId: string,
  status: TopupOrderStatus,
  extra: Record<string, any> = {}
) {
  await prisma.topupOrder.update({
    where: { id: orderId },
    data: { status, ...extra }
  })
}

/**
 * Hoan tien cho user khi loi
 */
async function refundUser(orderId: string) {
  const order = await prisma.topupOrder.findUnique({
    where: { id: orderId },
    include: { user: true }
  })

  if (!order) return

  await prisma.$transaction([
    prisma.user.update({
      where: { id: order.userId },
      data: { balance: { increment: order.amount } }
    }),
    prisma.transaction.create({
      data: {
        userId: order.userId,
        amount: order.amount,
        balanceBefore: order.user.balance,
        balanceAfter: order.user.balance + order.amount,
        type: "REFUND",
        description: `Hoan tien nap tu dong - Don #${orderId.slice(-8).toUpperCase()}`
      }
    }),
    prisma.topupOrder.update({
      where: { id: orderId },
      data: { status: "REFUNDED" }
    })
  ])

  await logStep(orderId, "REFUND", "OK", `Hoan ${order.amount} VND cho user`)
}

// ===================== MAIN PROCESSOR =====================

/**
 * Xu ly toan bo luong nap tu dong cho 1 don hang.
 * Duoc goi sau khi tao TopupOrder thanh cong.
 */
export async function processTopupOrder(orderId: string): Promise<ProcessResult> {
  try {
    const order = await prisma.topupOrder.findUnique({
      where: { id: orderId },
      include: { product: true, user: true }
    })

    if (!order) {
      return { success: false, orderId, status: "ERROR", message: "Don hang khong ton tai" }
    }

    if (order.status !== "PENDING") {
      return { success: false, orderId, status: order.status, message: "Don hang da duoc xu ly" }
    }

    // ============ STEP 1: Kiem tra so du dai ly ============
    await logStep(orderId, "CHECK_BALANCE", "OK", "Kiem tra so du dai ly NCC...")
    
    let agentBalance: number
    try {
      const balanceResult = await getAgentBalance()
      agentBalance = balanceResult.balance
      await logStep(orderId, "CHECK_BALANCE", "OK", `So du dai ly: ${agentBalance.toLocaleString()} VND`)
    } catch (error: any) {
      await logStep(orderId, "CHECK_BALANCE", "ERROR", error.message)
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "Khong the kiem tra so du dai ly: " + error.message })
      await refundUser(orderId)
      return { success: false, orderId, status: "REFUNDED", message: "Loi kiem tra so du dai ly" }
    }

    if (agentBalance < order.cardValue) {
      await logStep(orderId, "CHECK_BALANCE", "ERROR", `So du khong du: ${agentBalance} < ${order.cardValue}`)
      await updateOrderStatus(orderId, "ERROR", { errorMessage: `So du vi dai ly khong du (${agentBalance.toLocaleString()} VND)` })
      await refundUser(orderId)
      await sendTopupTelegramAlert(order, "ERROR", `So du vi dai ly khong du: ${agentBalance.toLocaleString()} VND`)
      return { success: false, orderId, status: "REFUNDED", message: "So du vi dai ly khong du" }
    }

    // ============ STEP 2: Mua the tu NCC ============
    await updateOrderStatus(orderId, "BUYING_CARD")
    await logStep(orderId, "BUY_CARD", "OK", `Mua the ${order.product.serviceCode} menh gia ${order.cardValue.toLocaleString()} VND...`)

    let cardSerial: string | undefined
    let cardPin: string | undefined

    try {
      const buyResult = await buyCard(order.cardValue, order.product.serviceCode)

      await prisma.topupOrder.update({
        where: { id: orderId },
        data: {
          cardRequestId: buyResult.requestId,
          cardOrderCode: buyResult.orderCode || null,
        }
      })

      if (buyResult.status === 1 && buyResult.cards?.length) {
        // Co the ngay
        cardSerial = buyResult.cards[0].serial
        cardPin = buyResult.cards[0].pin
        await logStep(orderId, "BUY_CARD", "OK", `Nhan the thanh cong: ${cardSerial.slice(0, 4)}***`)
      } else if (buyResult.status === 2) {
        // NCC dang xu ly, can retry redownload
        await updateOrderStatus(orderId, "WAITING_CARD")
        await logStep(orderId, "BUY_CARD", "WAITING", "NCC dang xu ly, bat dau retry redownload...")

        const cardResult = await waitForCard(orderId, buyResult.requestId, buyResult.orderCode)
        if (cardResult) {
          cardSerial = cardResult.serial
          cardPin = cardResult.pin
        }
      } else {
        throw new Error(buyResult.message || "Mua the that bai (status: " + buyResult.status + ")")
      }
    } catch (error: any) {
      await logStep(orderId, "BUY_CARD", "ERROR", error.message)
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "Loi mua the: " + error.message })
      await refundUser(orderId)
      await sendTopupTelegramAlert(order, "ERROR", `Loi mua the: ${error.message}`)
      return { success: false, orderId, status: "REFUNDED", message: "Loi mua the tu NCC" }
    }

    if (!cardSerial || !cardPin) {
      await logStep(orderId, "BUY_CARD", "ERROR", "Khong nhan duoc the sau 5 lan retry")
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "Khong nhan duoc the tu NCC sau 5 lan thu" })
      await refundUser(orderId)
      await sendTopupTelegramAlert(order, "ERROR", "Khong nhan duoc the tu NCC sau 5 lan retry")
      return { success: false, orderId, status: "REFUNDED", message: "Het thoi gian cho the tu NCC" }
    }

    // Luu thong tin the (trong production nen ma hoa cardPin)
    await updateOrderStatus(orderId, "CARD_READY", {
      cardSerial,
      cardPin, // TODO: Ma hoa truoc khi luu
    })
    await logStep(orderId, "CARD_READY", "OK", "Da co the, chuan bi nap VNG...")

    // ============ STEP 3: Xac thuc VNG (auth/quick) ============
    await updateOrderStatus(orderId, "PROCESSING_VNG")

    let vngSession
    try {
      vngSession = await quickAuth(order.roleId)
      await prisma.topupOrder.update({
        where: { id: orderId },
        data: { vngUserId: vngSession.userID }
      })
      await logStep(orderId, "VNG_AUTH", "OK", `Xac thuc thanh cong: ${vngSession.roleName} (Server ${vngSession.serverID})`)
    } catch (error: any) {
      await logStep(orderId, "VNG_AUTH", "ERROR", error.message)
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "Loi xac thuc VNG: " + error.message })
      // Khong hoan tien ngay vi the da mua, can admin kiem tra
      await sendTopupTelegramAlert(order, "ERROR", `Loi xac thuc VNG (the da mua, can xu ly thu cong): ${error.message}`)
      return { success: false, orderId, status: "ERROR", message: "Loi xac thuc VNG" }
    }

    // ============ STEP 4: Kiem tra goi kha dung ============
    try {
      const products = await getProducts(vngSession)
      const targetProduct = products[order.product.vngProductId]

      if (!targetProduct || targetProduct.enable !== 1) {
        throw new Error(`Goi ${order.product.name} (${order.product.vngProductId}) khong kha dung cho nhan vat nay`)
      }

      await logStep(orderId, "CHECK_PRODUCT", "OK", `Goi ${order.product.name} kha dung`)
    } catch (error: any) {
      await logStep(orderId, "CHECK_PRODUCT", "ERROR", error.message)
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "Loi kiem tra goi: " + error.message })
      await sendTopupTelegramAlert(order, "ERROR", `Loi kiem tra goi (the da mua): ${error.message}`)
      return { success: false, orderId, status: "ERROR", message: "Goi nap khong kha dung" }
    }

    // ============ STEP 5: Nap the vao game (createOrder) ============
    try {
      const vngResult = await createOrder({
        session: vngSession,
        cardSerial,
        cardPin,
        productId: order.product.vngProductId,
        amount: order.cardValue,
      })

      await prisma.topupOrder.update({
        where: { id: orderId },
        data: {
          vngProductId: order.product.vngProductId,
          vngReturnCode: vngResult.returnCode,
        }
      })

      if (vngResult.returnCode === 1) {
        // THANH CONG!
        await updateOrderStatus(orderId, "COMPLETED", { completedAt: new Date() })
        await logStep(orderId, "CREATE_ORDER", "OK", `Nap thanh cong: ${vngResult.message}`)
        await sendTopupTelegramAlert(order, "SUCCESS", `Nap thanh cong cho ${order.roleName}`)

        return { success: true, orderId, status: "COMPLETED", message: "Nap thanh cong!" }
      } else {
        throw new Error(`VNG returnCode: ${vngResult.returnCode} - ${vngResult.message}`)
      }
    } catch (error: any) {
      await logStep(orderId, "CREATE_ORDER", "ERROR", error.message)
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "Loi nap the VNG: " + error.message })
      await sendTopupTelegramAlert(order, "ERROR", `Loi nap the VNG (the da mua): ${error.message}`)
      return { success: false, orderId, status: "ERROR", message: "Loi nap the vao game" }
    }
  } catch (error: any) {
    console.error("[TOPUP_PROCESSOR] Unexpected error:", error)
    await logStep(orderId, "SYSTEM", "ERROR", error.message)
    await updateOrderStatus(orderId, "ERROR", { errorMessage: "Loi he thong: " + error.message })
    return { success: false, orderId, status: "ERROR", message: "Loi he thong khong xac dinh" }
  }
}

// ===================== RETRY LOGIC =====================

/**
 * Cho the tu NCC (retry redownload)
 * Retry toi da 5 lan, moi lan cach 5 phut.
 * Phase 1: Dung sequential retry (blocking).
 * Phase 2: Se chuyen sang BullMQ delayed jobs.
 */
async function waitForCard(
  orderId: string,
  requestId: string,
  orderCode?: string
): Promise<{ serial: string; pin: string } | null> {
  const MAX_RETRIES = 5
  const RETRY_DELAY_MS = 5 * 60 * 1000 // 5 phut

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    await logStep(orderId, "REDOWNLOAD", "WAITING", `Retry lan ${attempt}/${MAX_RETRIES}, cho ${RETRY_DELAY_MS / 1000}s...`)

    // Cap nhat retry count trong DB
    await prisma.topupOrder.update({
      where: { id: orderId },
      data: { retryCount: attempt }
    })

    // Cho 5 phut
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))

    try {
      const result = await redownloadCard(requestId, orderCode)

      if (result.status === 1 && result.cards?.length) {
        await logStep(orderId, "REDOWNLOAD", "OK", `Nhan the thanh cong sau ${attempt} lan retry`)
        return {
          serial: result.cards[0].serial,
          pin: result.cards[0].pin,
        }
      }

      await logStep(orderId, "REDOWNLOAD", "WAITING", `Lan ${attempt}: NCC van chua cap the (status: ${result.status})`)
    } catch (error: any) {
      await logStep(orderId, "REDOWNLOAD", "ERROR", `Lan ${attempt} loi: ${error.message}`)
    }
  }

  return null // Het retry, khong co the
}

// ===================== TELEGRAM =====================

/**
 * Gui thong bao Telegram khi nap tu dong thanh cong/loi
 */
async function sendTopupTelegramAlert(
  order: any,
  type: "SUCCESS" | "ERROR",
  detail: string
) {
  try {
    // Lay cau hinh Telegram
    const configs = await prisma.config.findMany({
      where: { key: { in: ["TELEGRAM_TOKEN", "TELEGRAM_ID", "TELEGRAM_ENABLED"] } }
    })
    const configMap = new Map(configs.map(c => [c.key, c.value]))

    if (configMap.get("TELEGRAM_ENABLED") !== "true") return

    const token = configMap.get("TELEGRAM_TOKEN")
    const chatId = configMap.get("TELEGRAM_ID")
    if (!token || !chatId) return

    const icon = type === "SUCCESS" ? "V" : "X"
    const statusText = type === "SUCCESS" ? "NAP THANH CONG" : "LOI NAP TU DONG"

    const message = `
${icon} <b>${statusText}</b>

<b>DON HANG:</b> <code>#${order.id.slice(-8).toUpperCase()}</code>
<b>NHAN VAT:</b> ${order.roleName} (ID: ${order.roleId})
<b>GOI:</b> ${order.product?.name || "N/A"}
<b>SO TIEN:</b> ${order.amount?.toLocaleString()} VND
<b>CHI TIET:</b> ${detail}
<b>THOI GIAN:</b> ${new Date().toLocaleString("vi-VN")}
    `.trim()

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      })
    })
  } catch (error) {
    console.error("[TOPUP_TELEGRAM] Error:", error)
  }
}
