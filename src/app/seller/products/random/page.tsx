import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SellerProductsClient from "@/components/seller/products/SellerProductsClient"
import { SELLER_ROUTES } from "@/lib/config/seller-routes"

export const metadata = {
  title: SELLER_ROUTES.PRODUCTS_RANDOM.title,
}

export default async function SellerRandomProductsPage() {
  const session = await auth()
  const userId = session!.user.id

  // Fetch only RANDOM products for this seller
  const products = await prisma.product.findMany({
    where: {
      uploaderId: userId,
      type: "RANDOM"
    },
    include: {
      category: true,
      _count: {
        select: {
          secrets: {
            where: { isSold: false }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true }
  })

  const formattedProducts = products.map(p => ({
    ...p,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
    stock: p._count.secrets
  }))

  return (
    <div className="space-y-8">
      <SellerProductsClient 
        initialProducts={formattedProducts as any} 
        categories={categories}
        title="Tài Khoản Random"
        subtitle="Danh sách tài khoản Random đã đăng bán"
        addPath={SELLER_ROUTES.PRODUCTS_RANDOM_ADD.path}
        addLabel="Thêm Lô Random"
        showCards={false}
        hideAccountColumn={true}
      />
    </div>
  )
}
