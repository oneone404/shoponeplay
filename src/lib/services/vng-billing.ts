/**
 * VNG Billing Service
 * Giao tiep voi VNG Billing API: xac thuc nhan vat, lay san pham, nap the vao game.
 */

// ===================== TYPES =====================

export interface VNGSession {
  jtoken: string
  userID: string
  serverID: string
  roleID: string
  roleName: string
  serverName: string
  loginType: string
}

export interface VNGProduct {
  productID: string
  productName: string
  enable: number
  hidden: number
  prices: {
    VND: { price: number }
  }
}

// ===================== CONSTANTS =====================

const VNG_CLIENT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjIjoxMDY2MSwiYSI6MTA2NjEsInMiOjF9.B08-6v9oP3rNxrvImC-WBO-AN0mru77ZNLOgqosNIjA"

const VNG_COMMON_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'vi-VN,vi;q=0.9,en-GB;q=0.8,en;q=0.7',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Origin': 'https://shop.vnggames.com',
  'Referer': 'https://shop.vnggames.com/',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
}

const ZALOPAY_INFO_HEADERS = {
  'Accept': '*/*',
  'Accept-Language': 'vi-VN,vi;q=0.9,en-GB;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/json',
  'Origin': 'https://gateway.zalopay.vn',
  'Pragma': 'no-cache',
  'Referer': 'https://gateway.zalopay.vn/',
  'Sec-Ch-UA': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
  'Sec-Ch-UA-Mobile': '?0',
  'Sec-Ch-UA-Platform': '"Windows"',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
}

// ===================== SERVICE =====================

/**
 * Xac thuc nhan vat VNG (auth/quick)
 * Lay jtoken va thong tin nhan vat tu Player ID
 */
export async function quickAuth(roleId: string): Promise<VNGSession> {
  const params = new URLSearchParams({
    platform: "mobile",
    clientKey: VNG_CLIENT_KEY,
    loginType: "9",
    lang: "VI",
    jtoken: "",
    userID: "",
    roleID: roleId,
    roleName: roleId,
    serverID: "",
    getVgaId: "1",
  })

  console.log("[VNG_BILLING] auth/quick for roleId:", roleId)

  const response = await fetch("https://billing.vnggames.com/fe/api/auth/quick", {
    method: "POST",
    headers: VNG_COMMON_HEADERS,
    body: params.toString(),
  })

  const text = await response.text()
  console.log("[VNG_BILLING] auth/quick response:", text)
  let data: any

  try {
    data = JSON.parse(text)
  } catch {
    console.error("[VNG_BILLING] auth/quick invalid JSON:", text.slice(0, 300))
    throw new Error("Loi xac thuc VNG: Response khong hop le")
  }

  if (data.returnCode !== 1 || !data.data?.jtoken) {
    throw new Error(data.returnMessage || "Khong the xac thuc nhan vat hoac ID khong ton tai")
  }

  console.log("[VNG_BILLING] auth/quick success:", data.data.roleName)

  return {
    jtoken: data.data.jtoken,
    userID: data.data.userID,
    serverID: data.data.serverID,
    roleID: data.data.roleID,
    roleName: data.data.roleName,
    serverName: data.data.serverName || "",
    loginType: data.data.loginType || "9",
  }
}

/**
 * Lay danh sach san pham kha dung cho nhan vat
 */
export async function getProducts(session: VNGSession): Promise<Record<string, VNGProduct>> {
  const params = new URLSearchParams({
    jtoken: session.jtoken,
    serverID: session.serverID,
    userID: session.userID,
    loginType: session.loginType,
    roleID: session.roleID,
    roleName: session.roleName,
    lang: "VI",
    bonusInfo: "false",
  })

  console.log("[VNG_BILLING] getProducts for:", session.roleName)

  const response = await fetch("https://billing.vnggames.com/fe/api/multiitemorder/getProducts", {
    method: "POST",
    headers: VNG_COMMON_HEADERS,
    body: params.toString(),
  })

  const text = await response.text()
  let data: any

  try {
    data = JSON.parse(text)
  } catch {
    console.error("[VNG_BILLING] getProducts invalid JSON:", text.slice(0, 300))
    throw new Error("Loi lay danh sach san pham VNG")
  }

  if (data.returnCode !== 1) {
    throw new Error(data.returnMessage || "Khong the lay danh sach goi nap")
  }

  return data.data?.products || {}
}

/**
 * Nap the vao game VNG (createOrder)
 * Day la buoc cuoi cung: gui Serial + PIN vao he thong VNG de nhan goi qua.
 */
export async function createOrder(params: {
  session: VNGSession
  cardSerial: string
  cardPin: string
  productId: string
  amount: number
}): Promise<{ returnCode: number; message: string }> {
  const { session, cardSerial, cardPin, productId, amount } = params

  // Tao description (Base64 encode)
  const description = Buffer.from(
    `${session.roleName} nap ${amount} VND`
  ).toString("base64")

  // Tao products JSON
  const products = JSON.stringify([{ productID: productId, quantity: 1 }])

  const body = new URLSearchParams({
    pmcID: "1",
    paymentGatewayID: "1",
    paymentGroupID: "card",
    paymentPartnerID: "1",
    providerID: "1",
    amount: amount.toString(),
    payingAmount: amount.toString(),
    currency: "VND",
    country: "VN",
    lang: "VI",
    description,
    cardSerial,
    cardPassword: cardPin,
    paymentMethodID: "1",
    paymentProviderID: "1",
    jtoken: session.jtoken,
    serverID: session.serverID,
    userID: session.userID,
    roleID: session.roleID,
    roleName: session.roleName,
    serverName: session.serverName,
    products,
  })

  console.log("[VNG_BILLING] createOrder:", {
    roleId: session.roleID,
    productId,
    amount,
    serial: cardSerial.slice(0, 4) + "***", // Log an toan
  })

  const response = await fetch("https://billing.vnggames.com/fe/api/multiitemorder/createOrder", {
    method: "POST",
    headers: VNG_COMMON_HEADERS,
    body: body.toString(),
  })

  const text = await response.text()
  let data: any

  try {
    data = JSON.parse(text)
  } catch {
    console.error("[VNG_BILLING] createOrder invalid JSON:", text.slice(0, 300))
    throw new Error("Loi nap the vao VNG: Response khong hop le")
  }

  console.log("[VNG_BILLING] createOrder result:", {
    returnCode: data.returnCode,
    message: data.data?.message || data.returnMessage,
  })

  return {
    returnCode: data.returnCode,
    message: data.data?.message || data.returnMessage || "",
  }
}

