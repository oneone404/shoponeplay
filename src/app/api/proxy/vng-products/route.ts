import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "Thiếu User ID" }, { status: 400 })
    }

    const commonHeaders = {
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

    // STEP 1: Quick Auth to get jtoken and character info
    console.log("[VNG_STEP1_QUICK_AUTH] Calling auth/quick for:", userId)
    const authParams = new URLSearchParams()
    authParams.append('platform', 'mobile')
    authParams.append('clientKey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjIjoxMDY2MSwiYSI6MTA2NjEsInMiOjF9.B08-6v9oP3rNxrvImC-WBO-AN0mru77ZNLOgqosNIjA')
    authParams.append('loginType', '9')
    authParams.append('lang', 'VI')
    authParams.append('jtoken', '')
    authParams.append('userID', '')
    authParams.append('roleID', userId)
    authParams.append('roleName', userId)
    authParams.append('serverID', '')
    authParams.append('getVgaId', '1')

    const authResponse = await fetch('https://billing.vnggames.com/fe/api/auth/quick', {
      method: 'POST',
      headers: commonHeaders,
      body: authParams.toString(),
    })

    const authText = await authResponse.text()
    let authData: any
    try {
      authData = JSON.parse(authText)
      console.log("[VNG_STEP1_RESULT] Success:", authData.returnCode)
    } catch (e) {
      console.error("[VNG_STEP1_ERROR] Invalid JSON response:", authText.slice(0, 500))
      return NextResponse.json({ 
        success: false, 
        message: "Lỗi xác thực từ VNG. Vui lòng thử lại sau.",
        debug: authText.slice(0, 200)
      }, { status: 500 })
    }

    if (authData.returnCode !== 1 || !authData.data?.jtoken) {
      return NextResponse.json({ 
        success: false, 
        message: authData.returnMessage || "Không thể xác thực nhân vật hoặc ID không tồn tại",
        raw: authData 
      }, { status: 400 })
    }

    const { jtoken, roleID, roleName, serverID, userID } = authData.data

    // STEP 2: Fetch products using the fresh token and character info
    const bodyParams = new URLSearchParams()
    bodyParams.append('jtoken', jtoken)
    bodyParams.append('serverID', serverID)
    bodyParams.append('userID', userID)
    bodyParams.append('loginType', '9')
    bodyParams.append('roleID', roleID)
    bodyParams.append('roleName', roleName)
    bodyParams.append('lang', 'VI')
    bodyParams.append('bonusInfo', 'false')

    console.log("[VNG_STEP2_PRODUCTS] Fetching products for:", roleName)
    
    const productResponse = await fetch('https://billing.vnggames.com/fe/api/multiitemorder/getProducts', {
      method: 'POST',
      headers: commonHeaders,
      body: bodyParams.toString(),
    })

    const productText = await productResponse.text()
    let productData: any
    try {
      productData = JSON.parse(productText)
      console.log("[VNG_STEP2_RESULT] Success:", productData.returnCode)
    } catch (e) {
      console.error("[VNG_STEP2_ERROR] Invalid JSON response:", productText.slice(0, 500))
      return NextResponse.json({ 
        success: false, 
        message: "Lỗi khi lấy danh sách sản phẩm từ VNG",
        debug: productText.slice(0, 200)
      }, { status: 500 })
    }

    if (productData.returnCode === 1) {
      const [markupConfig, roundingConfig] = await Promise.all([
        prisma.config.findUnique({ where: { key: "NAPGAME_MARKUP_PERCENT" } }),
        prisma.config.findUnique({ where: { key: "NAPGAME_ROUNDING_ENABLED" } })
      ])
      
      const markupPercent = markupConfig ? Number(markupConfig.value) : 0
      const isRoundingEnabled = roundingConfig ? roundingConfig.value === "true" : false

      if (productData.data?.products) {
        Object.keys(productData.data.products).forEach(id => {
          const product = productData.data.products[id]
          if (product.prices?.VND?.price) {
            let price = product.prices.VND.price
            product.prices.VND.basePrice = price // LƯU GIÁ GỐC
            
            // Apply markup
            if (markupPercent > 0) {
              price = price + (price * (markupPercent / 100))
            }
 
            // Apply rounding: < 50k round to nearest 5k, >= 50k round to nearest 10k
            if (isRoundingEnabled) {
              if (price < 50000) {
                price = Math.ceil(price / 5000) * 5000
              } else {
                price = Math.ceil(price / 10000) * 10000
              }
            }
 
            product.prices.VND.price = price
          }
        })
      }

      return NextResponse.json({ 
        success: true, 
        data: productData.data,
        character: {
          name: roleName,
          server: serverID,
          id: roleID
        }
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: productData.returnMessage || "Không thể lấy danh sách gói nạp", 
        raw: productData 
      }, { status: 400 })
    }

  } catch (error: any) {
    console.error("[VNG_PROXY_ERROR]", error)
    return NextResponse.json({ success: false, message: "Lỗi hệ thống: " + error.message }, { status: 500 })
  }
}
