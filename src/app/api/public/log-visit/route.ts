import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { path, userAgent, method } = await req.json()
    
    const forwarded = req.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1"

    // Log the visit with a fallback for method
    await prisma.visitorLog.create({
      data: {
        ip,
        userAgent: userAgent || "Unknown",
        path: path || "/",
        method: method || "GET"
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[VISIT LOG ERROR]", error)
    return NextResponse.json({ error: "Failed to log visit" }, { status: 500 })
  }
}
