import { Metadata } from "next"
import SystemStatus from "@/components/admin/settings/SystemStatus"

import AdminHeader from "@/components/admin/AdminHeader"

import { ADMIN_ROUTES } from "@/lib/config/admin-routes"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.SYSTEM.title,
}

export default function SystemPage() {
  return (
    <div className="space-y-6 w-full">
      <AdminHeader title="Trạng Thái Hệ Thống" subtitle="Theo dõi hiệu năng và kết nối cơ sở dữ liệu" />
      <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm">
        <SystemStatus />
      </div>
    </div>
  )
}
