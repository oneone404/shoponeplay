import { Metadata } from "next"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import AdminProductsClient from "@/components/admin/products/AdminProductsClient"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.PRODUCTS_RANDOM.title,
}

export default async function AdminRandomProductsPage() {
  const products = await prisma.product.findMany({
    where: { type: 'RANDOM' },
    include: {
      category: true,
      uploader: {
        select: { name: true, role: true }
      },
      _count: {
        select: { secrets: { where: { isSold: false } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const categories = await prisma.category.findMany({
    where: {
      products: {
        some: { type: 'RANDOM' }
      }
    },
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' }
  })

  return (
    <AdminProductsClient 
      initialProducts={JSON.parse(JSON.stringify(products))} 
      categories={JSON.parse(JSON.stringify(categories))}
      title="Tài Khoản Random"
      subtitle="Quản lý danh sách các lô tài khoản Random"
      showTypeFilter={false}
      showCards={false}
      hideAccountColumn={true}
      showAddButton={true}
      addPath={ADMIN_ROUTES.PRODUCTS_RANDOM_ADD.path}
      addLabel="Thêm Lô Random"
      showUploader={true}
    />
  )
}
