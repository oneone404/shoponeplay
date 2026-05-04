"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function getBanks() {
  return await prisma.bankInfo.findMany({
    orderBy: { createdAt: "desc" }
  })
}

export async function upsertBank(data: {
  id?: string
  bankName: string
  accountNumber: string
  accountName: string
  logo?: string | null
  isActive: boolean
}) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const { id, ...rest } = data

  if (id) {
    await prisma.bankInfo.update({
      where: { id },
      data: rest
    })
  } else {
    await prisma.bankInfo.create({
      data: rest
    })
  }

  revalidatePath("/admin/settings/banks")
  return { success: true }
}

export async function deleteBank(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.bankInfo.delete({
    where: { id }
  })

  revalidatePath("/admin/settings/banks")
  return { success: true }
}

export async function updateDepositConfig(prefix: string, minAmount: number, suffix: string = "", pay2sToken: string = "") {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.$transaction([
    prisma.config.upsert({
      where: { key: "DEPOSIT_PREFIX" },
      update: { value: prefix },
      create: { key: "DEPOSIT_PREFIX", value: prefix }
    }),
    prisma.config.upsert({
      where: { key: "DEPOSIT_SUFFIX" },
      update: { value: suffix },
      create: { key: "DEPOSIT_SUFFIX", value: suffix }
    }),
    prisma.config.upsert({
      where: { key: "DEPOSIT_MIN_AMOUNT" },
      update: { value: String(minAmount) },
      create: { key: "DEPOSIT_MIN_AMOUNT", value: String(minAmount) }
    }),
    prisma.config.upsert({
      where: { key: "PAY2S_TOKEN" },
      update: { value: pay2sToken },
      create: { key: "PAY2S_TOKEN", value: pay2sToken }
    })
  ])

  revalidatePath("/admin/settings/banks")
  return { success: true }
}
