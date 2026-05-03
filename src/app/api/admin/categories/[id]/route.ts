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
    const category = await prisma.category.findUnique({
      where: { id },
      include: { group: true }
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("[CATEGORY_GET]", error)
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
    const { name, slug, image, groupId } = body

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        image,
        groupId,
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error)
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

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: id }
    })

    if (productCount > 0) {
      return NextResponse.json({ error: "Cannot delete category with products" }, { status: 400 })
    }

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
