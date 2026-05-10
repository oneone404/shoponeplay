import { getTopupOrders } from "@/app/admin/settings/napgame/actions"
import AdminTopupHistoryClient from "@/components/admin/topups/AdminTopupHistoryClient"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: ADMIN_ROUTES.TOPUPS.title,
}

export const dynamic = 'force-dynamic'

export default async function AdminTopupHistoryPage() {
  // Fetch all orders for client-side filtering (following transactions history style)
  const orders = await prisma.topupOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
      user: { select: { name: true, email: true, image: true } }
    }
  })

  // Serialize data
  const serializedOrders = JSON.parse(JSON.stringify(orders))

  return (
    <AdminTopupHistoryClient 
      initialOrders={serializedOrders}
    />
  )
}
