import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminCardsClient from "@/components/admin/settings/AdminCardsClient"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"

export const metadata: Metadata = {
  title: ADMIN_ROUTES.CARDS.title,
}

export default async function AdminCardsPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const configs = await prisma.config.findMany({
    where: {
      key: { 
        startsWith: "CARD_",
      }
    }
  })

  const configMap = new Map(configs.map(c => [c.key, c.value]))

  const telcos = ["VIETTEL", "MOBIFONE", "VINAPHONE", "ZING", "GARENA"]
  const telcoDiscounts: Record<string, number> = {}
  telcos.forEach(t => {
    telcoDiscounts[t] = Number(configMap.get(`CARD_DISCOUNT_${t}`) ?? "20")
  })
  
  return (
    <AdminCardsClient 
      initialPartnerId={configMap.get("CARD_PARTNER_ID") ?? ""}
      initialPartnerKey={configMap.get("CARD_PARTNER_KEY") ?? ""}
      initialApiUrl={configMap.get("CARD_API_URL") ?? "thesieure.com"}
      initialEnabled={configMap.get("CARD_ENABLED") === "true"}
      initialCustomDiscountEnabled={configMap.get("CARD_CUSTOM_DISCOUNT_ENABLED") === "true"}
      initialTelcoDiscounts={telcoDiscounts}
    />
  )
}
