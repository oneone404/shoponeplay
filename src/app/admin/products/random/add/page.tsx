import { prisma } from "@/lib/prisma"
import ProductForm from "@/components/admin/products/ProductForm"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.PRODUCTS_RANDOM_ADD.title,
}

export default async function AddRandomProductPage() {
  // Tìm các danh mục thuộc nhóm Random
  const categories = await prisma.category.findMany({
    where: {
      group: {
        slug: { contains: 'random', mode: 'insensitive' }
      }
    },
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

  // Fallback nếu không thấy nhóm random
  const finalCategories = categories.length > 0 
    ? categories 
    : await prisma.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })

  return (
    <div className="space-y-6">
      <ProductForm 
        type="RANDOM"
        categories={finalCategories}
        backPath={ADMIN_ROUTES.PRODUCTS_RANDOM.path}
        title="Thêm Lô Random"
        subtitle="Tải lên hàng loạt tài khoản cho danh mục Random."
      />
    </div>
  )
}
