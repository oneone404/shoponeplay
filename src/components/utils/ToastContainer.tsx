"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Shield, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUI } from "@/providers/UIProvider"
import { TOAST_CONFIG } from "@/config/toast.config"

export default function ToastContainer() {
  const { messages, removeMessage } = useUI()

  return (
    <div className={cn(
      "fixed top-12 sm:top-20 left-4 right-4 sm:left-auto sm:right-6 z-[9999]",
      "flex flex-col gap-3 items-center sm:items-end pointer-events-none"
    )}>
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            layout
            {...TOAST_CONFIG.ANIMATION}
            className={cn(
              "pointer-events-auto px-4 py-3 rounded-2xl shadow-2xl border flex items-start space-x-3 bg-card/95 backdrop-blur-md",
              "w-full max-w-sm sm:w-auto overflow-hidden",
              msg.type === "success" 
                ? "border-emerald-500/40 text-emerald-500 shadow-emerald-500/10" 
                : "border-rose-500/40 text-rose-500 shadow-rose-500/10"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
              msg.type === "success" ? "bg-emerald-500/20" : "bg-rose-500/20"
            )}>
              {msg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            </div>
            <div className="flex flex-col flex-1 min-w-0 pr-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] leading-tight mb-1 opacity-60">
                {msg.type === "success" ? "Thành Công" : "Lỗi hệ thống"}
              </span>
              <p className="text-[11px] font-bold leading-relaxed break-words">
                {msg.text}
              </p>
            </div>
            <button 
              onClick={() => removeMessage(msg.id)}
              className="mt-0.5 p-1 hover:bg-white/5 rounded-lg opacity-40 hover:opacity-100 transition-all shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
