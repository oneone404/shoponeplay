import { Metadata } from "next"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SELLER_ROUTES } from "@/lib/config/seller-routes"
import SellerWithdrawHistoryClient from "@/components/seller/SellerWithdrawHistoryClient"

export const metadata: Metadata = {
  title: SELLER_ROUTES.WITHDRAW_HISTORY.title
}

export default async function SellerWithdrawHistoryPage() {
  const session = await auth()
  const userId = session!.user.id

  const withdrawals = await prisma.withdrawal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <SellerWithdrawHistoryClient
      initialWithdrawals={JSON.parse(JSON.stringify(withdrawals))}
    />
  )
}
