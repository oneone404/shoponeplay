import { Metadata } from "next"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SELLER_ROUTES } from "@/lib/config/seller-routes"
import SellerOrderHistoryClient from "@/components/seller/SellerOrderHistoryClient"

export const metadata: Metadata = {
  title: SELLER_ROUTES.ORDERS.title
}

export const dynamic = 'force-dynamic'

export default async function SellerOrdersPage() {
  const session = await auth()
  const userId = session!.user.id

  // Bước 1: Lấy tất cả OrderItem thuộc về Seller này
  const sellerOrderItems = await prisma.orderItem.findMany({
    where: {
      product: {
        uploaderId: userId
      }
    },
    select: {
      orderId: true
    }
  })

  const orderIds = Array.from(new Set(sellerOrderItems.map(item => item.orderId)))

  if (orderIds.length === 0) {
    return <SellerOrderHistoryClient initialOrders={[]} stats={{ totalOrders: 0, totalRevenue: 0, pendingOrders: 0 }} />
  }

  // Bước 2: Lấy thông tin các Order này
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
            uploaderId: userId
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
    orderBy: {
      createdAt: "desc"
    }
  })

  // Bước 3: Tính toán dữ liệu cho Seller
  let totalRevenue = 0
  let pendingOrders = 0

  const processedOrders = orders.map(order => {
    const sellerTotal = order.items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0)
    
    if (order.status === "COMPLETED") {
      totalRevenue += sellerTotal
    } else if (order.status === "PENDING") {
      pendingOrders++
    }

    return {
      ...order,
      totalAmount: sellerTotal
    }
  })

  const stats = {
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders
  }

  const serializedOrders = JSON.parse(JSON.stringify(processedOrders))
  const serializedStats = JSON.parse(JSON.stringify(stats))

  return (
    <SellerOrderHistoryClient initialOrders={serializedOrders} stats={serializedStats} />
  )
}
