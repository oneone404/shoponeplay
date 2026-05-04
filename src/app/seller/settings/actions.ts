"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateSellerBankInfo(data: {
  bankName: string
  accountNumber: string
  accountName: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Bạn cần đăng nhập để thực hiện" }
  }

  const { bankName, accountNumber, accountName } = data

  if (!bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
    return { success: false, message: "Vui lòng điền đầy đủ thông tin" }
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        sellerBankName: bankName.trim(),
        sellerAccountNumber: accountNumber.trim(),
        sellerAccountName: accountName.trim().toUpperCase(),
      }
    })

    revalidatePath("/seller/settings")
    revalidatePath("/seller/withdraw")

    return { success: true, message: "Cập nhật thông tin thành công!" }
  } catch (error) {
    console.error("Update bank info error:", error)
    return { success: false, message: "Đã có lỗi xảy ra, vui lòng thử lại" }
  }
}
