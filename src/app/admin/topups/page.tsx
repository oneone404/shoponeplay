import { getTopupOrders } from "@/app/admin/settings/napgame/actions"
import AdminTopupHistoryClient from "@/components/admin/topups/AdminTopupHistoryClient"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"

export const metadata = {
  title: ADMIN_ROUTES.TOPUPS.title,
}

export default async function AdminTopupHistoryPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string }
}) {
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ""
  const status = searchParams.status || "ALL"
  const limit = 20

  const { orders, total, pages } = await getTopupOrders({ 
    page, 
    limit, 
    search, 
    status 
  })

  return (
    <AdminTopupHistoryClient 
      initialOrders={orders}
      totalPages={pages}
      currentPage={page}
    />
  )
}