/**
 * Lay thong tin chi tiet Bank tu chuoi EMVCo QR (ZaloPay Gateway)
 */
async function fetchZaloPayQRInfo(qrCode: string): Promise<any> {
  try {
    console.log("[VNG_BILLING] Fetching ZaloPay QR Info for:", qrCode.slice(0, 30) + "...")
    const response = await fetch("https://zlp-ofp-emvco-gateway.zalopay.vn/v1/emvco/dynamic-qr/info", {
      method: "POST",
      headers: ZALOPAY_INFO_HEADERS,
      body: JSON.stringify({ emvco_qr: qrCode, platform: "" })
    })

    const data = await response.json()
    console.log("[VNG_BILLING] ZaloPay API Result:", JSON.stringify(data))
    
    if (data.return_code === 1 && data.data) {
      return data.data
    }
    return null
  } catch (err) {
    console.error("[VNG_BILLING] fetchZaloPayQRInfo error:", err)
    return null
  }
}

/**
 * Tao don hang VietQR manual tren VNG (Shop VNG logic)
 */
export async function createVietQROrder(params: {
  session: VNGSession
  productId: string
  amount: number
}): Promise<{ 
  returnCode: number; 
  qrCode?: string; 
  orderNumber?: string;
  bankAccount?: string;
  bankName?: string;
  bankAccountName?: string;
  message: string 
}> {
  const { session, productId, amount } = params

  const products = JSON.stringify([{ productID: productId, quantity: 1 }])

  // Format description giong VNG Shop (Base64)
  const descriptionText = `${session.roleName} nạp ${amount.toLocaleString("en-US")} VND vào game Play Together VNG qua VietQR tại Shop.vnggames.com`
  const description = Buffer.from(descriptionText).toString("base64")

  const body = new URLSearchParams({
    pmcID: "72",
    paymentGatewayID: "1",
    paymentGroupID: "vietqr",
    paymentPartnerID: "1",
    providerID: "72",
    amount: amount.toString(),
    description,
    currency: "VND",
    country: "VN",
    lang: "VI",
    paymentMethodID: "72",
    paymentProviderID: "72",
    payingAmount: amount.toString(),
    serverName: "",
    jtoken: session.jtoken,
    serverID: session.serverID,
    userID: session.userID,
    roleID: session.roleID,
    roleName: session.roleName,
    products,
  })

  console.log("[VNG_BILLING] createVietQROrder Request Body:", body.toString())

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch("https://billing.vnggames.com/fe/api/multiitemorder/createOrder", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://shop.vnggames.com',
        'Referer': 'https://shop.vnggames.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'X-Tracking-Client-Id': '1847328280.1778411111',
        'X-Tracking-Session-Id': 's1778411110$o1$g1$t1778411164$j6$l1$h864872828',
      },
      body: body.toString(),
      signal: controller.signal
    })

    const text = await response.text()
    console.log("[VNG_BILLING] createVietQR response:", text)
    clearTimeout(timeoutId)
    
    let data: any
    try {
      data = JSON.parse(text)
    } catch {
      console.error("[VNG_BILLING] createVietQR invalid JSON:", text.slice(0, 300))
      throw new Error("Lỗi tạo mã QR VNG: Response không hợp lệ")
    }

    if (data.returnCode === 1 && data.data?.payData?.qrCode) {
      const payData = data.data.payData
      console.log("[VNG_BILLING] createVietQR success:", data.data.orderNumberStr)
      
      let bankAccount = payData.bankAccount || payData.bankAccountNumber
      let bankName = payData.bankName
      let bankAccountName = payData.bankAccountName

      // Neu thieu thong tin Bank, thu goi ZaloPay API de lay chi tiet
      if (!bankAccount || !bankName) {
        const zaloInfo = await fetchZaloPayQRInfo(payData.qrCode)
        if (zaloInfo) {
          bankAccount = zaloInfo.receiver_acc || zaloInfo.bank_account_number || zaloInfo.bank_account
          bankName = zaloInfo.partner_info?.short_name || zaloInfo.bank_name
          bankAccountName = zaloInfo.receiver_name || zaloInfo.bank_account_name
          console.log("[VNG_BILLING] ZaloPay Info enriched:", { bankName, bankAccount, bankAccountName })
        }
      }

      return {
        returnCode: 1,
        qrCode: payData.qrCode,
        bankAccount,
        bankName,
        bankAccountName,
        orderNumber: data.data.orderNumberStr || String(data.data.orderNumber),
        message: "Thành công"
      }
    }

    console.warn("[VNG_BILLING] createVietQR failed:", data.returnCode, data.returnMessage)
    return {
      returnCode: data.returnCode,
      message: data.returnMessage || data.data?.message || "Không thể tạo mã QR",
    }
  } catch (err: any) {
    clearTimeout(timeoutId)
    console.error("[VNG_BILLING] createVietQR error:", err.message)
    throw err
  }
}
