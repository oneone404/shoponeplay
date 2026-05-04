import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SellerProductsClient from "@/components/seller/products/SellerProductsClient"
import { SELLER_ROUTES } from "@/lib/config/seller-routes"

export const metadata = {
  title: SELLER_ROUTES.PRODUCTS.title,
}

export default async function SellerProductsPage() {
  const session = await auth()
  const userId = session!.user.id

  // Fetch products uploaded by this seller
  const products = await prisma.product.findMany({
    where: {
      uploaderId: userId
    },
    include: {
      category: true,
      _count: {
        select: {
          secrets: {
            where: { isSold: false }
          }
        }
      },
      secrets: {
        take: 1,
        select: { username: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // Fetch all categories for filter
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true
    }
  })

  // Cast for client component
  const formattedProducts = products.map(p => ({
    ...p,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
    stock: p._count.secrets,
    username: p.secrets[0]?.username
  }))

  return (
    <div className="space-y-8">
      <SellerProductsClient 
        initialProducts={formattedProducts as any} 
        categories={categories}
        title="Tất Cả Sản Phẩm"
        subtitle="Quản lý danh sách sản phẩm và kho tài khoản"
        showCategoryFilter={true}
        showAddButton={false}
        showTypeFilter={true}
      />
    </div>
  )
}
