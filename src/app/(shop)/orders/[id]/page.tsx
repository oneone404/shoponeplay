import { Metadata } from "next"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { USER_ROUTES } from "@/lib/config/user-routes"
import OrderDetailClient from "./OrderDetailClient"

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    title: USER_ROUTES.ORDER_DETAIL(id).title,
  }
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login")

  const order = await prisma.order.findFirst({
    where: { 
      id: id,
      userId: session.user.id
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              thumbnail: true
            }
          },
          deliveredSecrets: true
        }
      }
    }
  })

  if (!order) notFound()

  return <OrderDetailClient order={order} />
}
