import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import ProductForm from "@/components/admin/products/ProductForm"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: ADMIN_ROUTES.PRODUCTS_PLAY_EDIT(id).title
  }
}

export default async function EditPlayProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { secrets: true }
    }),
    prisma.category.findMany({
      where: { group: { slug: { contains: 'play', mode: 'insensitive' } } },
      select: { id: true, name: true }
    })
  ])

  if (!product || product.type !== "PLAY") {
    notFound()
  }

  return (
    <ProductForm
      type="PLAY"
      productId={id}
      initialData={product}
      categories={categories}
      backPath={ADMIN_ROUTES.PRODUCTS_PLAY.path}
      title={ADMIN_ROUTES.PRODUCTS_PLAY_EDIT(id).title.split(" - ")[0]}
      subtitle="Cập nhật thông tin sản phẩm và tài khoản đăng nhập"
      submitText="CẬP NHẬT TÀI KHOẢN"
    />
  )
}
