import { USER_ROUTES } from "@/lib/config/user-routes"
import { PrismaClient } from '@prisma/client'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Fetch actual name from DB to avoid using slug in title
  const [category, group] = await Promise.all([
    prisma.category.findUnique({ where: { slug }, select: { name: true } }),
    prisma.categoryGroup.findUnique({ where: { slug }, select: { name: true } })
  ])
  
  const displayName = category?.name || group?.name || slug
  
  return {
    title: USER_ROUTES.SHOP_CATEGORY(slug, displayName).title
  }
}
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import ShopContent from '@/components/shop/ShopContent'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params

  // 1. Lấy danh sách các Nhóm Danh Mục và Danh Mục từ DB
  const groups = await prisma.categoryGroup.findMany({
    orderBy: { name: 'asc' }
  })
  const individualCategories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true }
  })

  // 2. Lấy toàn bộ sản phẩm
  const products = await prisma.product.findMany({
    include: { 
      category: {
        include: { group: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Định dạng lại danh mục cho Client Component
  const categories = [
    { id: 'all', name: "SẢN PHẨM", slug: "all" },
    ...groups.map(g => ({ id: g.id, name: g.name, slug: g.slug })),
    ...individualCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
  ]

  // Chuẩn hóa dữ liệu sản phẩm
  const formattedProducts = products.map(p => ({
    ...p,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
    groupSlug: p.category.group.slug,
    groupName: p.category.group.name,
    tags: p.type === 'PLAY' ? ['VIP', 'AN TOÀN'] : (p.type === 'RANDOM' ? ['HOT', '99% TRÚNG'] : ['SIÊU TỐC'])
  }))

  return (
    <ShopContent 
      initialProducts={formattedProducts} 
      categories={categories}
      initialSlug={slug}
    />
  )
}
