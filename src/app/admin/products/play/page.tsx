import { Metadata } from "next"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import AdminHeader from "@/components/admin/AdminHeader"
import PlayProductsClient from "@/components/admin/products/PlayProductsClient"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.PRODUCTS_PLAY.title,
}

export default async function AdminPlayProductsPage() {
  const products = await prisma.product.findMany({
    where: { type: 'PLAY' },
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

  const categories = await prisma.category.findMany({
    where: {
      products: {
        some: { type: 'PLAY' }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Quản lý Tài khoản Play" 
        subtitle="Quản lý danh sách các tài khoản có thông tin cố định."
        rightElement={
          <Link 
            href={ADMIN_ROUTES.PRODUCTS_PLAY_ADD.path}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border text-foreground rounded-xl font-bold text-xs md:text-sm hover:bg-secondary active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Thêm Tài Khoản
          </Link>
        }
      />
      
      <PlayProductsClient 
        initialProducts={JSON.parse(JSON.stringify(products))} 
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  )
}
