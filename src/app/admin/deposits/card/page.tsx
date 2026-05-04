import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import AdminDepositsClient from "@/components/admin/transactions/AdminDepositsClient"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.DEPOSITS_CARD.title
}

export const dynamic = 'force-dynamic'

export default async function AdminCardDepositsPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const deposits = await prisma.cardDeposit.findMany({
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

  const serializedDeposits = JSON.parse(JSON.stringify(deposits))

  return (
    <AdminDepositsClient initialDeposits={serializedDeposits} type="CARD" />
  )
}
