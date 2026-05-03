"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createWithdrawal(data: {
  amount: number
  bankName: string
  accountNumber: string
  accountName: string
}) {
  const session = await auth()

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

      // Add user activity
      await tx.userActivity.create({
        data: {
          userId,
          type: "WITHDRAW_REQUEST",
          details: `Yêu cầu rút ${amount.toLocaleString()} VND về ${bankName}`
        }
      })

      return withdrawal
    })

    revalidatePath("/seller/withdraw")
    revalidatePath("/seller") // Update dashboard balance

    // 3. Send Telegram Notification (Async, don't wait for it)
    import("@/lib/telegram").then(({ sendTelegramNotification }) => {
      sendTelegramNotification({
        userId: userId,
        userName: session.user.name || "Unknown",
        amount: amount,
        bankName: bankName,
        accountNumber: accountNumber,
        accountName: accountName,
        createdAt: new Date(),
        withdrawalId: result.id,
      });
    }).catch(err => console.error("[TELEGRAM_INIT_ERROR]", err));
    
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
