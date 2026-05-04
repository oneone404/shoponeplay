import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { processWithdrawalAction } from "@/lib/services/withdrawal"

export const dynamic = "force-dynamic"

export async function GET() {
  return new Response("Telegram Callback is active and public!")
}

export async function POST(req: Request) {
  console.log("[TELEGRAM_WEBHOOK] >>> REACHED ENDPOINT <<<")
  try {
    const body = await req.json()
    console.log("[TELEGRAM_WEBHOOK] Received body:", JSON.stringify(body, null, 2))

    // 1. Check if it's a callback_query (button click)
    if (!body.callback_query) {
      console.log("[TELEGRAM_WEBHOOK] No callback_query found, skipping.")
      return NextResponse.json({ ok: true })
    }

    const { id: callbackQueryId, data, from, message } = body.callback_query
    console.log(`[TELEGRAM_WEBHOOK] Action: ${data} from User: ${from.id} (${from.username})`)
    const chatId = message.chat.id
    const messageId = message.message_id

    // 2. Security Check: Only allow if from the configured Admin Telegram ID
    const adminConfig = await prisma.config.findUnique({
      where: { key: "TELEGRAM_ID" }
    })

    if (!adminConfig || String(from.id) !== adminConfig.value) {
      console.warn(`[TELEGRAM_WEBHOOK] Unauthorized click from ${from.id}`)
      return NextResponse.json({ ok: true })
    }

    // 3. Parse Action and Withdrawal ID
    // Format: wd_done_ID or wd_cancel_ID
    const parts = data.split("_")
    if (parts.length < 3) return NextResponse.json({ ok: true })

    const action = parts[1] // done or cancel
    const withdrawalId = parts.slice(2).join("_")

    // 4. Process the action
    let resultMessage = ""
    let success = false

    try {
      const result = await processWithdrawalAction({
        withdrawalId,
        action: action as "done" | "cancel",
        adminId: String(from.id),
        adminName: from.first_name || from.username || "Admin Tele"
      })
      resultMessage = result.message
      success = true
    } catch (err: any) {
      resultMessage = `⚠️ LỖI: ${err.message}`
    }

    // 5. Update the Telegram Message
    const tokenConfig = await prisma.config.findUnique({
      where: { key: "TELEGRAM_TOKEN" }
    })

    if (tokenConfig && success) {
      const originalCaption = message.caption || ""
      const newCaption = `${originalCaption}\n\n<b>───────────────</b>\n${resultMessage}\n👤 <b>ADMIN:</b> ${from.first_name || from.username}`

      // Edit message caption and remove buttons
      await fetch(`https://api.telegram.org/bot${tokenConfig.value}/editMessageCaption`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          caption: newCaption,
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: [] } // Remove buttons
        })
      })
    }

    // 6. Answer Callback Query (to remove loading state on Telegram)
    if (tokenConfig) {
      await fetch(`https://api.telegram.org/bot${tokenConfig.value}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text: success ? "Thao tác thành công!" : "Có lỗi xảy ra!"
        })
      })
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error("[TELEGRAM_WEBHOOK_ERROR]", error)
    return NextResponse.json({ ok: true }) // Always return OK to Telegram
  }
}
