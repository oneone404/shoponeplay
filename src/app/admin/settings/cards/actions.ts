"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function updateCardConfig(data: {
  partnerId: string
  partnerKey: string
  apiUrl: string
  enabled: boolean
  customDiscountEnabled: boolean
  telcoDiscounts: Record<string, number>
}) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    const configs = [
      { key: "CARD_PARTNER_ID", value: data.partnerId },
      { key: "CARD_PARTNER_KEY", value: data.partnerKey },
      { key: "CARD_API_URL", value: data.apiUrl },
      { key: "CARD_ENABLED", value: String(data.enabled) },
      { key: "CARD_CUSTOM_DISCOUNT_ENABLED", value: String(data.customDiscountEnabled) },
      ...Object.entries(data.telcoDiscounts).map(([telco, value]) => ({
        key: `CARD_DISCOUNT_${telco.toUpperCase()}`,
        value: String(value)
      }))
    ]

    await Promise.all(
      configs.map(config =>
        prisma.config.upsert({
          where: { key: config.key },
          update: { value: config.value },
          create: { key: config.key, value: config.value }
        })
      )
    )

    revalidatePath("/admin/settings/cards")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_CARD_CONFIG_ERROR]", error)
    return { success: false, error: "Internal Server Error" }
  }
}
