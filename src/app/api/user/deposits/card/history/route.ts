import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deposits = await prisma.cardDeposit.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10
    })

    return NextResponse.json({ deposits })
  } catch (error) {
    console.error("[CARD_HISTORY_GET_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
