import { Metadata } from "next"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import AdminProductsClient from "@/components/admin/products/AdminProductsClient"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.PRODUCTS_PLAY.title,
}

export default async function AdminPlayProductsPage() {
  const products = await prisma.product.findMany({
    where: { type: 'PLAY' },
    include: {
      category: true,
      uploader: {
        select: { name: true, role: true }
      },
      _count: {
        select: { secrets: { where: { isSold: false } } }
      },
      secrets: {
        take: 1,
        select: { username: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const categories = await prisma.category.findMany({
    where: {
      products: {
        some: { type: 'PLAY' }
      }
    },
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' }
  })

  return (
    <AdminProductsClient 
      initialProducts={JSON.parse(JSON.stringify(products))} 
      categories={JSON.parse(JSON.stringify(categories))}
      title="Tài Khoản Play"
      subtitle="Quản lý danh sách các tài khoản Play lẻ"
      showTypeFilter={false}
      showCards={false}
      hideStockColumn={true}
      showAddButton={true}
      addPath={ADMIN_ROUTES.PRODUCTS_PLAY_ADD.path}
      addLabel="Thêm Tài Khoản"
      showUploader={true}
    />
  )
}
