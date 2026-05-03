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
    const { name, slug, image, groupId } = body

    if (!name || !slug || !groupId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image,
        groupId,
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("[CATEGORY_CREATE]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
