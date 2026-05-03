import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma, type ProductType } from "@prisma/client"
import { getSiteConfig } from "@/lib/configUtils"

type CheckoutItem = {
  productId: string
  requiredQty: number
  price: number
  title: string
  type: ProductType
}

function parseQuantity(value: unknown) {
  const quantity = Number(value ?? 1)
  return Number.isInteger(quantity) && quantity > 0 ? quantity : null
}

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { directPurchase } = body // { productId, quantity }

    let itemsToProcess: CheckoutItem[] = []
    let totalAmount = 0

    if (directPurchase?.productId) {
      // LUỒNG MUA NGAY
      const product = await prisma.product.findUnique({
        where: { id: directPurchase.productId },
        include: { category: true }
      })

      if (!product || product.sold) {
        return NextResponse.json({ error: "Sản phẩm không khả dụng" }, { status: 400 })
      }

      const requiredQty = parseQuantity(directPurchase.quantity)
      if (!requiredQty) {
        return NextResponse.json({ error: "Sá»‘ lÆ°á»£ng khÃ´ng há»£p lá»‡" }, { status: 400 })
      }

      const availableSecretsCount = await prisma.accountSecret.count({
        where: { productId: product.id, isSold: false }
      })

      if (availableSecretsCount < requiredQty) {
        return NextResponse.json({ 
          error: `Sản phẩm không đủ hàng trong kho (Còn lại: ${availableSecretsCount})` 
        }, { status: 400 })
      }

      totalAmount = product.price * requiredQty
      itemsToProcess = [{
        productId: product.id,
        requiredQty,
        price: product.price,
        title: product.category.name,
        type: product.type
      }]
    } else {
      // LUỒNG GIỎ HÀNG (Mặc định)
      const cartItems = await prisma.cartItem.findMany({
        where: { userId: session.user.id, selected: true },
        include: { product: { include: { category: true } } }
      })

      if (cartItems.length === 0) {
        return NextResponse.json({ error: "Giỏ hàng rỗng hoặc chưa chọn sản phẩm" }, { status: 400 })
      }

      for (const item of cartItems) {
        const availableCount = await prisma.accountSecret.count({
          where: { productId: item.product.id, isSold: false }
        })

        if (availableCount < item.quantity) {
          return NextResponse.json({ 
            error: `Sản phẩm "${item.product.category.name}" không đủ kho.` 
          }, { status: 400 })
        }

        totalAmount += item.product.price * item.quantity
        itemsToProcess.push({
          productId: item.product.id,
          requiredQty: item.quantity,
          price: item.product.price,
          title: item.product.category.name,
          type: item.product.type
        })
      }
    }

    // Kiểm tra số dư người dùng
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, balance: true },
    })
    if (!user || user.balance < totalAmount) {
      return NextResponse.json({ 
        error: `Số dư không đủ. Bạn cần thêm ${totalAmount - (user?.balance || 0)} VNĐ.` 
      }, { status: 400 })
    }

    // Lấy cấu hình phí sàn
    const config = await getSiteConfig()
    const sellerFeePercent = parseFloat(config.SELLER_FEE || "0")

    // THỰC HIỆN GIAO DỊCH (TRANSACTION)
    const order = await prisma.$transaction(async (tx) => {
      // B1: Trừ tiền User
      const balanceUpdate = await tx.user.updateMany({
        where: { id: user.id, balance: { gte: totalAmount } },
        data: { balance: { decrement: totalAmount } }
      })

      if (balanceUpdate.count !== 1) {
        throw new Error("INSUFFICIENT_BALANCE")
      }

      // B2: Tạo Order
      const newOrder = await tx.order.create({
        data: { userId: user.id, totalAmount, status: 'COMPLETED' }
      })

      // B3: Xử lý kho cho từng sản phẩm
      for (const item of itemsToProcess) {
        const secretsToDeliver = await tx.accountSecret.findMany({
          where: { productId: item.productId, isSold: false },
          take: item.requiredQty,
          orderBy: { createdAt: "asc" },
          select: { id: true },
        })

        if (secretsToDeliver.length !== item.requiredQty) {
          throw new Error("OUT_OF_STOCK")
        }

        // Lấy uploaderId từ các secret (giả định uploader đầu tiên là chủ sở hữu lô)
        const sampleSecret = await tx.accountSecret.findFirst({
          where: { id: secretsToDeliver[0].id },
          select: { uploaderId: true }
        })

        const sellerId = sampleSecret?.uploaderId

        const orderItem = await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.requiredQty,
            priceAtPurchase: item.price,
            titleSnapshot: item.title,
            typeSnapshot: item.type
          }
        })

        const secretIds = secretsToDeliver.map(s => s.id)
        const delivered = await tx.accountSecret.updateMany({
          where: { id: { in: secretIds }, isSold: false },
          data: { isSold: true, soldAt: new Date(), orderItemId: orderItem.id }
        })

        if (delivered.count !== item.requiredQty) {
          throw new Error("OUT_OF_STOCK")
        }

        // B4: Cộng tiền cho Seller (nếu có uploaderId)
        let totalProfitForItem = 0
        if (sellerId) {
          const sellerRevenue = item.price * item.requiredQty * (1 - sellerFeePercent / 100)
          totalProfitForItem = (item.price * item.requiredQty) - sellerRevenue
          
          if (sellerRevenue > 0) {
            await tx.user.update({
              where: { id: sellerId },
              data: { balance: { increment: sellerRevenue } }
            })
          }
        } else {
          // Nếu không có uploader (sản phẩm của admin), lợi nhuận là 100%
          totalProfitForItem = item.price * item.requiredQty
        }

        // B5: Ghi nhận lợi nhuận hệ thống
        if (totalProfitForItem > 0) {
          await tx.systemProfit.create({
            data: {
              amount: totalProfitForItem,
              type: "ORDER_FEE",
              orderId: newOrder.id,
              note: `Phí sàn từ sản phẩm ${item.title} (Số lượng: ${item.requiredQty})`
            }
          })
        }

        // Cập nhật Stock cha
        const remainingStock = await tx.accountSecret.count({
          where: { productId: item.productId, isSold: false }
        })

        await tx.product.update({
          where: { id: item.productId },
          data: { 
            stock: remainingStock,
            sold: item.type === 'PLAY' ? true : (remainingStock === 0)
          }
        })

        // Xóa khỏi giỏ nếu có
        await tx.cartItem.deleteMany({
          where: { userId: user.id, productId: item.productId }
        })
      }

      return newOrder
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    })

    return NextResponse.json({ 
      success: true, 
      message: `Thanh toán thành công! Mã đơn hàng: ${order.id}`,
      orderId: order.id
    })

  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INSUFFICIENT_BALANCE") {
        return NextResponse.json({ error: "So du khong du" }, { status: 400 })
      }
      if (error.message === "OUT_OF_STOCK") {
        return NextResponse.json({ error: "San pham vua het hang, vui long thu lai" }, { status: 409 })
      }
    }

    console.error("Lỗi khi xử lý checkout:", error)
    return NextResponse.json({ error: "Lỗi hệ thống khi thanh toán" }, { status: 500 })
  }
}
