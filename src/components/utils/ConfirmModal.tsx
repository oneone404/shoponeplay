"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, ShieldAlert, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "info" | "warning" | "success"
  isLoading?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác Nhận",
  cancelText = "Hủy Bỏ",
  type = "danger",
  isLoading = false
}: ConfirmModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const themes = {
    danger: {
      icon: <ShieldAlert className="w-5 h-5" />,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      btn: "bg-red-600 border-red-700 hover:bg-red-700 text-white shadow-sm shadow-red-500/10"
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      btn: "bg-orange-600 border-orange-700 hover:bg-orange-700 text-white shadow-sm shadow-orange-500/10"
    },
    success: {
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      btn: "bg-emerald-600 border-emerald-700 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/10"
    },
    info: {
      icon: <AlertCircle className="w-5 h-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      btn: "bg-blue-600 border-blue-700 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/10"
    }
  }

  const theme = themes[type] || themes.info

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 w-screen h-screen z-[10000] flex items-center justify-center p-4">
          {/* Backdrop mờ đơn giản */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal Content - Structured & Clean */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            className="relative w-full max-w-[380px] bg-white rounded-2xl border border-border/60 shadow-xl overflow-hidden"
          >
            {/* Header Section with Icon */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
                  theme.bg, theme.color, theme.border
                )}>
                  {theme.icon}
                </div>
                <h3 className={cn("text-lg font-bold tracking-tight leading-none", theme.color)}>
                  {title}
                </h3>
              </div>
              
              {/* Đường kẻ xám đậm hơn */}
              <div className="w-full h-[1px] bg-border mb-5" />

              <p className="text-[14px] font-medium text-muted-foreground leading-relaxed">
                {message}
              </p>
            </div>

            {/* Actions Section - Seamless with content */}
            <div className="p-8 pt-0 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg text-[13px] font-bold text-muted-foreground bg-white border border-border hover:bg-secondary transition-all disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  "px-5 py-2 rounded-lg text-[13px] font-bold border shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2",
                  theme.btn
                )}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmText}
              </button>
            </div>


          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
