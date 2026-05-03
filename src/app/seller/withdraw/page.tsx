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
  
  if (!session?.user?.id || (session.user.role !== "SELLER" && session.user.role !== "ADMIN")) {
    redirect("/")
  }

  const userId = session.user.id

  // Fetch current balance and history
  const [user, history] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    }),
    prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })
  ])

  return (
    <WithdrawView 
      balance={user?.balance || 0} 
      history={history as any} 
      onRequestWithdraw={createWithdrawal}
    />
  )
}
