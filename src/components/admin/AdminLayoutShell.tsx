"use client"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import Image from "next/image"
import AdminSidebar from "./AdminSidebar"
import { cn } from "@/lib/utils"

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState("")
  const DEFAULT_LOGO = "https://placehold.co/400x120/e2e8f0/1e293b?text=No+Image";

  useEffect(() => {
    fetch("/api/admin/settings/general")
      .then(res => res.json())
      .then(data => {
        if (data.siteLogo) setLogoUrl(data.siteLogo)
      })
      .catch(console.error)
  }, [])

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Sidebar - Desktop and Mobile (Full screen on mobile) */}
      <div className={cn(
        "fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:inset-auto md:translate-x-0 h-[100dvh] flex flex-col bg-card",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <AdminSidebar logoUrl={logoUrl} onCloseMobile={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-card border-b border-border md:hidden shrink-0">
          <div className="flex items-center space-x-2">
            <Image
              src={logoUrl ? `${logoUrl}?v=1` : DEFAULT_LOGO}
              alt="ShopOnePlay Logo"
              height={32}
              width={120}
              priority
              unoptimized={true}
              className="h-8 w-auto object-contain"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-foreground/90 text-background px-2 py-1 rounded-md">Admin</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-rose-500 hover:text-rose-400 transition-colors active:scale-95"
          >
            <Menu className="w-7 h-7" strokeWidth={2.5} />
          </button>
        </header>

        {/* Content area */}
        <div className="p-4 md:p-8 overflow-y-auto flex-1 w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
