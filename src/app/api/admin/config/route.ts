import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const keys = searchParams.get("keys")?.split(",") || []

    if (keys.length === 0) {
      const allConfig = await prisma.config.findMany()
      const result = allConfig.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})
      return NextResponse.json(result)
    }

    const configs = await prisma.config.findMany({
      where: { key: { in: keys } }
    })

    const result = configs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})
    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const operations = Object.entries(body).map(([key, value]) => {
      return prisma.config.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    })

    await prisma.$transaction(operations)

    // --- AUTO WEBHOOK REGISTRATION ---
    if (body.TELEGRAM_ENABLED === "true" && body.TELEGRAM_TOKEN) {
      const host = req.headers.get("host")
      // Force HTTPS if not localhost, as Cloudflare/Production usually uses it
      const protocol = (host?.includes("localhost") || host?.includes("127.0.0.1")) ? "http" : "https"
      
      if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
        const webhookUrl = `${protocol}://${host}/api/webhooks/telegram`
        const setWebhookUrl = `https://api.telegram.org/bot${body.TELEGRAM_TOKEN}/setWebhook?url=${webhookUrl}&allowed_updates=["message","callback_query"]`
        
        console.log(`[TELEGRAM_INIT] Attempting to set webhook to: ${webhookUrl}`)
        
        fetch(setWebhookUrl)
          .then(res => res.json())
          .then(data => {
            if (data.ok) {
              console.log("[TELEGRAM_INIT] Webhook set successfully:", data.description)
            } else {
              console.error("[TELEGRAM_INIT] Failed to set webhook:", data.description)
            }
          })
          .catch(err => console.error("[TELEGRAM_INIT_ERROR]", err))
      }
    }
    // ---------------------------------

    return NextResponse.json({ message: "Success" })

  } catch (error) {
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 })
  }
}
