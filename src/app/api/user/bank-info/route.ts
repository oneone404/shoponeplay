import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const banks = await prisma.bankInfo.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" }
    })
    return NextResponse.json(banks)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bank info" }, { status: 500 })
  }
}
