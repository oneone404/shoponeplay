"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Shield, X, AlertCircle, Info as InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUI } from "@/providers/UIProvider"
import { TOAST_CONFIG } from "@/config/toast.config"

export default function ToastContainer() {
  const { messages, removeMessage } = useUI()

  return (
    <div className={cn(
      "fixed top-6 sm:top-8 left-4 right-4 sm:left-auto sm:right-8 z-[100000]",
      "flex flex-col gap-3 items-center sm:items-end pointer-events-none"
    )}>
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            layout
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "pointer-events-auto w-full max-w-sm sm:w-[360px] bg-background border-2 rounded-xl overflow-hidden relative",
              "flex items-center p-4 space-x-4 shadow-sm", // Changed to items-center for better alignment with long text
              msg.type === "success" ? "border-emerald-500/50" : 
              msg.type === "error" ? "border-rose-500/50" : 
              msg.type === "warning" ? "border-amber-500/50" : "border-blue-500/50"
            )}
          >
            {/* Status Color Strip (Pill style) */}
            <div className={cn(
              "absolute top-3 bottom-3 left-1 w-1 rounded-full",
              msg.type === "success" ? "bg-emerald-500" : 
              msg.type === "error" ? "bg-rose-500" : 
              msg.type === "warning" ? "bg-amber-500" : "bg-blue-500"
            )} />

            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              msg.type === "success" ? "bg-emerald-500/10 text-emerald-500" : 
              msg.type === "error" ? "bg-rose-500/10 text-rose-500" : 
              msg.type === "warning" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
            )}>
              {msg.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : 
               msg.type === "error" ? <Shield className="w-5 h-5" /> : 
               msg.type === "warning" ? <AlertCircle className="w-5 h-5" /> : <InfoIcon className="w-5 h-5" />}
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1.5",
                msg.type === "success" ? "text-emerald-500" : 
                msg.type === "error" ? "text-rose-500" : 
                msg.type === "warning" ? "text-amber-500" : "text-blue-500"
              )}>
                {msg.type === "success" ? "Thành công" : 
                 msg.type === "error" ? "Lỗi hệ thống" : 
                 msg.type === "warning" ? "Cảnh báo" : "Thông báo"}
              </span>
              <p className="text-[12px] font-bold text-foreground leading-snug">
                {msg.text}
              </p>
            </div>

            <button 
              onClick={() => removeMessage(msg.id)}
              className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress Bar Timer */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: TOAST_CONFIG.DURATION / 1000, ease: "linear" }}
              className={cn(
                "absolute bottom-0 left-0 h-0.5",
                msg.type === "success" ? "bg-emerald-500" : 
                msg.type === "error" ? "bg-rose-500" : 
                msg.type === "warning" ? "bg-amber-500" : "bg-blue-500"
              )}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
