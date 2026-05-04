import { Metadata } from "next"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SELLER_ROUTES } from "@/lib/config/seller-routes"
import SellerSettingsClient from "@/components/seller/SellerSettingsClient"

export const metadata: Metadata = {
  title: SELLER_ROUTES.SETTINGS.title
}

export default async function SellerSettingsPage() {
  const session = await auth()
  const userId = session!.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      sellerBankName: true,
      sellerAccountNumber: true,
      sellerAccountName: true,
    }
  })

  return (
    <SellerSettingsClient
      initialData={{
        bankName: user?.sellerBankName || "",
        accountNumber: user?.sellerAccountNumber || "",
        accountName: user?.sellerAccountName || "",
      }}
    />
  )
}
