import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET: Lấy danh sách IP bị ban
export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bannedIPs = await prisma.bannedIP.findMany({
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(bannedIPs)
  } catch (error) {
    console.error("[BANNED IP ERROR]", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

// POST: Ban một IP thủ công
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ip, reason, permanent } = await req.json()

    if (!ip) {
      return NextResponse.json({ error: "IP is required" }, { status: 400 })
    }

    const banned = await prisma.bannedIP.upsert({
      where: { ip },
      update: {
        reason: reason || "Manual Ban by Admin",
        expiresAt: permanent ? null : new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      create: {
        ip,
        reason: reason || "Manual Ban by Admin",
        expiresAt: permanent ? null : new Date(Date.now() + 24 * 60 * 60 * 1000),
      }
    })

    return NextResponse.json({ success: true, banned })
  } catch (error) {
    console.error("[BAN IP ERROR]", error)
    return NextResponse.json({ error: "Failed to ban IP" }, { status: 500 })
  }
}

// DELETE: Gỡ ban một IP
export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ip } = await req.json()

    await prisma.bannedIP.delete({
      where: { ip }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[UNBAN IP ERROR]", error)
    return NextResponse.json({ error: "Failed to unban IP" }, { status: 500 })
  }
}
