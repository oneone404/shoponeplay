"use client"

import { useEffect } from "react"
import { pusherClient } from "@/lib/pusher-client"
import { useSession } from "next-auth/react"
import { useUI } from "@/providers/UIProvider"

interface TopupData {
  userName: string
  amount: number
  time: string
  message?: string
}

export default function TopupNotification() {
  const { data: session } = useSession()
  const { addMessage } = useUI()

  useEffect(() => {
    if (!session?.user?.id) return

    const userId = session.user.id
    const channel = pusherClient.subscribe(`user-${userId}`)
    
    channel.bind("new-deposit", (data: TopupData) => {
      // Gọi thông báo chung của hệ thống
      addMessage({
        type: "success",
        text: data.message || `Bạn vừa nạp thành công ${data.amount.toLocaleString()} VND.`
      })
    })

    return () => {
      pusherClient.unsubscribe(`user-${userId}`)
    }
  }, [session?.user?.id, addMessage])

  return null // Không cần render gì vì đã dùng Toast chung
}
