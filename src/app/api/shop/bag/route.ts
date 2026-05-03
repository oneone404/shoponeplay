import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET: Lấy danh sách sản phẩm trong giỏ hàng
export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Format lại data để frontend dễ dùng
    const formattedItems = cartItems.map((item) => ({
      id: item.product.id,
      cartItemId: item.id,
      title: item.product.category.name,
      price: item.product.price,
      thumbnail: item.product.thumbnail || item.product.images[0],
      type: item.product.type,
      categoryName: item.product.category.name,
      selected: item.selected,
      sold: item.product.sold,
      quantity: item.quantity,
      stock: item.product.stock,
      description: item.product.description
    }))

    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST: Thêm sản phẩm vào giỏ hàng
export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { productId, quantity = 1 } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: "Mã sản phẩm không hợp lệ" }, { status: 400 })
    }

    // Lấy thông tin sản phẩm để check loại và stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 })
    }

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId
        }
      }
    })

    if (existing) {
      // Nếu là loại RANDOM thì tăng số lượng
      if (product.type === "RANDOM") {
        const newQty = existing.quantity + quantity
        if (newQty <= product.stock) {
          const updated = await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: newQty }
          })
          return NextResponse.json({ message: `Đã thêm ${quantity} acc vào giỏ hàng`, item: updated })
        } else {
          return NextResponse.json({ 
            message: `Chỉ còn ${product.stock} tài khoản. Bạn đã có ${existing.quantity} trong giỏ.`, 
            type: "limit" 
          })
        }
      }
      return NextResponse.json({ message: "Sản phẩm đã có trong giỏ hàng" })
    }

    const newItem = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId: productId,
        quantity: quantity
      }
    })

    return NextResponse.json({ message: product.type === "RANDOM" ? `Đã thêm ${quantity} acc vào giỏ hàng` : "Đã thêm vào giỏ hàng!", item: newItem })
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE: Xóa sản phẩm khỏi giỏ hàng
export async function DELETE(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Mã sản phẩm không hợp lệ" }, { status: 400 })
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Lỗi khi xóa khỏi giỏ hàng:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// PATCH: Cập nhật trạng thái lựa chọn (selected) và số lượng (quantity)
export async function PATCH(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { productId, productIds, selected, quantity, all } = await req.json()

    if (all !== undefined) {
      // Cập nhật tất cả items của user (chỉ support selected)
      await prisma.cartItem.updateMany({
        where: { userId: session.user.id },
        data: { selected: !!all }
      })
      return NextResponse.json({ success: true })
    }

    if (productIds !== undefined && selected !== undefined) {
      // Cập nhật hàng loạt selected cho danh sách IDs
      await prisma.cartItem.updateMany({
        where: {
          userId: session.user.id,
          productId: { in: productIds }
        },
        data: { selected: !!selected }
      })
      return NextResponse.json({ success: true })
    }

    if (!productId) {
      return NextResponse.json({ error: "Mã sản phẩm không hợp lệ" }, { status: 400 })
    }

    const data: any = {}
    if (selected !== undefined) data.selected = !!selected
    
    if (quantity !== undefined) {
      // Kiểm tra stock trước khi update
      const cartItem = await prisma.cartItem.findUnique({
        where: { userId_productId: { userId: session.user.id, productId } },
        include: { product: true }
      })
      
      if (cartItem && quantity > cartItem.product.stock) {
        return NextResponse.json({ error: "Số lượng vượt quá tồn kho" }, { status: 400 })
      }
      
      if (quantity < 1) {
        return NextResponse.json({ error: "Số lượng tối thiểu là 1" }, { status: 400 })
      }
      
      data.quantity = quantity
    }

    await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId
        }
      },
      data
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
