"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { sendTelegramNotification } from "@/lib/telegram"

export async function createWithdrawal(data: {
  amount: number
  bankName: string
  accountNumber: string
  accountName: string
}) {
  const session = await auth()
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"
  const userAgent = headersList.get("user-agent") || "Unknown"

  if (!session?.user?.id) {
    return { success: false, message: "Bạn cần đăng nhập để thực hiện" }
  }

  const userId = session.user.id
  const { amount, bankName, accountNumber, accountName } = data

  // 1. Validate amount
  if (amount < 50000) {
    return { success: false, message: "Số tiền rút tối thiểu là 50.000 VND" }
  }

  // 2. Start transaction
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Check current balance
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { balance: true }
      })

      if (!user || user.balance < amount) {
        throw new Error("Số dư không đủ")
      }

      // Deduct balance immediately (freeze)
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } }
      })

      // Create withdrawal record
      const withdrawal = await tx.withdrawal.create({
        data: {
          userId,
          amount,
          bankName,
          accountNumber,
          accountName,
          status: "PENDING"
        }
      })

      // Create transaction record (Ledger)
      await tx.transaction.create({
        data: {
          userId,
          amount: -amount, // Negative for withdrawal
          balanceBefore: user.balance,
          balanceAfter: user.balance - amount,
          type: "WITHDRAW",
          description: `Thanh Toán #${bankName} (${accountNumber})`
        }
      })

      // Add user activity
      await tx.userActivity.create({
        data: {
          userId,
          type: "WITHDRAW_REQUEST",
          details: `Yêu Cầu Thanh Toán ${amount.toLocaleString()} VND - ${bankName}`,
          ip,
          userAgent
        }
      })

      return withdrawal
    })

    revalidatePath("/seller/withdraw")
    revalidatePath("/seller") // Update dashboard balance

    // 3. Send Telegram Notification (Await to ensure it sends)
    try {
      await sendTelegramNotification({
        userId: userId,
        userName: session.user.name || "Unknown",
        amount: amount,
        bankName: bankName,
        accountNumber: accountNumber,
        accountName: accountName,
        createdAt: new Date(),
        withdrawalId: result.id,
      });
    } catch (err) {
      console.error("[TELEGRAM_NOTIFY_ERROR]", err);
    }

    return {
      success: true,
      message: "Yêu cầu rút tiền đã được gửi thành công. Vui lòng chờ Admin xử lý."
    }

  } catch (error: any) {
    console.error("Withdrawal error:", error)
    return {
      success: false,
      message: error.message === "Số dư không đủ" ? "Số dư không đủ để thực hiện giao dịch" : "Đã có lỗi xảy ra, vui lòng thử lại sau"
    }
  }
}
