import { prisma } from "@/lib/prisma"
import SellerTable from "@/components/admin/sellers/SellerTable"
import AdminHeader from "@/components/admin/AdminHeader"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"

export const metadata = {
  title: ADMIN_ROUTES.SELLERS.title
}

export default async function AdminSellersPage() {
  const sellers = await prisma.user.findMany({
    where: { role: "SELLER" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      balance: true,
      totalDeposited: true,
      lastIP: true,
      createdAt: true,
      _count: {
        select: {
          posts: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Quản Lý Người Bán" 
        subtitle={`Tổng cộng ${sellers.length} đối tác người bán`} 
      />

      <SellerTable initialSellers={sellers} />
    </div>
  )
}
