import { quickAuth, getProducts, createOrder, createVietQROrder } from "./vng-billing"
import { sendTopupNotification, sendTopupQRNotification } from "@/lib/telegram"
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
 * Ma hoa PIN (AES-256-CBC)
 */
export function encryptPin(pin: string): string {
  try {
    const secretKey = crypto.createHash('sha256').update(String(process.env.NEXTAUTH_SECRET || 'default_secret')).digest('base64').substring(0, 32)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv)
    let encrypted = cipher.update(pin, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return iv.toString('hex') + ':' + encrypted
  } catch (e) {
    console.error("[ENCRYPTION_ERROR]", e)
    return "***"
  }
}

/**
 * Giai ma PIN (AES-256-CBC)
 */
export function decryptPin(encryptedPin: string): string {
  try {
    if (!encryptedPin || encryptedPin === "***" || !encryptedPin.includes(':')) return encryptedPin
    
    const [ivHex, encrypted] = encryptedPin.split(':')
    const secretKey = crypto.createHash('sha256').update(String(process.env.NEXTAUTH_SECRET || 'default_secret')).digest('base64').substring(0, 32)
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (e) {
    console.error("[DECRYPTION_ERROR]", e)
    return encryptedPin
  }
}

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
        description: `Hoàn tiền nạp tự động - Đơn #${orderId.slice(-8).toUpperCase()}`
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

    // ============ NHAN DIEN LOAI DON HANG ============
    const isManual = !order.productId

    if (isManual) {
      return processManualQRTopup(orderId)
    }

    // ============ STEP 1: Kiem tra VNG (Pre-check) truoc khi mua the ============
    await logStep(orderId, "PRE_CHECK", "OK", "Kiem tra nhan vat va goi tren VNG...")
    try {
      const vngSession = await quickAuth(order.roleId)
      const products = await getProducts(vngSession)
      
      const targetProductEntry = Object.entries(products).find(([id, p]) => 
        p.productName.toLowerCase().trim() === order.product.name.toLowerCase().trim() && p.enable === 1
      )

      if (!targetProductEntry) {
        throw new Error(`Goi "${order.product.name}" khong kha dung tren VNG cho nhan vat nay.`)
      }
      
      await prisma.topupOrder.update({
        where: { id: orderId },
        data: { vngUserId: vngSession.userID, vngProductId: targetProductEntry[0] }
      })
      await logStep(orderId, "PRE_CHECK", "OK", `Nhan vat va goi hop le (VNG ID: ${targetProductEntry[0]})`)
    } catch (error: any) {
      await logStep(orderId, "PRE_CHECK", "ERROR", error.message)
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "Pre-check VNG that bai: " + error.message })
      await refundUser(orderId)
      return { success: false, orderId, status: "REFUNDED", message: "Goi nap khong kha dung hoac sai ID." }
    }

    // ============ STEP 2: Kiem tra so du dai ly ============
    await logStep(orderId, "CHECK_BALANCE", "OK", "Kiem tra so du dai ly NCC...")
    
    let agentBalance: number
    try {
      const balanceResult = await getAgentBalance()
      agentBalance = balanceResult.balance
      await logStep(orderId, "CHECK_BALANCE", "OK", `So du dai ly: ${agentBalance.toLocaleString()} VND`)
    } catch (error: any) {
      await logStep(orderId, "CHECK_BALANCE", "ERROR", error.message)
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "Không thể kiểm tra số dư đại lý: " + error.message })
      await refundUser(orderId)
      return { success: false, orderId, status: "REFUNDED", message: "Lỗi kiểm tra số dư đại lý" }
    }

    if (agentBalance < order.cardValue) {
      await logStep(orderId, "CHECK_BALANCE", "ERROR", `So du khong du: ${agentBalance} < ${order.cardValue}`)
      await updateOrderStatus(orderId, "ERROR", { errorMessage: `Số dư ví đại lý không đủ (${agentBalance.toLocaleString()} VND)` })
      await refundUser(orderId)
      await sendTopupTelegramAlert(order, "ERROR", `Số dư ví đại lý không đủ: ${agentBalance.toLocaleString()} VND`)
      return { success: false, orderId, status: "REFUNDED", message: "Số dư ví đại lý không đủ" }
    }

    // ============ STEP 2.5: Kiem tra ton kho (Check Stock) ============
    await logStep(orderId, "CHECK_STOCK", "OK", "Kiem tra ton kho NCC...")
    let stockAvailable = false
    let stockRetryCount = 0
    const maxStockRetries = 5
    const stockRetryInterval = 5 * 60 * 1000 // 5 minutes

    while (stockRetryCount < maxStockRetries) {
      try {
        const stockResult = await checkStockAvailable(order.product.serviceCode, order.cardValue)
        if (stockResult.available) {
          stockAvailable = true
          await logStep(orderId, "CHECK_STOCK", "OK", "Con hang, bat dau mua the.")
          break
        } else {
          stockRetryCount++
          await updateOrderStatus(orderId, "WAITING_STOCK")
          await logStep(orderId, "CHECK_STOCK", "WAITING", `Het hang. Se thu lai sau 5 phut (Lan ${stockRetryCount}/${maxStockRetries})`)
          if (stockRetryCount < maxStockRetries) {
            await new Promise(resolve => setTimeout(resolve, stockRetryInterval))
          }
        }
      } catch (err: any) {
        // Neu loi API check stock thi cu mac dinh la cho phep mua thu de tranh block don hang
        await logStep(orderId, "CHECK_STOCK", "ERROR", `Loi check stock: ${err.message}. Se thu mua luon.`)
        stockAvailable = true
        break
      }
    }

    if (!stockAvailable) {
      await logStep(orderId, "CHECK_STOCK", "ERROR", "NCC het hang sau 5 lan thu lai.")
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "NCC hết hàng sau 5 lần thử lại." })
      await refundUser(orderId)
      await sendTopupTelegramAlert(order, "ERROR", `NCC hết hàng sau 5 lần thử lại (${order.product.serviceCode} - ${order.cardValue.toLocaleString()})`)
      return { success: false, orderId, status: "REFUNDED", message: "NCC hết hàng" }
    }

    // ============ STEP 3: Mua the tu NCC ============
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
      await updateOrderStatus(orderId, "ERROR", { errorMessage: error.message })
      await refundUser(orderId)
      await sendTopupNotification({ order, type: "ERROR", detail: `Lỗi mua thẻ: ${error.message}` })
      return { success: false, orderId, status: "REFUNDED", message: "Lỗi mua thẻ từ NCC" }
    }

    if (!cardSerial || !cardPin) {
      await logStep(orderId, "BUY_CARD", "ERROR", "Khong nhan duoc the sau 5 lan retry (se doi callback)")
      await updateOrderStatus(orderId, "WAITING_CARD", { errorMessage: "Đang đợi NCC trả thẻ qua callback..." })
      // Khong refund ngay vi status 2 (dang xu ly) thi khong refund duoc, phai doi callback status 3 moi refund
      return { success: true, orderId, status: "WAITING_CARD", message: "Đang đợi thẻ từ NCC" }
    }

    // Neu da co the tu buycard hoac redownload, tiep tuc nap VNG
    return finishTopupProcess(orderId, cardSerial, cardPin)

  } catch (error: any) {
    console.error("[TOPUP_PROCESSOR] Unexpected error:", error)
    await logStep(orderId, "SYSTEM", "ERROR", error.message)
    await updateOrderStatus(orderId, "ERROR", { errorMessage: "Lỗi hệ thống: " + error.message })
    return { success: false, orderId, status: "ERROR", message: "Lỗi hệ thống không xác định" }
  }
}

