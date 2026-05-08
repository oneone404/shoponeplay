import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * API Webhook for Automated Bank Deposits (Pay2S Compatible)
 * 
 * Pay2S sends a POST request with:
 * Header: Authorization: Bearer <TOKEN>
 * Body: { "transactions": [ { id, gateway, transferAmount, content, ... }, ... ] }
 */
export async function POST(req: Request) {
  try {
    // 1. Get Security Token from Config
    const tokenConfig = await prisma.config.findUnique({
      where: { key: "PAY2S_TOKEN" }
    })
    const secretKey = tokenConfig?.value

    // 2. Verify Authorization Header (if token is configured)
    if (secretKey) {
      const authHeader = req.headers.get("authorization") || ""
      const token = authHeader.replace("Bearer ", "")
      if (token !== secretKey) {
        console.error("[BANK WEBHOOK] Unauthorized: Invalid Token")
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
      }
    }

    const body = await req.json()
    const { transactions } = body

    // Support both single object (old) and array (Pay2S)
    const txArray = Array.isArray(transactions)
      ? transactions
      : (body.amount ? [body] : [])

    if (txArray.length === 0) {
      return NextResponse.json({ error: "No transactions found" }, { status: 400 })
    }

    // 3. Get Syntax Config
    const configs = await prisma.config.findMany({
      where: {
        key: { in: ["DEPOSIT_PREFIX", "DEPOSIT_SUFFIX"] }
      }
    })
    const configMap = new Map(configs.map(c => [c.key, c.value]))
    const prefix = configMap.get("DEPOSIT_PREFIX") ?? ""
    const suffix = configMap.get("DEPOSIT_SUFFIX") ?? ""

    const processedIds = []

    // 4. Process each transaction
    for (const tx of txArray) {
      // Normalize fields (Pay2S vs standard)
      const id = String(tx.id || tx.transaction_id || "")
      let amount = parseFloat(tx.transferAmount || tx.amount || 0)

      // ROUND DOWN TO NEAREST 1000 (e.g., 19500 -> 19000, 19900 -> 19000)
      amount = Math.floor(amount / 1000) * 1000

      const content = tx.content || tx.description || ""
      const gateway = tx.gateway || tx.bank_name || "BANK"

      if (!id || amount <= 0 || !content) continue

      // Extract User Identifier
      const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

      let regex: RegExp
      if (suffix) {
        regex = new RegExp(`${escapedPrefix}\\s*([A-Z0-9]+)\\s*${escapedSuffix}`, "i")
      } else {
        regex = new RegExp(`${escapedPrefix}\\s*([A-Z0-9]+)`, "i")
      }

      const match = content.match(regex)
      if (!match) {
        console.log(`[BANK WEBHOOK] No match for transaction ${id} in content: ${content}`)
        continue
      }

      const identifier = match[1].toLowerCase()

      // Find User
      const user = await prisma.user.findFirst({
        where: { id: { endsWith: identifier } }
      })

      if (!user) {
        console.log(`[BANK WEBHOOK] User not found for identifier: ${identifier}`)
        continue
      }

      // Check for duplicate transaction
      const existingDeposit = await prisma.bankDeposit.findUnique({
        where: { transactionId: id }
      })

      if (existingDeposit) {
        console.log(`[BANK WEBHOOK] Duplicate transaction skipped: ${id}`)
        continue
      }

      // Process Deposit
      await prisma.$transaction(async (dbTx) => {
        const bankDeposit = await dbTx.bankDeposit.create({
          data: {
            userId: user.id,
            amount: amount,
            bankName: gateway,
            transactionId: id,
            description: content,
            status: "COMPLETED"
          }
        })

        await dbTx.user.update({
          where: { id: user.id },
          data: {
            balance: { increment: amount },
            totalDeposited: { increment: amount }
          }
        })

        await dbTx.transaction.create({
          data: {
            userId: user.id,
            amount: amount,
            balanceBefore: user.balance,
            balanceAfter: user.balance + amount,
            type: "DEPOSIT",
            description: `Nạp Tự Động Qua Bank (ID: ${id})`,
            bankDepositId: bankDeposit.id
          }
        })

        await dbTx.userActivity.create({
          data: {
            userId: user.id,
            type: "BANK_DEPOSIT_AUTO",
            details: `Nạp Thành Công ${amount.toLocaleString()} VND Qua Bank (Mã GD: ${id})`
          }
        })
      })

      processedIds.push(id)
    }

    revalidatePath("/")
    return NextResponse.json({ success: true, processed: processedIds })

  } catch (error) {
    console.error("[BANK WEBHOOK ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
