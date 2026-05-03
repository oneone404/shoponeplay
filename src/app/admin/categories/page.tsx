import { Metadata } from "next"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import AdminHeader from "@/components/admin/AdminHeader"
import CategoriesClient from "@/components/admin/products/CategoriesClient"
import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.CATEGORIES.title,
}

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      group: true,
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const groups = await prisma.categoryGroup.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Quản Lý Danh Mục" 
        subtitle="Quản lý các nhóm danh mục và danh mục sản phẩm trên hệ thống."
        rightElement={
          <Link 
            href="/admin/categories/add"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border text-foreground rounded-xl font-bold text-xs md:text-sm hover:bg-secondary active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Thêm Danh Mục
          </Link>
        }
      />
      
      <CategoriesClient 
        initialCategories={JSON.parse(JSON.stringify(categories))} 
        groups={JSON.parse(JSON.stringify(groups))}
      />
    </div>
  )
}
