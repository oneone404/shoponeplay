import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SellerProductsClient from "@/components/seller/products/SellerProductsClient"
import { SELLER_ROUTES } from "@/lib/config/seller-routes"

export const metadata = {
  title: SELLER_ROUTES.PRODUCTS_PLAY.title,
}

export default async function SellerPlayProductsPage() {
  const session = await auth()
  
  if (!session || (session.user as any).role !== "SELLER" && (session.user as any).role !== "ADMIN") {
    redirect("/")
  }

  const userId = session.user.id

  // Fetch only PLAY products for this seller
  const products = await prisma.product.findMany({
    where: {
      uploaderId: userId,
      type: "PLAY"
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
        title="Tài Khoản Play"
        subtitle="Danh sách tài khoản Play đã đăng bán"
        addPath={SELLER_ROUTES.PRODUCTS_PLAY_ADD.path}
        addLabel="Thêm Tài Khoản"
      />
    </div>
  )
}
