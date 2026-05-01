import { NextRequest, NextResponse } from "next/server"
import { AccountSecretStatus } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")
  const limit = Math.max(1, Math.min(Number(searchParams.get("limit") || 20), 100))

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 })
  }

  const secrets = await prisma.accountSecret.findMany({
    where: {
      productId,
      isSold: false,
      status: AccountSecretStatus.AVAILABLE,
    },
    select: {
      id: true,
      accountId: true,
      username: true,
      password: true,
      extraInfo: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  })

  return NextResponse.json({ secrets })
}
