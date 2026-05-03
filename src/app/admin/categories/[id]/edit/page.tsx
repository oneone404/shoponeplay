import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CategoryForm from "@/components/admin/products/CategoryForm"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { Metadata } from "next"

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    title: ADMIN_ROUTES.CATEGORIES_EDIT(id).title,
  }
}

export default async function EditCategoryPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [category, groups] = await Promise.all([
    prisma.category.findUnique({
      where: { id }
    }),
    prisma.categoryGroup.findMany({
      select: { id: true, name: true }
    })
  ])

  if (!category) notFound()

  return (
    <div className="space-y-6">
      <CategoryForm
        groups={groups}
        backPath={ADMIN_ROUTES.CATEGORIES.path}
        title={ADMIN_ROUTES.CATEGORIES_EDIT(id).title.split(" - ")[0]}
        subtitle={`Đang chỉnh sửa: ${category.name}`}
        categoryId={id}
        initialData={category}
        submitText="Lưu Danh Mục"
      />
    </div>
  )
}
