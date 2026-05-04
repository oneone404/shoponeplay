import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SELLER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")
  const page = Math.max(1, Number(searchParams.get("page") || 1))
  const limit = Math.max(1, Math.min(Number(searchParams.get("limit") || 10), 100))
  const skip = (page - 1) * limit
  const search = searchParams.get("search") || ""

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 })
  }

  // Build where clause
  const where: any = {
    productId,
  }

  // If search provided
  if (search) {
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { password: { contains: search, mode: 'insensitive' } },
      { accountId: { contains: search, mode: 'insensitive' } },
    ]
  }

  // If SELLER, ensure ownership
  if (session.user.role === "SELLER") {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { uploaderId: true }
    })
    if (!product || product.uploaderId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  // Count total
  const total = await prisma.accountSecret.count({ where })

  const accounts = await prisma.accountSecret.findMany({
    where,
    select: {
      id: true,
      accountId: true,
      username: true,
      password: true,
      extraInfo: true,
      status: true,
      isSold: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  })

  return NextResponse.json({ 
    success: true,
    accounts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  })
}
