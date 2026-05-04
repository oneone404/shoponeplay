import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const sellerId = "clp8z..." // Tôi sẽ cố gắng lấy ID seller đầu tiên trong DB để test
  
  console.log("1. Khởi động mô phỏng...")
  
  try {
    // Tìm 1 seller thực tế
    const firstSeller = await prisma.user.findFirst({
        where: { role: "SELLER" }
    })
    
    if (!firstSeller) {
        console.log("Không tìm thấy seller nào để test.")
        return
    }
    
    const id = firstSeller.id
    console.log(`2. Đang test với Seller ID: ${id}`)

    console.log("3. Đang lấy OrderItem...")
    const sellerOrderItems = await prisma.orderItem.findMany({
      where: {
        product: {
          uploaderId: id
        }
      },
      select: {
        orderId: true
      }
    })

    const orderIds = Array.from(new Set(sellerOrderItems.map(item => item.orderId)))
    console.log(`4. Tìm thấy ${orderIds.length} Order ID.`)

    if (orderIds.length > 0) {
        console.log("5. Đang lấy thông tin Order chi tiết...")
        const orders = await prisma.order.findMany({
          where: {
            id: {
              in: orderIds
            }
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true
              }
            },
            items: {
              where: {
                product: {
                  uploaderId: id
                }
              },
              select: {
                titleSnapshot: true,
                priceAtPurchase: true,
                quantity: true
              }
            },
            _count: {
              select: {
                items: true
              }
            }
          },
          take: 50,
          orderBy: {
            createdAt: "desc"
          }
        })
        console.log(`6. Đã lấy xong ${orders.length} đơn hàng.`)

        console.log("7. Đang xử lý tính toán tiền...")
        const processedOrders = orders.map(order => {
          const sellerTotal = order.items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0)
          return {
            ...order,
            totalAmount: sellerTotal
          }
        })

        console.log("8. Đang Serialize dữ liệu...")
        const serialized = JSON.parse(JSON.stringify(processedOrders))
        console.log("9. Hoàn tất! Dữ liệu đã sẵn sàng.")
    } else {
        console.log("Không có đơn hàng nào để xử lý.")
    }

  } catch (err) {
    console.error("LỖI:", err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
