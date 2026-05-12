"use client"

import { useEffect, useRef } from "react"
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
  const pusherRef = useRef<any>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    const userId = session.user.id
    let channel: any = null

    // Import động Pusher và lấy cấu hình từ DB
    const initPusher = async () => {
      try {
        // 1. Lấy cấu hình từ API (DB)
        const configRes = await fetch("/api/public/config")
        const config = await configRes.json()

        if (!config.pusherKey || !config.pusherCluster) {
          console.error("[Pusher] Missing config in DB")
          return
        }

        const PusherModule = await import("pusher-js")
        const Pusher = (PusherModule as any).default || PusherModule
        
        if (typeof Pusher !== 'function') {
          console.error("[Pusher] Cannot find constructor", Pusher)
          return
        }

        const pusher = new Pusher(
          config.pusherKey,
          {
            cluster: config.pusherCluster,
            enabledTransports: ['ws', 'wss'],
          }
        )
        
        pusherRef.current = pusher
        channel = pusher.subscribe(`user-${userId}`)
        
        channel.bind("new-deposit", (data: TopupData) => {
          addMessage({
            type: "success",
            text: data.message || `Bạn vừa nạp thành công ${data.amount.toLocaleString()} VND.`
          })
        })
      } catch (error) {
        console.error("[Pusher] Init error:", error)
      }
    }

    initPusher()

    return () => {
      if (pusherRef.current && userId) {
        pusherRef.current.unsubscribe(`user-${userId}`)
        pusherRef.current.disconnect()
      }
    }
  }, [session?.user?.id, addMessage])

  return null
}
