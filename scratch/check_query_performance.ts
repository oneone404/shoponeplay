import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const sellerId = "cm0m0m0m00000000000000001" // Giả định một ID seller hoặc lấy ID thực tế
  
  console.log("--- Bắt đầu kiểm tra hiệu năng truy vấn Seller Orders ---")
  
  const start = Date.now()
  
  try {
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              uploaderId: sellerId
            }
          }
        }
      },
      include: {
        items: {
          where: {
            product: {
              uploaderId: sellerId
            }
          }
        }
      }
    })
    
    const end = Date.now()
    console.log(`Thời gian thực thi: ${end - start}ms`)
    console.log(`Số lượng đơn hàng tìm thấy: ${orders.length}`)
    
    // Kiểm tra tổng số bản ghi trong hệ thống
    const totalOrders = await prisma.order.count()
    const totalItems = await prisma.orderItem.count()
    console.log(`Tổng số đơn hàng trong DB: ${totalOrders}`)
    console.log(`Tổng số OrderItem trong DB: ${totalItems}`)

  } catch (error) {
    console.error("Lỗi khi chạy query:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
