import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import ProductForm from "@/components/admin/products/ProductForm"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: ADMIN_ROUTES.PRODUCTS_RANDOM_EDIT(id).title
  }
}

export default async function EditRandomProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { secrets: true }
    }),
    prisma.category.findMany({
      where: { group: { slug: { contains: 'random', mode: 'insensitive' } } },
      select: { id: true, name: true }
    })
  ])

  if (!product || product.type !== "RANDOM") {
    notFound()
  }

  return (
    <ProductForm
      type="RANDOM"
      productId={id}
      initialData={product}
      categories={categories}
      backPath={ADMIN_ROUTES.PRODUCTS_RANDOM.path}
      title={ADMIN_ROUTES.PRODUCTS_RANDOM_EDIT(id).title.split(" - ")[0]}
      subtitle="Cập nhật thông tin chung của lô tài khoản"
      submitText="CẬP NHẬT LÔ"
    />
  )
}
