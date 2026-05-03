import { auth } from "@/auth"
import { deleteUploadFile, deleteUploadFiles } from "@/lib/file-utils"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || (session.user.role !== "SELLER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { 
      price, 
      oldPrice, 
      categoryId, 
      description, 
      images, 
      thumbnail,
      stats,
      playAccount,
      newSecrets
    } = body

    // Verify ownership
    const existingProduct = await prisma.product.findUnique({
      where: { 
        id: params.id,
        uploaderId: session.user.id
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm hoặc bạn không có quyền sửa" }, { status: 404 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Product info
      const product = await tx.product.update({
        where: { id: params.id },
        data: {
          price,
          oldPrice,
          categoryId,
          description: description?.filter((d: string) => d.trim().length > 0),
          images: images?.filter((img: string) => img.trim().length > 0),
          thumbnail,
          stats: stats || {},
        }
      })

      // 2. Update Play Account if applicable
      if (existingProduct.type === "PLAY" && playAccount) {
        // Play products usually have 1 secret
        const secret = await tx.accountSecret.findFirst({
          where: { productId: params.id }
        })

        if (secret) {
          await tx.accountSecret.update({
            where: { id: secret.id },
            data: {
              username: playAccount.username,
              password: playAccount.password,
              accountId: playAccount.accountId,
              extraInfo: playAccount.extraInfo,
            }
          })
        }
      }

      // 3. Add new Random secrets if applicable
      if (existingProduct.type === "RANDOM" && newSecrets && newSecrets.length > 0) {
        await tx.accountSecret.createMany({
          data: newSecrets.map((s: any) => ({
            productId: params.id,
            username: s.username,
            password: s.password,
            accountId: s.accountId || null,
            extraInfo: s.extraInfo || null,
            uploaderId: session.user.id,
          }))
        })

        // Update stock count
        const newCount = await tx.accountSecret.count({
          where: { productId: params.id, isSold: false }
        })
        
        await tx.product.update({
          where: { id: params.id },
          data: { stock: newCount }
        })
      }

      return product
    })

    // 4. File cleanup for updated images
    if (thumbnail && existingProduct.thumbnail && thumbnail !== existingProduct.thumbnail) {
      await deleteUploadFile(existingProduct.thumbnail)
    }

    if (images && existingProduct.images && Array.isArray(existingProduct.images)) {
      const removedImages = (existingProduct.images as string[]).filter(oldImg => !images.includes(oldImg))
      await deleteUploadFiles(removedImages)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[SELLER_PRODUCT_PATCH]", error)
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || (session.user.role !== "SELLER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { 
        id: params.id,
        uploaderId: session.user.id
      }
    })

    if (!product) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm hoặc bạn không có quyền xóa" }, { status: 404 })
    }

    // Delete product
    await prisma.product.delete({
      where: { id: params.id }
    })

    // File cleanup (Thumbnail and Detail images)
    if (product.thumbnail) await deleteUploadFile(product.thumbnail)
    if (product.images && Array.isArray(product.images)) {
      await deleteUploadFiles(product.images)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[SELLER_PRODUCT_DELETE]", error)
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 })
  }
}
