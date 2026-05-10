"use client"
import React, { createContext, useContext, useState, useCallback } from "react"
import { TOAST_CONFIG } from "@/config/toast.config"

interface UIContextType {
  profileOpen: boolean
  setProfileOpen: (open: boolean) => void
  toolsOpen: boolean
  setToolsOpen: (open: boolean) => void
  chatOpen: boolean
  setChatOpen: (open: boolean) => void
  chatMinimized: boolean
  setChatMinimized: (minimized: boolean) => void
  depositOpen: boolean
  setDepositOpen: (open: boolean) => void
  closeAll: () => void
  messages: Array<{ id: string, type: "success" | "error" | "warning" | "info", text: string }>
  addMessage: (msg: { type: "success" | "error" | "warning" | "info", text: string }) => void
  removeMessage: (id: string) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpenRaw] = useState(false)
  const [toolsOpen, setToolsOpenRaw] = useState(false)
  const [chatOpen, setChatOpenRaw] = useState(false)
  const [chatMinimized, setChatMinimizedRaw] = useState(false)
  const [depositOpen, setDepositOpenRaw] = useState(false)
  const [messages, setMessages] = useState<Array<{ id: string, type: "success" | "error" | "warning" | "info", text: string }>>([])

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const addMessage = useCallback((msg: { type: "success" | "error" | "warning" | "info", text: string }) => {
    const id = Math.random().toString(36).substring(2, 9)
    setMessages((prev) => {
      const next = [...prev, { ...msg, id }]
      if (next.length > TOAST_CONFIG.MAX_TOASTS) {
        return next.slice(next.length - TOAST_CONFIG.MAX_TOASTS)
      }
      return next
    })
    setTimeout(() => removeMessage(id), TOAST_CONFIG.DURATION)
  }, [removeMessage])

  // Hàm mở/đóng Chat chính thức
  const setChatOpen = useCallback((open: boolean) => {
    if (open) {
      // Khi mở chat mới, mặc định là mở to và đóng các menu khác
      setProfileOpenRaw(false)
      setToolsOpenRaw(false)
      setChatMinimizedRaw(false)
    }
    setChatOpenRaw(open)
  }, [])

  const setChatMinimized = useCallback((minimized: boolean) => {
    if (!minimized) {
      // Khi mở to chat, tự động đóng các menu khác
      setProfileOpenRaw(false)
      setToolsOpenRaw(false)
    }
    setChatMinimizedRaw(minimized)
  }, [])

  const setProfileOpen = useCallback((open: boolean) => {
    if (open) {
      setToolsOpenRaw(false)
      // Tự động thu nhỏ chat nếu đang mở
      setChatMinimizedRaw(true)
    }
    setProfileOpenRaw(open)
  }, [])

  const setToolsOpen = useCallback((open: boolean) => {
    if (open) {
      setProfileOpenRaw(false)
      // Tự động thu nhỏ chat nếu đang mở
      setChatMinimizedRaw(true)
    }
    setToolsOpenRaw(open)
  }, [])

  const setDepositOpen = useCallback((open: boolean) => {
    if (open) {
      setProfileOpenRaw(false)
      setToolsOpenRaw(false)
      setChatMinimizedRaw(true)
    }
    setDepositOpenRaw(open)
  }, [])

  const closeAll = useCallback(() => {
    setProfileOpenRaw(false)
    setToolsOpenRaw(false)
    setDepositOpenRaw(false)
    // Thu nhỏ chat về dạng bong bóng khi đóng tất cả
    setChatMinimizedRaw(true)
  }, [])

  return (
    <UIContext.Provider value={{ 
      profileOpen, setProfileOpen, 
      toolsOpen, setToolsOpen,       chatOpen, setChatOpen,
      chatMinimized, setChatMinimized,
      depositOpen, setDepositOpen,
      closeAll,
      messages, addMessage, removeMessage
    }}>
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => {
  const context = useContext(UIContext)
  if (!context) throw new Error("useUI must be used within UIProvider")
  return context
}
