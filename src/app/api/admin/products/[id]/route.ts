import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        secrets: true,
        category: true
      }
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("[PRODUCT_GET]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { 
      price, 
      oldPrice, 
      categoryId, 
      description,
      images, 
      thumbnail,
      playAccount,
      stats,
      newSecrets,
      isHidden // New field
    } = body

    // 1. Lấy thông tin sản phẩm cũ để so sánh ảnh
    const oldProduct = await prisma.product.findUnique({
      where: { id },
      select: { thumbnail: true, images: true, type: true, secrets: { take: 1 } }
    })

    if (!oldProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: {
          price: price !== undefined ? Number(price) : undefined,
          oldPrice: oldPrice !== undefined ? (oldPrice ? Number(oldPrice) : null) : undefined,
          categoryId: categoryId !== undefined ? categoryId : undefined,
          description: description ? description.filter((d: string) => d.trim().length > 0) : undefined,
          images: images ? images.filter((img: string) => img.trim().length > 0) : undefined,
          thumbnail: thumbnail !== undefined ? thumbnail : undefined,
          stats: stats !== undefined ? (stats || {}) : undefined,
          isHidden: isHidden !== undefined ? isHidden : undefined,
        }
      })

      if (oldProduct.type === "PLAY" && playAccount) {
        const secret = oldProduct.secrets[0]
        if (secret) {
          await tx.accountSecret.update({
            where: { id: secret.id },
            data: {
              username: playAccount.username,
              password: playAccount.password,
              accountId: playAccount.accountId || null,
              extraInfo: playAccount.extraInfo || null,
            }
          })
        }
      }

      if (oldProduct.type === "RANDOM" && newSecrets && newSecrets.length > 0) {
        await tx.accountSecret.createMany({
          data: newSecrets.map((s: any) => ({
            ...s,
            productId: id,
            status: "AVAILABLE"
          }))
        })
        
        // Cập nhật stock
        const currentCount = await tx.accountSecret.count({ where: { productId: id, status: "AVAILABLE" } })
        await tx.product.update({
          where: { id },
          data: { stock: currentCount }
        })
      }

      return product
    })

    // 2. Dọn dẹp ảnh cũ
    const { unlink } = await import("fs/promises")
    const path = await import("path")

    const deleteFile = async (url: string) => {
      try {
        if (url && url.startsWith("/uploads/")) {
          const filePath = path.join(process.cwd(), "public", url)
          await unlink(filePath)
        }
      } catch (e) {}
    }

    if (thumbnail && oldProduct.thumbnail && thumbnail !== oldProduct.thumbnail) {
      await deleteFile(oldProduct.thumbnail)
    }

    if (images && oldProduct.images && Array.isArray(oldProduct.images)) {
      const removedImages = (oldProduct.images as string[]).filter(oldImg => !images.includes(oldImg))
      await Promise.all(removedImages.map(img => deleteFile(img)))
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      select: { thumbnail: true, images: true }
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.accountSecret.deleteMany({ where: { productId: id } })
      await tx.product.delete({ where: { id } })
    })

    const { unlink } = await import("fs/promises")
    const path = await import("path")

    const deleteFile = async (url: string) => {
      try {
        if (url && url.startsWith("/uploads/")) {
          const filePath = path.join(process.cwd(), "public", url)
          await unlink(filePath)
        }
      } catch (e) {}
    }

    if (product.thumbnail) await deleteFile(product.thumbnail)
    if (product.images && Array.isArray(product.images)) {
      await Promise.all(product.images.map(img => deleteFile(img)))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
