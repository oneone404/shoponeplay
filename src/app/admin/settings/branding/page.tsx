import { Metadata } from "next"
import BrandingSettings from "@/components/admin/settings/BrandingSettings"

import AdminHeader from "@/components/admin/AdminHeader"

import { ADMIN_ROUTES } from "@/lib/config/admin-routes"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.BRANDING.title,
}

export default function BrandingSettingsPage() {
  return (
    <div className="space-y-6 w-full">
      <AdminHeader title="Giao Diện & Branding" subtitle="Quản lý Logo, Favicon và màu sắc thương hiệu" />
      <BrandingSettings />
    </div>
  )
}
