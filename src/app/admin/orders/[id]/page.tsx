import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import AdminOrderDetailView from "@/components/admin/transactions/AdminOrderDetailView"

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    title: ADMIN_ROUTES.ORDER_DETAIL(id).title,
  }
}

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          balance: true
        }
      },
      items: {
        include: {
          product: {
            include: {
              category: true
            }
          },
          deliveredSecrets: true
        }
      }
    }
  })

  if (!order) {
    notFound()
  }

  // Serialize data
  const serializedOrder = JSON.parse(JSON.stringify(order))

  return (
    <AdminOrderDetailView order={serializedOrder} />
  )
}
