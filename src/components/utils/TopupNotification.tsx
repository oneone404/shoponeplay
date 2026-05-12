"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, DollarSign, X } from "lucide-react"
import { pusherClient } from "@/lib/pusher-client"
import { useSession } from "next-auth/react"

interface TopupData {
  userName: string
  amount: number
  time: string
  message?: string
}

export default function TopupNotification() {
  const { data: session } = useSession()
  const [notification, setNotification] = useState<TopupData | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) return

    const userId = session.user.id
    const channel = pusherClient.subscribe(`user-${userId}`)
    
    channel.bind("new-deposit", (data: TopupData) => {
      setNotification(data)
      setIsVisible(true)
      
      // Auto hide after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 8000)
      
      return () => clearTimeout(timer)
    })

    return () => {
      pusherClient.unsubscribe(`user-${userId}`)
    }
  }, [session?.user?.id])

  if (!notification) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8, transition: { duration: 0.5 } }}
          className="fixed bottom-24 left-6 z-[100] w-[280px]"
        >
          <div className="relative group">
            {/* Background Blur Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative flex items-center gap-4 bg-card/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
                <CreditCard className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Nạp tiền thành công</p>
                <div className="flex flex-col">
                  <span className="text-[13px] font-extrabold text-foreground truncate">
                    {notification.userName}
                  </span>
                  <span className="text-sm font-black text-emerald-500">
                    +{notification.amount.toLocaleString()} VND
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Progress Bar */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute bottom-0 left-4 right-4 h-0.5 bg-rose-500/30 rounded-full overflow-hidden"
            >
               <div className="h-full bg-rose-500 w-full" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
