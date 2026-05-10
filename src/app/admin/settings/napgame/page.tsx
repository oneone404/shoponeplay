import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminNapGameClient from "@/components/admin/settings/AdminNapGameClient"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { getNapGameConfig } from "./actions"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.NAPGAME.title,
}

export default async function AdminNapGamePage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const { hotItems, markup, rounding } = await getNapGameConfig()
  
  return (
    <AdminNapGameClient 
      initialHotConfig={hotItems} 
      initialMarkup={markup} 
      initialRounding={rounding}
    />
  )
}
