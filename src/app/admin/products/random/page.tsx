import { Metadata } from "next"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import AdminHeader from "@/components/admin/AdminHeader"
import RandomProductsClient from "@/components/admin/products/RandomProductsClient"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Zap } from "lucide-react"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.PRODUCTS_RANDOM.title,
}

export default async function AdminRandomProductsPage() {
  const products = await prisma.product.findMany({
    where: { type: 'RANDOM' },
    include: {
      category: true,
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
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Quản lý Tài khoản Random"
        subtitle="Quản lý danh sách các tài khoản nhân phẩm, bán theo lô."
        rightElement={
          <Link 
            href={ADMIN_ROUTES.PRODUCTS_RANDOM_ADD.path}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border text-foreground rounded-xl font-bold text-xs md:text-sm hover:bg-secondary active:scale-95 transition-all whitespace-nowrap"
          >
            <Zap className="w-4 h-4" />
            Thêm Lô Random
          </Link>
        }
      />

      <RandomProductsClient
        initialProducts={JSON.parse(JSON.stringify(products))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  )
}
