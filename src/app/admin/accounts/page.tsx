import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import AdminAccountsHistoryClient from "@/components/admin/transactions/AdminAccountsHistoryClient"

export const dynamic = 'force-dynamic'

export default async function AdminAccountsHistoryPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const accounts = await prisma.accountSecret.findMany({
    where: {
      isSold: true
    },
    include: {
      product: {
        select: {
          id: true,
          category: {
            select: { name: true }
          }
        }
      },
      orderItem: {
        include: {
          order: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      soldAt: "desc"
    }
  })

  // Map category name to title for client component
  const formattedAccounts = accounts.map(acc => ({
    ...acc,
    product: {
      id: acc.product.id,
      title: acc.product.category.name
    }
  }))

  // Serialize data for client component
  const serializedAccounts = JSON.parse(JSON.stringify(formattedAccounts))

  return (
    <AdminAccountsHistoryClient initialAccounts={serializedAccounts} />
  )
}
