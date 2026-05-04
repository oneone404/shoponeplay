import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import CardDepositClient from "@/components/shop/CardDepositClient"

export default async function CardDepositPage() {
  const session = await auth()

  if (!session) {
    redirect("/signin?callbackUrl=/deposit/card")
  }

  const configs = await prisma.config.findMany({
    where: {
      key: { in: ["CARD_ENABLED"] }
    }
  })

  const isEnabled = configs.find(c => c.key === "CARD_ENABLED")?.value === "true"

  if (!isEnabled) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-muted-foreground opacity-50">
          Chức năng nạp thẻ đang bảo trì
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Vui lòng quay lại sau hoặc sử dụng phương thức nạp Bank.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <CardDepositClient />
    </div>
  )
}
