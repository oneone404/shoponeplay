import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import AdminWithdrawalsClient from "@/components/admin/transactions/AdminWithdrawalsClient"

export const metadata: Metadata = {
  title: "Lịch Sử Thanh Toán - ShopOnePlay Admin"
}

export const dynamic = 'force-dynamic'

export default async function AdminWithdrawalsPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const withdrawals = await prisma.withdrawal.findMany({
    include: {
      user: {
        select: {
          id: true,
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

  // Serialize data
  const serializedWithdrawals = JSON.parse(JSON.stringify(withdrawals))

  return (
    <AdminWithdrawalsClient initialWithdrawals={serializedWithdrawals} />
  )
}
