"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function getNapGameConfig() {
  const [hotConfig, markupConfig, roundingConfig] = await Promise.all([
    prisma.config.findUnique({ where: { key: "NAPGAME_HOT_CONFIG" } }),
    prisma.config.findUnique({ where: { key: "NAPGAME_MARKUP_PERCENT" } }),
    prisma.config.findUnique({ where: { key: "NAPGAME_ROUNDING_ENABLED" } })
  ])
  
  const hotItems = hotConfig ? JSON.parse(hotConfig.value) : []
  const markup = markupConfig ? Number(markupConfig.value) : 0
  const rounding = roundingConfig ? roundingConfig.value === "true" : false
  
  return { hotItems, markup, rounding }
}

export async function updateNapGameConfig(items: any[], markup: number, rounding: boolean) {
  try {
    await prisma.$transaction([
      prisma.config.upsert({
        where: { key: "NAPGAME_HOT_CONFIG" },
        update: { value: JSON.stringify(items) },
        create: { key: "NAPGAME_HOT_CONFIG", value: JSON.stringify(items) }
      }),
      prisma.config.upsert({
        where: { key: "NAPGAME_MARKUP_PERCENT" },
        update: { value: markup.toString() },
        create: { key: "NAPGAME_MARKUP_PERCENT", value: markup.toString() }
      }),
      prisma.config.upsert({
        where: { key: "NAPGAME_ROUNDING_ENABLED" },
        update: { value: rounding.toString() },
        create: { key: "NAPGAME_ROUNDING_ENABLED", value: rounding.toString() }
      })
    ])
    
    revalidatePath("/app/napgame")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUserAccountId(accountId: string, name?: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Bạn cần đăng nhập để thực hiện tính năng này" }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { savedAccountIds: true }
    })

    let saved = (user?.savedAccountIds as any[]) || []
    
    if (accountId && name) {
      const exists = saved.find((item: any) => item.id === accountId)
      if (exists) {
        // Update name if changed
        saved = saved.map((item: any) => item.id === accountId ? { ...item, name } : item)
      } else {
        saved.push({ id: accountId, name })
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        accountId,
        savedAccountIds: saved
      }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function removeSavedAccountId(accountId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Bạn cần đăng nhập" }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { savedAccountIds: true, accountId: true }
    })

    const saved = (user?.savedAccountIds as any[]) || []
    const newSaved = saved.filter((item: any) => item.id !== accountId)
    const newActiveId = user?.accountId === accountId ? (newSaved[0]?.id || "") : user?.accountId

    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        savedAccountIds: newSaved,
        accountId: newActiveId
      }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// ===================== TOPUP PRODUCT CRUD =====================

export async function getTopupProducts() {
  return prisma.topupProduct.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { orders: true } } }
  })
}

export async function createTopupProduct(data: {
  name: string
  vngProductId?: string
  cardValue: number
  serviceCode: string
  sellPrice: number
  enabled: boolean
  sortOrder: number
}) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "Khong co quyen" }
    }

    await prisma.topupProduct.create({ data })
    revalidatePath("/admin/settings/napgame")
    revalidatePath("/app/napgame")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateTopupProduct(id: string, data: {
  name?: string
  vngProductId?: string
  cardValue?: number
  serviceCode?: string
  sellPrice?: number
  enabled?: boolean
  sortOrder?: number
}) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "Khong co quyen" }
    }

    await prisma.topupProduct.update({ where: { id }, data })
    revalidatePath("/admin/settings/napgame")
    revalidatePath("/app/napgame")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteTopupProduct(id: string) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "Khong co quyen" }
    }

    await prisma.topupProduct.delete({ where: { id } })
    revalidatePath("/admin/settings/napgame")
    revalidatePath("/app/napgame")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// ===================== CARD GATEWAY CONFIG =====================

export async function getCardGatewayConfig() {
  const keys = ["CARD_BASE_URL", "CARD_PARTNER_ID", "CARD_PARTNER_KEY", "CARD_WALLET_NUMBER", "CARD_CALLBACK_URL"]
  const configs = await prisma.config.findMany({
    where: { key: { in: keys } }
  })
  const configMap = new Map(configs.map(c => [c.key, c.value]))

  return {
    baseUrl: configMap.get("CARD_BASE_URL") || "",
    partnerId: configMap.get("CARD_PARTNER_ID") || "",
    partnerKey: configMap.get("CARD_PARTNER_KEY") || "",
    walletNumber: configMap.get("CARD_WALLET_NUMBER") || "",
    callbackUrl: configMap.get("CARD_CALLBACK_URL") || "",
  }
}

export async function updateCardGatewayConfig(data: {
  baseUrl: string
  partnerId: string
  partnerKey: string
  walletNumber: string
  callbackUrl: string
}) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "Khong co quyen" }
    }

    const entries = [
      { key: "CARD_BASE_URL", value: data.baseUrl },
      { key: "CARD_PARTNER_ID", value: data.partnerId },
      { key: "CARD_PARTNER_KEY", value: data.partnerKey },
      { key: "CARD_WALLET_NUMBER", value: data.walletNumber },
      { key: "CARD_CALLBACK_URL", value: data.callbackUrl },
    ]

    await prisma.$transaction(
      entries.map(e => prisma.config.upsert({
        where: { key: e.key },
        update: { value: e.value },
        create: { key: e.key, value: e.value }
      }))
    )

    revalidatePath("/admin/settings/napgame")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// ===================== AGENT BALANCE =====================

export async function checkAgentBalance() {
  try {
    const { getAgentBalance } = await import("@/lib/services/card-gateway")
    const result = await getAgentBalance()
    return { success: true, balance: result.balance }
  } catch (error) {
    return { success: false, error: (error as Error).message, balance: 0 }
  }
}

// ===================== TOPUP ORDERS =====================

export async function getTopupOrders(limit: number = 50) {
  return prisma.topupOrder.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
      user: { select: { name: true, email: true } }
    }
  })
}

