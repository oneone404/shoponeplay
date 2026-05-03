import { USER_ROUTES } from "@/lib/config/user-routes"
import { PrismaClient } from '@prisma/client'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: USER_ROUTES.PRODUCT_DETAIL(id).title
  }
}
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { notFound, redirect } from 'next/navigation'
import ProductDetail from '@/components/shop/ProductDetail'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        include: { group: true }
      }
    }
  })

  if (!product) {
    notFound()
  }

  // Trả về trang 404 cho sản phẩm RANDOM (vì đã áp dụng luồng mua ngay tại shop)
  if (product.type === 'RANDOM') {
    notFound()
  }

  // Format data for Client Component
  const formattedProduct = {
    ...product,
    categoryName: product.category.name,
    groupName: product.category.group.name,
    images: product.images.length > 0 ? product.images : ["/images/product.png"],
    tags: product.type === 'PLAY' ? ['PLAY TOGETHER VNG'] : [],
    stats: (product.stats as any) || {}
  }

  return (
    <div className="min-h-screen bg-background">
      <ProductDetail product={formattedProduct} />
    </div>
  )
}
