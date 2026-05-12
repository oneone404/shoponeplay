"use client"

import Link from "next/link"
import {
  Home, LayoutGrid, Plus, Terminal, User, Wrench, Settings,
  CreditCard, KeyRound, History, Package, FileSearch, Headphones, Gamepad2,
  Download, Zap, Ticket, Layers
} from "lucide-react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { useUI } from "@/providers/UIProvider"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"

export default function BottomNav() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLanguage()
  const { toolsOpen, setToolsOpen, setProfileOpen, setChatOpen, setDepositOpen, depositOpen } = useUI()

  const toggleTools = useCallback(() => {
    setToolsOpen(!toolsOpen)
  }, [toolsOpen, setToolsOpen])

  const closeTools = useCallback(() => {
    setToolsOpen(false)
  }, [setToolsOpen])

  const tools = [
    { icon: <Download className="w-[20px] h-[20px]" />, label: "Tải Hack", action: () => router.push(ROUTES.HACKS) },
    { icon: <Zap className="w-[20px] h-[20px]" />, label: "Nạp Gói", action: () => router.push(ROUTES.NAPGAME) },
    { icon: <Ticket className="w-[20px] h-[20px]" />, label: "Nhập Code", action: () => router.push(ROUTES.GIFTCODE) },
    { icon: <Layers className="w-[20px] h-[20px]" />, label: "ID Cá", action: () => router.push(ROUTES.FISH_ID) },
  ]

  // If in admin or seller panel, or if deposit modal is open, do not render BottomNav
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/seller') || depositOpen) return null;

  return (
    <>
      {/* Overlay & Panel with High-Performance CSS Transitions */}
      {/* Overlay - Dimmed click catcher */}
      <div
        onClick={closeTools}
        className={cn(
          "fixed inset-0 z-[60] bg-black/50 md:hidden transition-opacity duration-300 ease-out",
          toolsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[70]",
          "rounded-t-[32px] bg-card px-4 pt-3 shadow-2xl md:hidden",
          "pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]",
          "border-t border-border",
          "transition-transform duration-[400ms] will-change-transform"
        )}
        style={{ 
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
          transform: toolsOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)' 
        }}
      >
        {/* Drag Handle */}
        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-muted-foreground/20" />

        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
          {tools.map((tool, index) => (
            <button
              key={index}
              onClick={() => {
                tool.action();
                setToolsOpen(false);
              }}
              className="flex flex-col items-center gap-2 outline-none group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/50 text-foreground group-active:scale-95 group-active:bg-secondary/80 transition-all duration-200 shadow-sm border border-border/10">
                {tool.icon}
              </div>
              <span className="text-[9px] font-bold text-muted-foreground group-active:text-foreground transition-colors leading-tight tracking-wide">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border px-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between h-16 relative">
          <BottomNavItem href={ROUTES.HOME} icon={<Home className="w-5 h-5" />} label={t.nav.home} />
          <BottomNavItem href={ROUTES.SHOP} icon={<LayoutGrid className="w-5 h-5" />} label={t.nav.shop} />
          
          <div className="relative -top-3">
            <button 
              onClick={() => {
                if (status === "unauthenticated") router.push(ROUTES.SIGNIN)
                else setDepositOpen(true)
              }}
              className="flex flex-col items-center group outline-none"
            >
              <div className="w-13 h-13 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/40 text-white border-4 border-background group-active:scale-90 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold mt-0 text-accent tracking-tighter">{t.common.deposit}</span>
            </button>
          </div>

          <button
            onClick={toggleTools}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-all active:scale-90",
              toolsOpen ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "transition-transform will-change-transform",
              toolsOpen && "rotate-180"
            )}
            style={{ transitionDuration: '400ms', transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
            >
              <Terminal className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">{t.nav.tools}</span>
          </button>

          <BottomNavItem 
            href={ROUTES.USER.SETTINGS} 
            icon={<User className="w-5 h-5" />} 
            label={t.common.account} 
            isProtected
          />
        </div>
      </div>

      <div className="h-16 md:hidden" />
    </>
  )
}

function BottomNavItem({ href, icon, label, isProtected }: { href: string; icon: React.ReactNode; label: string; isProtected?: boolean }) {
  const { status } = useSession()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    if (isProtected && status === "unauthenticated") {
      e.preventDefault()
      router.push("/signin")
    }
  }

  return (
    <Link 
      href={href} 
      onClick={handleClick}
      className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-primary transition-colors active:scale-90"
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}
