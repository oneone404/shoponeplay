import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check for a completed deposit in the last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

    const latestDeposit = await prisma.bankDeposit.findFirst({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        createdAt: {
          gte: fifteenMinutesAgo
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ 
      confirmed: !!latestDeposit,
      deposit: latestDeposit 
    })

  } catch (error) {
    console.error("[DEPOSIT_CHECK_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
