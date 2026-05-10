"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { USER_ROUTES } from "@/lib/config/user-routes"
import HackToolCard from "./HackToolCard"

interface HackDetailClientProps {
  hack: any
}

export default function HackDetailClient({ hack }: HackDetailClientProps) {
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handlePurchaseSuccess = () => {
    router.push(USER_ROUTES.HISTORY.HACKS.path)
  }

  return (
    <div className="space-y-12 pb-20">
      <HackToolCard 
        hack={hack} 
        onPurchaseSuccess={handlePurchaseSuccess} 
        onViewHistory={() => {
          router.push(USER_ROUTES.HISTORY.HACKS.path)
        }}
      />
    </div>
  )
}
