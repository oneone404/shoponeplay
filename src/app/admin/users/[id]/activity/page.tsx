import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import UserActivityView from "@/components/admin/users/UserActivityView"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: ADMIN_ROUTES.USER_ACTIVITY(id).title
  }
}

export default async function UserActivityPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: true
        }
      },
      activities: {
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!user) notFound()

  return <UserActivityView user={user as any} />
}
