import { Metadata } from "next"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import AdminHeader from "@/components/admin/AdminHeader"
import AllProductsClient from "@/components/admin/products/AllProductsClient"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.PRODUCTS.title,
}

export default async function AdminAllProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      uploader: {
        select: { name: true, email: true, id: true }
      },
      _count: {
        select: { secrets: { where: { isSold: false } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Danh Sách Sản Phẩm" 
        subtitle="Quản lý tất cả sản phẩm đang có trên hệ thống."
      />
      
      <AllProductsClient 
        initialProducts={JSON.parse(JSON.stringify(products))} 
      />
    </div>
  )
}
