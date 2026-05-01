import { USER_ROUTES } from "@/lib/config/user-routes"
import { PrismaClient } from '@prisma/client'

export const metadata = {
  title: USER_ROUTES.SHOP.title,
}
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import ShopContent from '@/components/shop/ShopContent'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export default async function ShopPage() {
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
    { id: 'all', name: "TẤT CẢ", slug: "all" },
    ...individualCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
  ]

  // Chuẩn hóa dữ liệu sản phẩm để dễ dùng ở Client
  const formattedProducts = products.map(p => ({
    ...p,
    categoryName: p.category.name,
    categorySlug: p.category.slug, // Slug của danh mục cụ thể
    groupSlug: p.category.group.slug, // Slug của nhóm (để lọc theo tab)
    groupName: p.category.group.name,
    tags: p.type === 'PLAY' ? ['VIP', 'AN TOÀN'] : (p.type === 'RANDOM' ? ['HOT', '99% TRÚNG'] : ['SIÊU TỐC'])
  }))

  return (
    <ShopContent 
      initialProducts={formattedProducts} 
      categories={categories} 
    />
  )
}
