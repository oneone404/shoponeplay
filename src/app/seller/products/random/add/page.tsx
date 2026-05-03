import { prisma } from "@/lib/prisma"
import SellerProductForm from "@/components/seller/products/SellerProductForm"
import { SELLER_ROUTES } from "@/lib/config/seller-routes"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: SELLER_ROUTES.PRODUCTS_RANDOM_ADD.title,
}

export default async function SellerAddRandomProductPage() {
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

  // Nếu không thấy category nào thuộc nhóm Random, lấy tất cả để tránh lỗi
  const finalCategories = categories.length > 0 
    ? categories 
    : await prisma.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })

  return (
    <div className="space-y-6">
      <SellerProductForm 
        type="RANDOM"
        categories={finalCategories}
        backPath={SELLER_ROUTES.PRODUCTS_RANDOM.path}
        title="Thêm Lô Random"
        subtitle="Tạo lô sản phẩm mới với danh sách tài khoản ngẫu nhiên."
      />
    </div>
  )
}
