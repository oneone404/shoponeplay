import { Metadata } from "next"
import GeneralSettings from "@/components/admin/settings/GeneralSettings"
import AdminHeader from "@/components/admin/AdminHeader"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.SETTINGS.title,
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 w-full">
      <AdminHeader title="Cài Đặt Hệ Thống" subtitle="Quản lý nội dung và cấu hình website" />
      {/* General Settings (Includes System Status) */}
      <GeneralSettings />
    </div>
  )
}
