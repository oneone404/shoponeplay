"use server"

import { auth } from "@/auth"
import { processWithdrawalAction } from "@/lib/services/withdrawal"

export async function handleWithdrawalAction(withdrawalId: string, action: "done" | "cancel") {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Bạn không có quyền thực hiện hành động này" }
  }

  try {
    const result = await processWithdrawalAction({
      withdrawalId,
      action,
      adminId: session.user.id!,
      adminName: session.user.name || "Admin"
    })

    return { success: true, message: result.message }
  } catch (error: any) {
    return { success: false, message: error.message || "Đã có lỗi xảy ra" }
  }
}