/**
 * Buoc cuoi: Nap the vao game VNG
 * Duoc goi boi ca processTopupOrder (Job) va /api/topup/callback (Webhook)
 */
export async function finishTopupProcess(orderId: string, cardSerial: string, cardPin: string): Promise<ProcessResult> {
  try {
    const order = await prisma.topupOrder.findUnique({
      where: { id: orderId },
      include: { product: true, user: true }
    })

    if (!order) return { success: false, orderId, status: "ERROR", message: "Don hang khong ton tai" }

    // Luu thong tin the (ma hoa PIN truoc khi luu vao DB)
    const encryptedPin = encryptPin(cardPin)

    await updateOrderStatus(orderId, "CARD_READY", {
      cardSerial,
      cardPin: encryptedPin,
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
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "Lỗi xác thực VNG: " + error.message })
      await sendTopupNotification({ order, type: "ERROR", detail: `Lỗi xác thực VNG (thẻ đã mua): ${error.message}` })
      return { success: false, orderId, status: "ERROR", message: "Lỗi xác thực VNG" }
    }

    // ============ STEP 4: Kiem tra goi kha dung & Tim VNG Product ID ============
    let activeVngProductId = order.product.vngProductId || ""
    try {
      const products = await getProducts(vngSession)
      
      const targetProductEntry = Object.entries(products).find(([id, p]) => 
        p.productName.toLowerCase().trim() === order.product.name.toLowerCase().trim() && p.enable === 1
      )

      if (!targetProductEntry) {
        throw new Error(`Goi "${order.product.name}" khong kha dung hoac khong tim thay tren VNG`)
      }

      activeVngProductId = targetProductEntry[0]
      
      await logStep(orderId, "CHECK_PRODUCT", "OK", `Tim thay goi ${order.product.name} (VNG ID: ${activeVngProductId})`)
    } catch (error: any) {
      await logStep(orderId, "CHECK_PRODUCT", "ERROR", error.message)
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "Lỗi kiểm tra gói: " + error.message })
      await sendTopupNotification({ order, type: "ERROR", detail: `Lỗi kiểm tra gói (thẻ đã mua): ${error.message}` })
      return { success: false, orderId, status: "ERROR", message: "Gói nạp không khả dụng" }
    }

    // ============ STEP 5: Nap the vao game (createOrder) ============
    try {
      const vngResult = await createOrder({
        session: vngSession,
        cardSerial,
        cardPin, // Dung PIN goc de nap
        productId: activeVngProductId,
        amount: order.cardValue,
      })

      await prisma.topupOrder.update({
        where: { id: orderId },
        data: {
          vngProductId: activeVngProductId,
          vngReturnCode: vngResult.returnCode,
        }
      })

      if (vngResult.returnCode === 1) {
        // THANH CONG!
        await updateOrderStatus(orderId, "COMPLETED", { completedAt: new Date() })
        await logStep(orderId, "COMPLETED", "OK", "Nap thanh cong vao VNG")
        await sendTopupNotification({ order, type: "SUCCESS", detail: "Nạp thành công vào VNG" })
        return { success: true, orderId, status: "COMPLETED", message: "Nạp thành công!" }
      } else {
        throw new Error(`VNG returnCode: ${vngResult.returnCode} - ${vngResult.message}`)
      }
    } catch (error: any) {
      await logStep(orderId, "CREATE_ORDER", "ERROR", error.message)
      await updateOrderStatus(orderId, "ERROR", { errorMessage: "Lỗi nạp thẻ VNG: " + error.message })
      await sendTopupTelegramAlert(order, "ERROR", `Lỗi nạp thẻ VNG (thẻ đã mua): ${error.message}`)
      return { success: false, orderId, status: "ERROR", message: "Lỗi nạp thẻ vào game" }
    }
  } catch (error: any) {
    console.error("[TOPUP_PROCESSOR] finishTopupProcess error:", error)
    return { success: false, orderId, status: "ERROR", message: error.message }
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

// ===================== RETRY LOGIC =====================

/**
 * Thử nạp lại cho một đơn hàng đang bị lỗi.
 * Thông minh: nếu đã có thẻ trong DB thì chỉ cần nạp tiếp vào VNG, nếu chưa có thẻ thì chạy lại từ đầu.
 */
export async function retryTopupOrder(orderId: string): Promise<ProcessResult> {
  const order = await prisma.topupOrder.findUnique({
    where: { id: orderId }
  })
  
  if (!order) throw new Error("Đơn hàng không tồn tại")
  
  // Nếu đơn hàng đã hoàn thành hoặc đang chờ thì không cho retry
  if (["COMPLETED", "REFUNDED"].includes(order.status)) {
    throw new Error("Đơn hàng đã ở trạng thái cuối cùng, không thể thử lại")
  }

  // Nếu đã có thông tin thẻ (mã PIN) trong DB -> Chỉ cần thực hiện bước cuối (finishTopupProcess)
  if (order.cardPin && order.cardSerial) {
    const rawPin = decryptPin(order.cardPin)
    return finishTopupProcess(orderId, order.cardSerial, rawPin)
  }
  
  // Nếu chưa có thẻ -> Chạy lại từ đầu (processTopupOrder)
  return processTopupOrder(orderId)
}

/**
 * Xử lý nạp qua mã QR (Manual)
 */
async function processManualQRTopup(orderId: string): Promise<ProcessResult> {
  const order = await prisma.topupOrder.findUnique({
    where: { id: orderId }
  })
  if (!order) throw new Error("Order not found")

  await logStep(orderId, "AUTH_VNG", "OK", "Xác thực nhân vật VNG...")
  try {
    const vngSession = await quickAuth(order.roleId)
    
    await logStep(orderId, "CREATE_QR", "OK", "Đang tạo mã QR VNG...")
    const qrResult = await createVietQROrder({
      session: vngSession,
      productId: order.vngProductId || "",
      amount: order.cardValue, // Dung menh gia de tao QR
    })

    if (qrResult.returnCode !== 1 || !qrResult.qrCode) {
      throw new Error(qrResult.message || "Không thể tạo mã QR từ VNG")
    }

    // Luu thong tin QR
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 phut
    await prisma.topupOrder.update({
      where: { id: orderId },
      data: {
        status: "WAITING_ADMIN_PAY",
        vngQrCode: qrResult.qrCode,
        vngOrderNumber: qrResult.orderNumber,
        vngQrExpiredAt: expiresAt,
        vngUserId: vngSession.userID
      }
    })

    await logStep(orderId, "WAITING_PAY", "OK", "Đã tạo mã QR. Đang đợi Admin thanh toán...")

    // Gui Telegram cho Admin
    await sendTopupQRNotification(orderId)

    return { 
      success: true, 
      orderId, 
      status: "WAITING_ADMIN_PAY", 
      message: "Đơn hàng đang chờ Admin thanh toán qua QR." 
    }

  } catch (error: any) {
    await logStep(orderId, "MANUAL_ERROR", "ERROR", error.message)
    await updateOrderStatus(orderId, "ERROR", { errorMessage: "Lỗi nạp Manual: " + error.message })
    await refundUser(orderId)
    return { success: false, orderId, status: "REFUNDED", message: error.message }
  }
}

  } catch (error) {
    console.error("[TELEGRAM_QR] Error:", error)
  }
}

