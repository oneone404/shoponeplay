import { prisma } from "./prisma"

export async function getCardConfig() {
  const configs = await prisma.config.findMany({
    where: {
      key: { in: ["CARD_PARTNER_ID", "CARD_PARTNER_KEY", "CARD_API_URL", "CARD_ENABLED"] }
    }
  })

  const configMap = new Map(configs.map(c => [c.key, c.value]))
  
  return {
    partnerId: configMap.get("CARD_PARTNER_ID") ?? "",
    partnerKey: configMap.get("CARD_PARTNER_KEY") ?? "",
    apiUrl: configMap.get("CARD_API_URL") ?? "thesieure.com",
    enabled: configMap.get("CARD_ENABLED") === "true"
  }
}
