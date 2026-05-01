import { prisma } from "@/lib/prisma"
import UserTable from "@/components/admin/users/UserTable"
import AdminHeader from "@/components/admin/AdminHeader"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"

export const metadata = {
  title: ADMIN_ROUTES.USERS.title
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
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
    }
  })

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Quản Lý Người Dùng" 
        subtitle={`Tổng cộng ${users.length} thành viên hệ thống`} 
      />

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <UserTable initialUsers={users} />
      </div>
    </div>
  )
}
