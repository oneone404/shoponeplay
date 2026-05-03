import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import SellerProductForm from "@/components/seller/products/SellerProductForm"
import { SELLER_ROUTES } from "@/lib/config/seller-routes"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chỉnh Sửa Sản Phẩm - ShopOnePlay",
}

export default async function SellerEditProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/login")

  const product = await prisma.product.findUnique({
    where: { 
      id: params.id,
      uploaderId: session.user.id // Security: Only allow owner to edit
    },
    include: {
      category: true,
      secrets: true,
    }
  })

  if (!product) notFound()

  // Get categories based on product type
  const categories = await prisma.category.findMany({
    where: {
      group: {
        slug: { contains: product.type === "PLAY" ? "play" : "random", mode: "insensitive" }
      }
    },
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  })

  const backPath = product.type === "PLAY" ? SELLER_ROUTES.PRODUCTS_PLAY.path : SELLER_ROUTES.PRODUCTS_RANDOM.path
  const isPlay = product.type === "PLAY"
  const pageTitle = isPlay ? "Sửa Tài Khoản Play" : "Sửa Lô Random"
  const pageSubtitle = isPlay 
    ? "Cập nhật thông tin sản phẩm và tài khoản đăng nhập" 
    : "Cập nhật thông tin lô và thêm tài khoản vào kho"

  return (
    <div className="space-y-6">
      <SellerProductForm 
        productId={product.id}
        type={product.type as "PLAY" | "RANDOM"}
        categories={categories}
        initialData={JSON.parse(JSON.stringify(product))}
        backPath={backPath}
        title={pageTitle}
        subtitle={pageSubtitle}
        submitText={isPlay ? "CẬP NHẬT TÀI KHOẢN" : "CẬP NHẬT LÔ RANDOM"}
      />
    </div>
  )
}
