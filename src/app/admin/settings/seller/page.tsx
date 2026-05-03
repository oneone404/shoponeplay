import { Metadata } from "next"
import AdminHeader from "@/components/admin/AdminHeader"
import SellerSettings from "@/components/admin/settings/SellerSettings"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"

import { Save } from "lucide-react"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.SETTINGS_SELLER.title,
}

export default function AdminSellerSettingsPage() {
  return (
    <div className="space-y-6 w-full">
      <AdminHeader 
        title="Cấu Hình Người Bán" 
        subtitle="Quản lý chính sách chiết khấu và quy định cho Seller" 
      />
      <SellerSettings />
    </div>
  )
}
