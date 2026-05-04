import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { Prisma, type ProductType } from "@prisma/client"
import { getSiteConfig } from "@/lib/configUtils"
import { sendOrderNotification } from "@/lib/telegram"
import { prisma } from "@/lib/prisma"

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
        return NextResponse.json({ error: "Số lượng không hợp lệ" }, { status: 400 })
      }

      const availableSecretsCount = await prisma.accountSecret.count({
        where: {
          productId: product.id,
          isSold: false,
          status: "AVAILABLE" // Chỉ lấy acc đang mở bán
        }
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
          where: {
            productId: item.product.id,
            isSold: false,
            status: "AVAILABLE" // Chỉ lấy acc đang mở bán
          }
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

      // NEW: Log transaction
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: -totalAmount,
          balanceBefore: user.balance,
          balanceAfter: user.balance - totalAmount,
          type: "PURCHASE",
          description: `Thanh Toán Đơn Hàng #${newOrder.id.slice(-12).toUpperCase()}`,
          orderId: newOrder.id
        }
      })

      let totalOrderProfit = 0
      let profitNote = "Phí sàn từ đơn hàng: "

      // B3: Xử lý kho cho từng sản phẩm
      for (const item of itemsToProcess) {
        const secretsToDeliver = await tx.accountSecret.findMany({
          where: {
            productId: item.productId,
            isSold: false,
            status: "AVAILABLE"
          },
          take: item.requiredQty,
          orderBy: { createdAt: "asc" },
          select: { id: true },
        })

        if (secretsToDeliver.length !== item.requiredQty) {
          throw new Error("OUT_OF_STOCK")
        }

        // Lấy uploaderId từ các secret
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
          data: {
            isSold: true,
            soldAt: new Date(),
            orderItemId: orderItem.id,
            status: "SOLD"
          }
        })

        if (delivered.count !== item.requiredQty) {
          throw new Error("OUT_OF_STOCK")
        }

        // B4: Tính lợi nhuận cho sản phẩm này
        if (sellerId) {
          const sellerRevenue = item.price * item.requiredQty * (1 - sellerFeePercent / 100)
          const itemProfit = (item.price * item.requiredQty) - sellerRevenue
          totalOrderProfit += itemProfit

          if (sellerRevenue > 0) {
            // Get current seller balance for logging
            const sellerObj = await tx.user.findUnique({
              where: { id: sellerId },
              select: { balance: true }
            })

            await tx.user.update({
              where: { id: sellerId },
              data: { balance: { increment: sellerRevenue } }
            })

            // NEW: Log transaction for Seller
            await tx.transaction.create({
              data: {
                userId: sellerId,
                amount: sellerRevenue,
                balanceBefore: sellerObj?.balance || 0,
                balanceAfter: (sellerObj?.balance || 0) + sellerRevenue,
                type: "SALE_REVENUE",
                description: `Doanh Thu Từ Đơn Hàng #${newOrder.id.slice(-12).toUpperCase()}`,
                orderId: newOrder.id
              }
            })
          }
        } else {
          totalOrderProfit += item.price * item.requiredQty
        }

        profitNote += `${item.title} (x${item.requiredQty}), `

        // Cập nhật Stock cha
        const remainingStock = await tx.accountSecret.count({
          where: {
            productId: item.productId,
            isSold: false,
            status: "AVAILABLE"
          }
        })

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: remainingStock,
            sold: item.type === 'PLAY' ? true : (remainingStock === 0),
            isHidden: item.type === 'PLAY' ? true : (remainingStock === 0)
          }
        })

        // Xóa khỏi giỏ nếu có
        await tx.cartItem.deleteMany({
          where: { userId: user.id, productId: item.productId }
        })
      }

      // B5: Ghi nhận lợi nhuận hệ thống DUY NHẤT một lần cho cả Order
      if (totalOrderProfit > 0) {
        await tx.systemProfit.create({
          data: {
            amount: totalOrderProfit,
            type: "ORDER_FEE",
            orderId: newOrder.id,
            note: profitNote.slice(0, -2) // Xóa dấu phẩy cuối cùng
          }
        })
      }

      return newOrder
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    })

    // B6: Gửi thông báo Telegram
    try {
      const itemsForNotify = itemsToProcess.map(item => ({
        title: item.title,
        quantity: item.requiredQty,
        price: item.price
      }))

      sendOrderNotification({
        orderId: order.id,
        userName: session.user.name || "Khách hàng",
        userEmail: session.user.email || undefined,
        totalAmount: totalAmount,
        items: itemsForNotify,
        createdAt: new Date()
      }).catch(console.error)
    } catch (e) {
      console.error("[NOTIFY_ORDER_ERROR]", e)
    }

    return NextResponse.json({
      success: true,
      message: `Thanh toán thành công! Mã đơn hàng: ${order.id}`,
      orderId: order.id
    })

  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INSUFFICIENT_BALANCE") {
        return NextResponse.json({ error: "Số dư không đủ" }, { status: 400 })
      }
      if (error.message === "OUT_OF_STOCK") {
        return NextResponse.json({ error: "Sản phẩm vừa hết hàng, vui lòng thử lại" }, { status: 409 })
      }
    }

    console.error("Lỗi khi xử lý checkout:", error)
    return NextResponse.json({ error: "Lỗi hệ thống khi thanh toán" }, { status: 500 })
  }
}
