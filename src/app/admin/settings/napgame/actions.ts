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
