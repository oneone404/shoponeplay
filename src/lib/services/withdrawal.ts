import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function processWithdrawalAction({
  withdrawalId,
  action,
  adminId,
  adminName
}: {
  withdrawalId: string
  action: "done" | "cancel"
  adminId: string
  adminName: string
}) {
  return await prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { user: true }
    })

    if (!withdrawal) throw new Error("Không tìm thấy yêu cầu")
    if (withdrawal.status !== "PENDING") throw new Error("Yêu cầu đã được xử lý trước đó")

    if (action === "done") {
      // 1. Update status
      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { status: "COMPLETED" }
      })

      // 2. Add activity
      await tx.userActivity.create({
        data: {
          userId: withdrawal.userId,
          type: "WITHDRAW_COMPLETED",
          details: `Yêu Cầu Thanh Toán ${withdrawal.amount.toLocaleString()} VND Đã Được Xử Lý.`
        }
      })

      revalidatePath("/seller/withdraw")
      revalidatePath("/seller/withdraw/history")
      revalidatePath("/admin/withdrawals")

      return { success: true, message: "ĐÃ HOÀN THÀNH" }
    } else {
      // 1. Refund balance to user
      await tx.user.update({
        where: { id: withdrawal.userId },
        data: { balance: { increment: withdrawal.amount } }
      })

      // 2. Create transaction record (Ledger)
      await tx.transaction.create({
        data: {
          userId: withdrawal.userId,
          amount: withdrawal.amount,
          balanceBefore: withdrawal.user.balance,
          balanceAfter: withdrawal.user.balance + withdrawal.amount,
          type: "REFUND",
          description: `Hoàn Tiền Yêu Cầu Thanh Toán #${withdrawalId.slice(-6).toUpperCase()}`
        }
      })

      // 3. Add user activity
      await tx.userActivity.create({
        data: {
          userId: withdrawal.userId,
          type: "WITHDRAW_REJECTED",
          details: `Yêu Cầu Thanh Toán ${withdrawal.amount.toLocaleString()} VND Bị Từ Chối.`
        }
      })

      // 4. Update withdrawal status
      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { status: "REJECTED" }
      })

      revalidatePath("/seller/withdraw")
      revalidatePath("/seller/withdraw/history")
      revalidatePath("/admin/withdrawals")

      return { success: true, message: "ĐÃ HUỶ BỎ (ĐÃ HOÀN TIỀN)" }
    }
  })
}
