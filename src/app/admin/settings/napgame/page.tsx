import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminNapGameClient from "@/components/admin/settings/AdminNapGameClient"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { getNapGameConfig, getTopupProducts, getCardGatewayConfig, getTopupOrders } from "./actions"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.NAPGAME.title,
}

export default async function AdminNapGamePage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const [napGameConfig, topupProducts, cardConfig, topupOrders] = await Promise.all([
    getNapGameConfig(),
    getTopupProducts(),
    getCardGatewayConfig(),
    getTopupOrders({ limit: 50 }),
  ])
  
  return (
    <AdminNapGameClient 
      initialHotConfig={napGameConfig.hotItems} 
      initialMarkup={napGameConfig.markup} 
      initialRounding={napGameConfig.rounding}
      initialTopupProducts={JSON.parse(JSON.stringify(topupProducts))}
      initialCardConfig={cardConfig}
      initialTopupOrders={JSON.parse(JSON.stringify(topupOrders.orders))}
    />
  )
}

