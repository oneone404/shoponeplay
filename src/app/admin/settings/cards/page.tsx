import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminCardsClient from "@/components/admin/settings/AdminCardsClient"

export default async function AdminCardsPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const configs = await prisma.config.findMany({
    where: {
      key: { in: ["CARD_PARTNER_ID", "CARD_PARTNER_KEY", "CARD_API_URL", "CARD_ENABLED"] }
    }
  })

  const configMap = new Map(configs.map(c => [c.key, c.value]))
  
  return (
    <AdminCardsClient 
      initialPartnerId={configMap.get("CARD_PARTNER_ID") ?? ""}
      initialPartnerKey={configMap.get("CARD_PARTNER_KEY") ?? ""}
      initialApiUrl={configMap.get("CARD_API_URL") ?? "thesieure.com"}
      initialEnabled={configMap.get("CARD_ENABLED") === "true"}
    />
  )
}
