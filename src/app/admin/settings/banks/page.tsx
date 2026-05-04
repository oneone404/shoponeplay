import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminBanksClient from "@/components/admin/settings/AdminBanksClient"

export default async function AdminBanksPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const [banks, configs] = await Promise.all([
    prisma.bankInfo.findMany({
      orderBy: { createdAt: "desc" }
    }),
    prisma.config.findMany({
      where: {
        key: { in: ["DEPOSIT_PREFIX", "DEPOSIT_SUFFIX", "DEPOSIT_MIN_AMOUNT", "PAY2S_TOKEN"] }
      }
    })
  ])

  const configMap = new Map(configs.map(c => [c.key, c.value]))
  const depositPrefix = configMap.get("DEPOSIT_PREFIX") ?? "SOP"
  const depositSuffix = configMap.get("DEPOSIT_SUFFIX") ?? ""
  const pay2sToken = configMap.get("PAY2S_TOKEN") ?? ""
  const depositMinAmount = Number(configMap.get("DEPOSIT_MIN_AMOUNT") ?? "10000")

  // Serialize data
  const serializedBanks = JSON.parse(JSON.stringify(banks))

  return (
    <AdminBanksClient 
      initialBanks={serializedBanks} 
      initialPrefix={depositPrefix}
      initialSuffix={depositSuffix}
      initialPay2sToken={pay2sToken}
      initialMinAmount={depositMinAmount}
    />
  )
}
