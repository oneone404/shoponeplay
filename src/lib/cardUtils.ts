import { prisma } from "./prisma"

export async function getCardConfig() {
  const configs = await prisma.config.findMany({
    where: {
      key: { startsWith: "CARD_" }
    }
  })

  const configMap = new Map(configs.map(c => [c.key, c.value]))

  const telcos = ["VIETTEL", "MOBIFONE", "VINAPHONE", "ZING", "GARENA"]
  const telcoDiscounts: Record<string, number> = {}
  telcos.forEach(t => {
    telcoDiscounts[t] = Number(configMap.get(`CARD_DISCOUNT_${t}`) ?? "20")
  })

  return {
    partnerId: configMap.get("CARD_PARTNER_ID") ?? "",
    partnerKey: configMap.get("CARD_PARTNER_KEY") ?? "",
    apiUrl: configMap.get("CARD_API_URL") ?? "thesieure.com",
    enabled: configMap.get("CARD_ENABLED") === "true",
    customDiscountEnabled: configMap.get("CARD_CUSTOM_DISCOUNT_ENABLED") === "true",
    telcoDiscounts
  }
}
