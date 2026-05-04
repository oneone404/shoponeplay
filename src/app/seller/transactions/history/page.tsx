import { Metadata } from "next"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import SellerTransactionHistoryClient from "@/components/seller/SellerTransactionHistoryClient"

export const metadata: Metadata = {
  title: "Lịch Sử Giao Dịch"
}

export const dynamic = 'force-dynamic'

export default async function SellerTransactionHistoryPage() {
  const session = await auth()
  const userId = session!.user.id

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const serializedTransactions = JSON.parse(JSON.stringify(transactions))

  return (
    <SellerTransactionHistoryClient initialTransactions={serializedTransactions} />
  )
}
