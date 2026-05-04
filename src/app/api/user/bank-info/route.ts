import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [banks, configs] = await Promise.all([
      prisma.bankInfo.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" }
      }),
      prisma.config.findMany({
        where: {
          key: { in: ["DEPOSIT_PREFIX", "DEPOSIT_SUFFIX", "DEPOSIT_MIN_AMOUNT"] }
        }
      })
    ])

    const configMap = new Map(configs.map(c => [c.key, c.value]))
    const depositPrefix = configMap.get("DEPOSIT_PREFIX") ?? "SOP"
    const depositSuffix = configMap.get("DEPOSIT_SUFFIX") ?? ""
    const depositMinAmount = Number(configMap.get("DEPOSIT_MIN_AMOUNT") ?? "10000")
    
    return NextResponse.json({
      banks,
      config: {
        prefix: depositPrefix,
        suffix: depositSuffix,
        minAmount: depositMinAmount
      }
    })
  } catch (error) {
    console.error("Failed to fetch admin banks", error)
    return NextResponse.json([], { status: 500 })
  }
}
