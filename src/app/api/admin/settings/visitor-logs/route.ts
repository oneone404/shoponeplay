import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Tự động dọn dẹp: Xóa các log cũ hơn 3 ngày để tiết kiệm dung lượng
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    
    await prisma.visitorLog.deleteMany({
      where: {
        createdAt: { lt: threeDaysAgo }
      }
    })

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = 10
    const skip = (page - 1) * limit

    const [logs, total] = await Promise.all([
      prisma.visitorLog.findMany({
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" }
      }),
      prisma.visitorLog.count()
    ])

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("[FETCH VISITOR LOGS ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Xóa sạch toàn bộ nhật ký truy cập
    await prisma.visitorLog.deleteMany({})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE VISITOR LOGS ERROR]", error)
    return NextResponse.json({ error: "Failed to clear logs" }, { status: 500 })
  }
}
