import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import AdminTransactionHistoryClient from "@/components/admin/transactions/AdminTransactionHistoryClient"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.TRANSACTIONS_HISTORY.title
}

export const dynamic = 'force-dynamic'

export default async function AdminTransactionHistoryPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const transactions = await prisma.transaction.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // Serialize data for client component
  const serializedTransactions = JSON.parse(JSON.stringify(transactions))

  return (
    <AdminTransactionHistoryClient initialTransactions={serializedTransactions} />
  )
}
