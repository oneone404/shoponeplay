import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import AdminTransactionsClient from "@/components/admin/transactions/AdminTransactionsClient"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.TRANSACTIONS.title
}

export const dynamic = 'force-dynamic'

export default async function AdminTransactionsPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      },
      items: {
        select: {
          titleSnapshot: true
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

  // Serialize data for client component
  const serializedOrders = JSON.parse(JSON.stringify(orders))

  return (
    <AdminTransactionsClient initialOrders={serializedOrders} />
  )
}
