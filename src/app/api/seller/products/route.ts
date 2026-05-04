import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || (session.user.role !== "SELLER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { 
      price, 
      oldPrice, 
      type, 
      categoryId, 
      description, 
      images, 
      thumbnail,
      secrets,
      stats 
    } = body

    if (!price || !categoryId || !type) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 })
    }

    // Transaction to create product and its secrets
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          price,
          oldPrice,
          type,
          category: { connect: { id: categoryId } },
          uploader: { connect: { id: session.user.id } },
          description: description.filter((d: string) => d.trim().length > 0),
          images: images.filter((img: string) => img.trim().length > 0),
          thumbnail,
          stats: stats || {},
          stock: secrets?.length || 0,
        }
      })

      if (secrets && secrets.length > 0) {
        await tx.accountSecret.createMany({
          data: secrets.map((s: any) => ({
            productId: product.id,
            username: s.username,
            password: s.password,
            accountId: s.accountId || null,
            extraInfo: s.extraInfo || null,
            uploaderId: session.user.id,
          }))
        })
      }

      return product
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[SELLER_PRODUCT_CREATE]", error)
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 })
  }
}
