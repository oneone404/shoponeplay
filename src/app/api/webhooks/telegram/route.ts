import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import os from "os"
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

    // 1. Check if it's a message (Admin Reply)
    if (body.message) {
      const msg = body.message
      const fromId = String(msg.from.id)
      console.log(`[TELEGRAM_WEBHOOK] Incoming message from ${fromId}`)
      
      // Security Check
      const adminConfig = await prisma.config.findUnique({ where: { key: "TELEGRAM_ID" } })
      console.log(`[TELEGRAM_WEBHOOK] Admin ID Config: ${adminConfig?.value}`)
      
      if (!adminConfig || fromId !== adminConfig.value) {
        console.log("[TELEGRAM_WEBHOOK] Not authorized or not Admin ID.")
        return NextResponse.json({ ok: true })
      }

      // NEW: Handle /GIFTCODE
      if (msg.text && msg.text.includes("/GIFTCODE")) {
        console.log("[TELEGRAM_WEBHOOK] Detected /GIFTCODE command.")
        const lines = msg.text.split("\n")
        let addedCount = 0
        const codesToProcess: string[] = []

        for (const line of lines) {
          if (line.includes("/GIFTCODE")) {
            const code = line.replace("/GIFTCODE", "").trim().toUpperCase()
            if (code) codesToProcess.push(code)
          }
        }

        if (codesToProcess.length > 0) {
          const botTokenConfig = await prisma.config.findUnique({ where: { key: "TELEGRAM_TOKEN" } })
          for (const code of codesToProcess) {
            try {
              await prisma.globalGiftcode.upsert({
                where: { code },
                update: { isActive: true },
                create: { code, gameCode: "661" }
              })
              addedCount++
            } catch (e) {
              console.error(`[TELEGRAM_WEBHOOK] Failed to add code ${code}:`, e)
            }
          }

          if (botTokenConfig && addedCount > 0) {
            await fetch(`https://api.telegram.org/bot${botTokenConfig.value}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: msg.chat.id,
                text: `🎁 Đã thêm <b>${addedCount}</b> Giftcode mới vào kho.\n\n${codesToProcess.map(c => `• <code>${c}</code>`).join("\n")}\n\n<i>Nhắn <code>/RUNCODE</code> để bắt đầu nhập cho khách.</i>`,
                parse_mode: "HTML",
                reply_to_message_id: msg.message_id
              })
            })
          }
        }
        return NextResponse.json({ ok: true })
      }

      // NEW: Handle /LISTCODE
      if (msg.text && msg.text.startsWith("/LISTCODE")) {
        const activeCodes = await prisma.globalGiftcode.findMany({ where: { isActive: true } })
        const botTokenConfig = await prisma.config.findUnique({ where: { key: "TELEGRAM_TOKEN" } })
        if (botTokenConfig) {
          const text = activeCodes.length > 0 
            ? `📋 <b>Danh sách Code đang Active:</b>\n\n${activeCodes.map(c => `• <code>${c.code}</code>`).join("\n")}`
            : "📭 Hiện không có Code nào đang Active."
          
          await fetch(`https://api.telegram.org/bot${botTokenConfig.value}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: msg.chat.id, text, parse_mode: "HTML", reply_to_message_id: msg.message_id })
          })
        }
        return NextResponse.json({ ok: true })
      }

      // NEW: Handle /DELCODE
      if (msg.text && msg.text.startsWith("/DELCODE")) {
        const code = msg.text.replace("/DELCODE", "").trim().toUpperCase()
        if (code) {
          await prisma.globalGiftcode.updateMany({ where: { code }, data: { isActive: false } })
          const botTokenConfig = await prisma.config.findUnique({ where: { key: "TELEGRAM_TOKEN" } })
          if (botTokenConfig) {
            await fetch(`https://api.telegram.org/bot${botTokenConfig.value}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chat_id: msg.chat.id, text: `🗑 Đã vô hiệu hóa mã: <code>${code}</code>`, parse_mode: "HTML", reply_to_message_id: msg.message_id })
            })
          }
        }
        return NextResponse.json({ ok: true })
      }

      // NEW: Handle /CLEARCODE
      if (msg.text && msg.text === "/CLEARCODE") {
        await prisma.globalGiftcode.updateMany({ data: { isActive: false } })
        const botTokenConfig = await prisma.config.findUnique({ where: { key: "TELEGRAM_TOKEN" } })
        if (botTokenConfig) {
          await fetch(`https://api.telegram.org/bot${botTokenConfig.value}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: msg.chat.id, text: "🧹 Đã xóa (vô hiệu hóa) toàn bộ mã trong kho.", parse_mode: "HTML", reply_to_message_id: msg.message_id })
          })
        }
        return NextResponse.json({ ok: true })
      }

      // NEW: Handle /RUNCODE
      if (msg.text && msg.text === "/RUNCODE") {
        const botTokenConfig = await prisma.config.findUnique({ where: { key: "TELEGRAM_TOKEN" } })
        if (botTokenConfig) {
          // Trigger global sweep in background
          import("@/lib/services/giftcode-processor").then(m => {
            m.triggerAutoRedeem();
          }).catch(err => console.error("[TELEGRAM_WEBHOOK] RUNCODE trigger failed:", err));

          await fetch(`https://api.telegram.org/bot${botTokenConfig.value}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              chat_id: msg.chat.id, 
              text: "🚀 Đang bắt đầu quét và nhập toàn bộ Code Active cho khách hàng...", 
              parse_mode: "HTML", 
              reply_to_message_id: msg.message_id 
            })
          })
        }
        return NextResponse.json({ ok: true })
      }

      // NEW: Handle /STATUS
      if (msg.text && msg.text === "/STATUS") {
        const botTokenConfig = await prisma.config.findUnique({ where: { key: "TELEGRAM_TOKEN" } })
        if (botTokenConfig) {
          const [userCount, activeCodes, totalOrders, todayOrders, maintenance] = await Promise.all([
            prisma.user.count(),
            prisma.globalGiftcode.count({ where: { isActive: true } }),
            prisma.order.count(),
            prisma.order.count({ 
              where: { 
                createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } 
              } 
            }),
            prisma.config.findUnique({ where: { key: "MAINTENANCE_MODE" } })
          ])

          // System Info
          const totalMem = os.totalmem();
          const freeMem = os.freemem();
          const usedMem = totalMem - freeMem;
          const memUsage = ((usedMem / totalMem) * 100).toFixed(1);
          const uptimeSec = os.uptime();
          const days = Math.floor(uptimeSec / (3600 * 24));
          const hours = Math.floor((uptimeSec % (3600 * 24)) / 3600);
          const minutes = Math.floor((uptimeSec % 3600) / 60);
          const uptimeText = `${days} ngày, ${hours} giờ, ${minutes} phút`;
          const loadAvg = os.loadavg()[0].toFixed(2);

          const statusText = `
📊 <b>THỐNG KÊ HỆ THỐNG SHOPONEPLAY</b>

👥 <b>Khách hàng:</b> <code>${userCount}</code>
🎁 <b>Giftcode Active:</b> <code>${activeCodes}</code>
📦 <b>Tổng đơn hàng:</b> <code>${totalOrders}</code>
📅 <b>Đơn hôm nay:</b> <code>${todayOrders}</code>
🚧 <b>Bảo trì:</b> <code>${maintenance?.value === "true" ? "ĐANG BẬT 🔴" : "ĐANG TẮT 🟢"}</code>

🖥 <b>SỨC KHỎE SERVER:</b>
• <b>CPU Load:</b> <code>${loadAvg}</code>
• <b>RAM Usage:</b> <code>${(usedMem / 1024 / 1024 / 1024).toFixed(1)}GB / ${(totalMem / 1024 / 1024 / 1024).toFixed(1)}GB (${memUsage}%)</code>
• <b>Uptime:</b> <code>${uptimeText}</code>
• <b>OS:</b> <code>${os.platform()} (${os.arch()})</code>

<i>Cập nhật lúc: ${new Date().toLocaleString("vi-VN")}</i>
          `
          await fetch(`https://api.telegram.org/bot${botTokenConfig.value}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: msg.chat.id, text: statusText, parse_mode: "HTML", reply_to_message_id: msg.message_id })
          })
        }
        return NextResponse.json({ ok: true })
      }

      // NEW: Handle /MAINTAIN ON/OFF
      if (msg.text && msg.text.toUpperCase().startsWith("/MAINTAIN")) {
        const action = msg.text.toUpperCase().replace("/MAINTAIN", "").trim();
        const botTokenConfig = await prisma.config.findUnique({ where: { key: "TELEGRAM_TOKEN" } })
        
        if (action === "ON" || action === "OFF") {
          const isMaintenance = action === "ON";
          await prisma.config.upsert({
            where: { key: "MAINTENANCE_MODE" },
            update: { value: String(isMaintenance) },
            create: { key: "MAINTENANCE_MODE", value: String(isMaintenance) }
          });

          if (botTokenConfig) {
            await fetch(`https://api.telegram.org/bot${botTokenConfig.value}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                chat_id: msg.chat.id, 
                text: isMaintenance ? "🚧 <b>Đã BẬT chế độ bảo trì.</b> Khách hàng sẽ thấy màn hình chờ." : "✅ <b>Đã TẮT chế độ bảo trì.</b> Website hoạt động bình thường.", 
                parse_mode: "HTML", 
                reply_to_message_id: msg.message_id 
              })
            })
          }
        }
        return NextResponse.json({ ok: true })
      }

      // NEW: Handle /MENU
      if (msg.text && msg.text.startsWith("/MENU")) {
        const botTokenConfig = await prisma.config.findUnique({ where: { key: "TELEGRAM_TOKEN" } })
        if (botTokenConfig) {
          const helpText = `
🛠 <b>MENU QUẢN TRỊ SHOPONEPLAY</b>

🎁 <b>QUẢN LÝ GIFTCODE:</b>
• <code>/GIFTCODE [Mã]</code> : Chỉ thêm mã vào kho (Active).
• <code>/RUNCODE</code> : Kích hoạt nhập toàn bộ Code Active cho khách.
• <code>/LISTCODE</code> : Xem danh sách các mã đang Active.
• <code>/DELCODE [Mã]</code> : Vô hiệu hóa một mã cụ thể.
• <code>/CLEARCODE</code> : Vô hiệu hóa toàn bộ mã trong kho.

🛠 <b>HỆ THỐNG:</b>
• <code>/STATUS</code> : Xem thống kê nhanh của hệ thống.
• <code>/MAINTAIN [ON/OFF]</code> : Bật hoặc Tắt chế độ bảo trì Website.

📦 <b>QUẢN LÝ ĐƠN HÀNG:</b>
• <b>Reply (Trả lời)</b> tin nhắn thông báo đơn hàng kèm nội dung để thêm Ghi chú cho khách hàng.

<i>Lưu ý: Các lệnh bắt buộc phải viết HOA mới có hiệu lực.</i>
          `
          await fetch(`https://api.telegram.org/bot${botTokenConfig.value}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: msg.chat.id, text: helpText, parse_mode: "HTML", reply_to_message_id: msg.message_id })
          })
        }
        return NextResponse.json({ ok: true })
      }

      // Check if it's a reply to a bot message
      if (msg.reply_to_message && msg.reply_to_message.from.is_bot) {
        console.log("[TELEGRAM_WEBHOOK] Detected reply to bot message.")
        const parentText = msg.reply_to_message.caption || msg.reply_to_message.text || ""
        console.log("[TELEGRAM_WEBHOOK] Parent message text:", parentText)
        
        // Regex hon hop de bat ca #ID: hoac #ID :
        const idMatch = parentText.match(/#ID:? ?([a-z0-9]+)/i)
        console.log("[TELEGRAM_WEBHOOK] ID Match result:", idMatch?.[1])
        
        if (idMatch && idMatch[1]) {
          const orderId = idMatch[1].trim()
          const newNoteText = msg.text
          const botTokenConfig = await prisma.config.findUnique({ where: { key: "TELEGRAM_TOKEN" } })

          if (botTokenConfig && newNoteText) {
            console.log(`[TELEGRAM_WEBHOOK] Attempting to append note to order ${orderId}: ${newNoteText}`)
            const newNote = { text: newNoteText, time: new Date().toISOString() }
            let updated = false
            
            try {
              // Try TopupOrder
              const topup = await prisma.topupOrder.findUnique({ where: { id: orderId }, select: { adminNote: true } })
              if (topup) {
                const currentNotes = Array.isArray(topup.adminNote) ? topup.adminNote : []
                await prisma.topupOrder.update({
                  where: { id: orderId },
                  data: { adminNote: [...currentNotes, newNote] }
                })
                updated = true
                console.log("[TELEGRAM_WEBHOOK] TopupOrder note appended.")
              } else {
                // Try ServiceOrder
                const service = await prisma.serviceOrder.findUnique({ where: { id: orderId }, select: { adminNote: true } })
                if (service) {
                  const currentNotes = Array.isArray(service.adminNote) ? service.adminNote : []
                  await prisma.serviceOrder.update({
                    where: { id: orderId },
                    data: { adminNote: [...currentNotes, newNote] }
                  })
                  updated = true
                  console.log("[TELEGRAM_WEBHOOK] ServiceOrder note appended.")
                }
              }
            } catch (e: any) {
              console.log("[TELEGRAM_WEBHOOK] Update failed:", e.message)
            }

            if (updated) {
              await fetch(`https://api.telegram.org/bot${botTokenConfig.value}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: msg.chat.id,
                  text: `✅ Đã lưu tin nhắn mới cho đơn <code>${orderId}</code>.`,
                  parse_mode: "HTML",
                  reply_to_message_id: msg.message_id
                })
              })
            }
          }
        }
      }
      return NextResponse.json({ ok: true })
    }

    // 2. Check if it's a callback_query (button click)
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

    const parts = data.split("_")
    if (parts.length < 3) return NextResponse.json({ ok: true })

    const prefix = parts[0] // wd or topqr
    const action = parts[1] // done, cancel, retry...
    const entityId = parts.slice(2).join("_")

    let resultMessage = ""
    let success = false

    if (prefix === "wd") {
      // Logic rut tien
      try {
        const result = await processWithdrawalAction({
          withdrawalId: entityId,
          action: action as "done" | "cancel",
          adminId: String(from.id),
          adminName: from.first_name || from.username || "Admin Tele"
        })
        resultMessage = result.message
        success = true
      } catch (err: any) {
        resultMessage = `⚠️ LỖI: ${err.message}`
      }
    } else if (prefix === "topqr") {
      // Logic nap Manual QR
      try {
        const { processTopupQRAction } = await import("@/lib/services/topup-processor")
        const result = await processTopupQRAction({
          orderId: entityId,
          action: action as "done" | "retry",
          adminId: String(from.id),
          adminName: from.first_name || from.username || "Admin Tele"
        })
        resultMessage = result.message
        success = true
      } catch (err: any) {
        resultMessage = `⚠️ LỖI: ${err.message}`
      }
    }

    // 5. Update the Telegram Message
    const tokenConfig = await prisma.config.findUnique({
      where: { key: "TELEGRAM_TOKEN" }
    })

    if (tokenConfig) {
      const botToken = tokenConfig.value
      
      // Helper goi Telegram API co retry de tranh loi timeout mang
      const callTelegram = async (method: string, payload: any, retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
              signal: AbortSignal.timeout(10000) // 10s timeout
            })
            if (res.ok) return true
            console.warn(`[TELEGRAM_API] ${method} failed with status ${res.status}`)
          } catch (err: any) {
            console.error(`[TELEGRAM_API] ${method} attempt ${i + 1} failed:`, err.message)
            if (i === retries - 1) throw err
            await new Promise(r => setTimeout(r, 1000 * (i + 1))) // Backoff
          }
        }
        return false
      }

      if (success) {
        if (prefix === "topqr" && action === "retry") {
          // Delete the old message when retrying QR
          await callTelegram("deleteMessage", {
            chat_id: chatId,
            message_id: messageId
          }).catch(() => null)
        } else {
          const originalCaption = message.caption || ""
          const newCaption = `${originalCaption}\n\n<b>───────────────</b>\n${resultMessage}\n👤 <b>ADMIN:</b> ${from.first_name || from.username}`

          // Edit message caption and remove buttons
          await callTelegram("editMessageCaption", {
            chat_id: chatId,
            message_id: messageId,
            caption: newCaption,
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: [] } // Remove buttons
          }).catch(err => console.error("[TELEGRAM_WEBHOOK] editMessageCaption failed final:", err.message))
        }
      }

      // 6. Answer Callback Query (to remove loading state on Telegram)
      await callTelegram("answerCallbackQuery", {
        callback_query_id: callbackQueryId,
        text: success ? "Thao tác thành công!" : (resultMessage || "Có lỗi xảy ra!")
      }).catch(() => null)
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error("[TELEGRAM_WEBHOOK_ERROR]", error)
    return NextResponse.json({ ok: true }) // Always return OK to Telegram
  }
}
