import { prisma } from "@/lib/prisma"
import ProductForm from "@/components/admin/products/ProductForm"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.PRODUCTS_PLAY_ADD.title,
}

export default async function AddPlayProductPage() {
  // Tìm các danh mục thuộc nhóm Play
  // Ở đây tôi tìm theo slug của nhóm chứa chữ "play"
  const categories = await prisma.category.findMany({
    where: {
      group: {
        slug: { contains: 'play', mode: 'insensitive' }
      }
    },
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

  // Nếu không thấy category nào thuộc nhóm Play, lấy tất cả để tránh lỗi
  const finalCategories = categories.length > 0 
    ? categories 
    : await prisma.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })

  return (
    <div className="space-y-6">
      <ProductForm 
        type="PLAY"
        categories={finalCategories}
        backPath={ADMIN_ROUTES.PRODUCTS_PLAY.path}
        title="Thêm Tài Khoản Play"
        subtitle="Tạo sản phẩm mới với thông tin tài khoản cố định."
      />
    </div>
  )
}
