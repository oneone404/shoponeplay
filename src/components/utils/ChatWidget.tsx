"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, X, Headset, Minus, Maximize2, MoreHorizontal } from "lucide-react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useUI } from "@/providers/UIProvider"
import { useLanguage } from "@/providers/LanguageProvider"
import { usePathname } from "next/navigation"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "zalo-grid" | "contact-links"
}

export default function ChatWidget() {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const pathname = usePathname()
  const { chatOpen, setChatOpen, chatMinimized, setChatMinimized } = useUI()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [hasStarted, setHasStarted] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatOpen) {
      const timer = setTimeout(() => setIsMounted(true), 10)
      return () => clearTimeout(timer)
    } else {
      setIsMounted(false)
    }
  }, [chatOpen])

  // Bot Introduction Sequence
  useEffect(() => {
    if (chatOpen && !hasStarted) {
      setHasStarted(true)
      startSequence()
    }
  }, [chatOpen, hasStarted])

  const startSequence = async () => {
    // 1. First Welcome Message
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1000))
    const msg1: Message = { id: "1", text: t.chat.welcome, sender: "bot", timestamp: new Date() }
    setMessages([msg1])
    setIsTyping(false)

    // 2. Second Invite Message
    await new Promise(r => setTimeout(r, 800))
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1200))
    const msg2: Message = { id: "2", text: t.chat.invite, sender: "bot", timestamp: new Date() }
    setMessages(prev => [...prev, msg2])
    setIsTyping(false)

    // 3. Show Grid
    await new Promise(r => setTimeout(r, 500))
    const msg3: Message = { id: "3", text: "", sender: "bot", timestamp: new Date(), type: "zalo-grid" }
    setMessages(prev => [...prev, msg3])
  }

  useEffect(() => {
    if (chatOpen && !chatMinimized && scrollRef.current) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth"
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [messages, isTyping, chatOpen, chatMinimized])

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")

    // Bot auto-reply logic
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: t.chat.auto_reply,
          sender: "bot",
          timestamp: new Date(),
        }

        const contactMsg: Message = {
          id: (Date.now() + 1.5).toString(),
          text: "",
          sender: "bot",
          timestamp: new Date(),
          type: "contact-links"
        }

        const gridMsg: Message = {
          id: (Date.now() + 2).toString(),
          text: "",
          sender: "bot",
          timestamp: new Date(),
          type: "zalo-grid"
        }

        setMessages(prev => [...prev, botMsg, contactMsg, gridMsg])
        setIsTyping(false)
      }, 1500)
    }, 500)
  }

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) return null;

  if (!chatOpen) return null

  return (
    <div
      className={cn(
        "fixed bottom-20 sm:bottom-6 right-6 z-[100] flex flex-col items-end transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ willChange: "transform, opacity" }}
    >
      <div className="relative w-full flex flex-col items-end">
        {/* Chat Window */}
        <div
          className={cn(
            "w-[310px] sm:w-[370px] bg-card border border-white/20 rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(244,63,94,0.15)] flex flex-col h-[520px] sm:h-[580px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            !chatMinimized ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-20 scale-75 pointer-events-none absolute bottom-0 right-0"
          )}
          style={{ transformOrigin: "bottom right", willChange: "transform, opacity" }}
        >
              {/* Header */}
              <div className="bg-accent px-4 py-2.5 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-white/10">
                      <img src="/images/avatars/support-bot.png" alt="Support" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-accent animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase leading-none">{t.chat.agent_name}</p>
                    <p className="text-[8px] text-white/70 font-bold uppercase mt-1">{t.chat.online}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setChatMinimized(true)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
                  >
                    <Minus className="w-4 h-4" strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
                  >
                    <X className="w-4 h-4" strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/5 scrollbar-hide"
              >
                {/* Global Channels */}
                <div className="bg-card/50 border border-border rounded-2xl p-3 flex flex-col space-y-3 mb-2">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase text-center tracking-tighter">{t.chat.quick_contact}</p>
                  <div className="flex items-center justify-center gap-3">
                    <a href="#" target="_blank" className="flex items-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-full transition-colors group">
                      <div className="w-5 h-5 overflow-hidden rounded-full">
                        <img src="/images/brand/zalo.svg" alt="Zalo" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-500">Zalo</span>
                    </a>
                    <a href="#" target="_blank" className="flex items-center space-x-2 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-full transition-colors group">
                      <div className="w-5 h-5 overflow-hidden rounded-full">
                        <img src="/images/brand/telegram.svg" alt="Telegram" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[10px] font-bold text-sky-500">Telegram</span>
                    </a>
                  </div>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {msg.type === "contact-links" ? (
                      <div className="flex items-center justify-center gap-3 bg-card/50 border border-border rounded-2xl p-3 ml-10">
                        <a href="#" target="_blank" className="flex items-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-full transition-colors group">
                          <div className="w-5 h-5 overflow-hidden rounded-full">
                            <img src="/images/brand/zalo.svg" alt="Z" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-[10px] font-bold text-blue-500">Zalo</span>
                        </a>
                        <a href="#" target="_blank" className="flex items-center space-x-2 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-full transition-colors group">
                          <div className="w-5 h-5 overflow-hidden rounded-full">
                            <img src="/images/brand/telegram.svg" alt="T" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-[10px] font-bold text-sky-500">Telegram</span>
                        </a>
                      </div>
                    ) : msg.type === "zalo-grid" ? (
                      <div className="grid grid-cols-2 gap-2 ml-10">
                        {[
                          { label: t.chat.groups.social, color: "bg-blue-500" },
                          { label: t.chat.groups.trade, color: "bg-sky-500" },
                          { label: t.chat.groups.notif, color: "bg-indigo-500" },
                          { label: t.chat.groups.support, color: "bg-slate-700" }
                        ].map((item, i) => (
                          <a
                            key={i}
                            href="#"
                            target="_blank"
                            className="bg-card border border-border rounded-xl p-2.5 flex items-center space-x-2 hover:border-accent/40 hover:bg-accent/[0.02] transition-all group active:scale-95"
                          >
                            <div className={cn("w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center bg-white p-0.5 shadow-sm", item.color)}>
                              <img src="/images/brand/zalo.svg" alt="Z" className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-bold text-foreground leading-none">{t.chat.box.replace("{n}", (i + 1).toString())}</p>
                              <p className="text-[8px] text-muted-foreground font-medium mt-1 truncate">{item.label}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "flex items-start gap-2 max-w-[85%]",
                          msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                      >
                        {msg.sender === "bot" && (
                          <div className="w-8 h-8 rounded-xl bg-accent/10 p-1 shrink-0 border border-accent/5">
                            <img src="/images/avatars/support-bot.png" alt="S" className="w-full h-full object-cover rounded-lg" />
                          </div>
                        )}
                        <div className={cn(
                          "p-3.5 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm",
                          msg.sender === "user"
                            ? "bg-accent text-white rounded-tr-none"
                            : "bg-card border border-border rounded-tl-none"
                        )}>
                          {msg.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-2 mr-auto max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-8 h-8 rounded-xl bg-accent/10 p-1 shrink-0 border border-accent/5">
                      <img src="/images/avatars/support-bot.png" alt="S" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-none flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border bg-card flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t.chat.placeholder}
                  className="flex-1 bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-xs outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:grayscale"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
        </div>

        {/* Minimized Button */}
        <button
          onClick={() => setChatMinimized(false)}
          className={cn(
            "flex items-center space-x-3 group relative transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            chatMinimized ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-10 scale-75 pointer-events-none absolute bottom-0 right-0"
          )}
          style={{ transformOrigin: "bottom right", willChange: "transform, opacity" }}
        >
          <span className="hidden sm:block absolute right-full mr-4 px-4 py-2 bg-card border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity shadow-xl whitespace-nowrap">
            {t.chat.minimized_tip}
          </span>

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl shadow-accent/40 border-4 border-white/10 hover:scale-110 active:scale-90 transition-all overflow-hidden animate-pulse">
            <img src="/images/avatars/support-bot.png" alt="Support" className="w-full h-full object-cover scale-110" />
            <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white animate-bounce" />
          </div>
        </button>
      </div>
    </div>
  )
}
