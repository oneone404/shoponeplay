import { prisma } from "@/lib/prisma"
import CategoryForm from "@/components/admin/products/CategoryForm"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.CATEGORIES_ADD.title,
}

export default async function AddCategoryPage() {
  const groups = await prisma.categoryGroup.findMany({
    select: { id: true, name: true }
  })

  return (
    <div className="space-y-6">
      <CategoryForm 
        groups={groups}
        backPath={ADMIN_ROUTES.CATEGORIES.path}
        title={ADMIN_ROUTES.CATEGORIES_ADD.title.split(" - ")[0]}
        subtitle="Tạo danh mục sản phẩm mới cho hệ thống"
      />
    </div>
  )
}
