import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import WithdrawView from "@/components/seller/withdraw/WithdrawView"
import { createWithdrawal } from "./actions"

export const metadata = {
  title: "Ví Tiền - ShopOnePlay",
}

export default async function WithdrawPage() {
  const session = await auth()
  const userId = session!.user.id

  const [user, withdrawals] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { 
        balance: true,
        totalDeposited: true,
        sellerBankName: true,
        sellerAccountNumber: true,
        sellerAccountName: true,
      }
    }),
    prisma.withdrawal.findMany({
      where: { userId, status: "COMPLETED" },
      select: { amount: true }
    })
  ])

  const totalWithdrawn = withdrawals.reduce((acc, curr) => acc + curr.amount, 0)

  const defaultBankInfo = {
    bankName: user?.sellerBankName || "",
    accountNumber: user?.sellerAccountNumber || "",
    accountName: user?.sellerAccountName || "",
  }

  return (
    <WithdrawView 
      balance={user?.balance || 0} 
      totalDeposited={user?.totalDeposited || 0}
      totalWithdrawn={totalWithdrawn}
      onRequestWithdraw={createWithdrawal}
      defaultBankInfo={defaultBankInfo}
    />
  )
}