/**
 * Xử lý hành động từ Telegram Admin (Xác nhận/Thử lại)
 */
export async function processTopupQRAction(params: {
  orderId: string
  action: "done" | "retry"
  adminId: string
  adminName: string
}) {
  const { orderId, action, adminId, adminName } = params

  const order = await prisma.topupOrder.findUnique({
    where: { id: orderId }
  })

  if (!order) throw new Error("Đơn hàng không tồn tại")

  if (action === "done") {
    if (order.status === "COMPLETED") return { success: true, message: "Đơn hàng đã hoàn thành trước đó" }

    await prisma.topupOrder.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        statusLog: {
          push: {
            step: "MANUAL_PAY",
            status: "OK",
            time: new Date().toISOString(),
            detail: `Admin ${adminName} xác nhận đã nạp tiền qua QR.`
          }
        }
      }
    })

    return { success: true, message: `✅ Đã xác nhận nạp tiền cho đơn #${orderId.slice(-8).toUpperCase()}` }
  }

  if (action === "retry") {
    // Regenerate QR
    await logStep(orderId, "RETRY_QR", "OK", `Admin ${adminName} yêu cầu tạo lại mã QR.`)
    
    // Luu y: processManualQRTopup se tu dong gui tin nhan Tele moi
    await processManualQRTopup(orderId)

    return { success: true, message: `🔄 Đang tạo lại mã QR mới cho đơn #${orderId.slice(-8).toUpperCase()}...` }
  }

  throw new Error("Hành động không hợp lệ")
}
