import { Metadata } from "next"
import AdminHeader from "@/components/admin/AdminHeader"
import NotificationSettings from "@/components/admin/settings/NotificationSettings"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.NOTIFICATIONS.title,
}

export default function AdminNotificationSettingsPage() {
  return (
    <div className="space-y-6 w-full">
      <AdminHeader 
        title="Cấu Hình Thông Báo" 
        subtitle="Quản lý hệ thống thông báo qua Telegram và các kênh khác" 
      />
      <NotificationSettings />
    </div>
  )
}
