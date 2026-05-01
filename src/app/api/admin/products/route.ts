import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { 
      title, 
      price, 
      oldPrice, 
      type, 
      categoryId, 
      description, 
      images, 
      thumbnail,
      secrets 
    } = body

    if (!title || !price || !categoryId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Tạo Product và Secrets trong 1 transaction
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title,
          price,
          oldPrice,
          type,
          categoryId,
          description: description.filter((d: string) => d.trim().length > 0),
          images: images.filter((img: string) => img.trim().length > 0),
          thumbnail,
          stock: secrets.length, // Cập nhật số lượng kho ban đầu
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
          }))
        })
      }

      return product
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[PRODUCT_CREATE]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
