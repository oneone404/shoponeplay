"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, User, Sun, Moon, Plus, LogOut, Settings, History, Package, Terminal, Home, LayoutGrid, BookOpen, Globe, LogIn } from "lucide-react"
import { useTheme } from "@/providers/ThemeProvider"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useUI } from "@/providers/UIProvider"
import { getMembershipTier } from "@/lib/membership"
import { useCart } from "@/providers/CartProvider"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"

export default function Navbar({ logoUrl }: { logoUrl?: string }) {
  const router = useRouter()
  const DEFAULT_LOGO = "https://placehold.co/400x120/e2e8f0/1e293b?text=No+Image";
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { data: session, status } = useSession()
  const { profileOpen, setProfileOpen, setDepositOpen, closeAll } = useUI()
  const { items } = useCart()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch and clean up ?v= URL params
  useEffect(() => {
    setMounted(true)
    
    // Clean up ?v= param from URL if it exists (used for cache busting)
    if (typeof window !== 'undefined' && window.location.search.includes('v=')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('v');
      window.history.replaceState({}, '', url.toString() || window.location.pathname);
    }
  }, [])

  // Close all menus on navigation
  useEffect(() => {
    closeAll()
  }, [pathname, closeAll])

  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"

  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault()
      router.push(ROUTES.SIGNIN)
      closeAll()
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative h-9 w-auto transition-all duration-300 group-hover:scale-105 active:scale-95">
                <Image
                  src={logoUrl ? `${logoUrl}?v=1` : DEFAULT_LOGO}
                  alt="ShopOnePlay Logo"
                  height={100}
                  width={180}
                  priority
                  unoptimized={true}
                  className="h-9 w-auto object-contain"
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <NavLink href={ROUTES.HOME} icon={<Home className="w-4 h-4" />}>{t.nav.home}</NavLink>
              <NavLink href={ROUTES.SHOP} icon={<LayoutGrid className="w-4 h-4" />}>{t.nav.shop}</NavLink>
              <NavLink href={ROUTES.TOOLS} icon={<Terminal className="w-4 h-4" />}>{t.nav.tools}</NavLink>
              <NavLink href={ROUTES.HISTORY} icon={<History className="w-4 h-4" />}>{t.nav.history}</NavLink>
              <NavLink href={ROUTES.HACKS} icon={<Package className="w-4 h-4" />}>{t.nav.hacks}</NavLink>
              <NavLink href={ROUTES.BLOG} icon={<BookOpen className="w-4 h-4" />}>{t.nav.blog}</NavLink>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            <Link 
              href={ROUTES.BAG}
              className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground relative group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {items.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-background animate-in zoom-in duration-300">
                  {items.length}
                </span>
              )}
            </Link>

            <div className="flex items-center space-x-3">
              {/* Deposit Button - Only show if authenticated */}
              {isAuthenticated && (
                <button
                  onClick={() => setDepositOpen(true)}
                  className="hidden sm:flex px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-bold transition-all items-center space-x-2 text-sm active:scale-95 border border-accent/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.common.deposit}</span>
                </button>
              )}

              <div className="relative">
                {(!mounted || isLoading) ? (
                  /* Skeleton while loading session */
                  <div className="w-10 h-10 rounded-full bg-secondary animate-pulse border-2 border-border/20" />
                ) : (
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden hover:border-primary transition-all active:scale-95"
                  >
                    <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                      {isAuthenticated ? (
                        <img src={session?.user?.image || "/images/avatars/one-bot.png"} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                )}

                {/* Backdrop - Dimmed click catcher */}
                {profileOpen && (
                  <div
                    className="fixed inset-0 z-10 bg-black/20 transition-opacity duration-200 animate-in fade-in"
                    onClick={() => setProfileOpen(false)}
                  />
                )}

                <div
                  className={cn(
                    "absolute right-0 mt-2 w-64 bg-card border border-border rounded-2xl shadow-2xl z-20 py-1 transition-all duration-200 ease-out origin-top-right",
                    profileOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  )}
                >
                  {isAuthenticated ? (
                    /* Authenticated User Info */
                    <div className="px-5 py-5 border-b border-border bg-secondary/30 relative overflow-hidden flex items-center space-x-3">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />

                      <div className="relative z-10 w-12 h-12 rounded-xl border border-primary/20 p-0.5 bg-background shrink-0">
                        <img
                          src={session?.user?.image || "/images/avatars/one-bot.png"}
                          alt="Avatar"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="relative z-10 min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                            {session?.user?.role || "USER"}
                          </p>
                          <span className={cn(
                            "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md border",
                            getMembershipTier(session?.user?.totalDeposited || 0).color,
                            getMembershipTier(session?.user?.totalDeposited || 0).bg,
                            getMembershipTier(session?.user?.totalDeposited || 0).border
                          )}>
                            {getMembershipTier(session?.user?.totalDeposited || 0).name}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-foreground truncate">{session?.user?.name || "Member"}</p>
                        <p className="text-[10px] font-bold text-accent mt-0.5">
                          {new Intl.NumberFormat('vi-VN').format(session?.user?.balance || 0)} VND
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Guest / Login Prompt */
                    <div className="p-4 border-b border-border">
                      <Link
                        href={ROUTES.SIGNIN}
                        onClick={() => setProfileOpen(false)}
                        className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center space-x-2 transition-all active:scale-95 border border-primary/20"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>{t.common.login}</span>
                      </Link>
                    </div>
                  )}

                  <div className="py-2">
                    {/* Mobile Navigation Links */}
                    <div className="md:hidden border-b border-border mb-2 pb-2">
                      <DropdownItem href={ROUTES.SHOP} icon={<LayoutGrid className="w-4 h-4" />}>{t.nav.shop.toUpperCase()}</DropdownItem>
                      <DropdownItem href={ROUTES.TOOLS} icon={<Terminal className="w-4 h-4" />}>{t.nav.tools.toUpperCase()}</DropdownItem>
                      <DropdownItem href={ROUTES.HISTORY} icon={<History className="w-4 h-4" />}>{t.nav.history.toUpperCase()}</DropdownItem>
                      <DropdownItem href={ROUTES.HACKS} icon={<Package className="w-4 h-4" />}>{t.nav.hacks.toUpperCase()}</DropdownItem>
                    </div>

                    {/* Admin Actions */}
                    {isAuthenticated && session?.user?.role === "ADMIN" && (
                      <DropdownItem href="/admin" icon={<LayoutGrid className="w-4 h-4" />} onClick={closeAll}>{t.nav.admin}</DropdownItem>
                    )}

                    {/* Standard User Actions */}
                    <DropdownItem href={ROUTES.USER.SETTINGS} icon={<User className="w-4 h-4" />} onClick={(e) => handleProtectedClick(e, ROUTES.USER.SETTINGS)}>{t.nav.user_profile}</DropdownItem>
                    <DropdownItem href={ROUTES.USER.HISTORY} icon={<History className="w-4 h-4" />} onClick={(e) => handleProtectedClick(e, ROUTES.USER.HISTORY)}>{t.nav.purchased_orders}</DropdownItem>

                    <DropdownItem href={ROUTES.BLOG} icon={<BookOpen className="w-4 h-4" />} onClick={closeAll}>{t.nav.blog_news}</DropdownItem>
                    <DropdownItem href={ROUTES.USER.SETTINGS} icon={<Settings className="w-4 h-4" />} onClick={(e) => handleProtectedClick(e, ROUTES.USER.SETTINGS)}>{t.nav.settings}</DropdownItem>
                  </div>

                  {/* Language Switcher - Simplified & Optimized for Safari */}
                  <div className="px-5 py-3 border-t border-border flex items-center justify-center">
                    <div className="relative flex w-full h-8 bg-secondary rounded-xl p-1 cursor-pointer border border-border overflow-hidden select-none touch-none">
                      <div 
                        className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-primary rounded-[10px] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform"
                        style={{
                          transform: language === "en" ? 'translate3d(100%, 0, 0)' : 'translate3d(0, 0, 0)',
                          WebkitTransform: language === "en" ? 'translate3d(100%, 0, 0)' : 'translate3d(0, 0, 0)',
                        }}
                      />
                      <button 
                        onClick={() => setLanguage("vi")}
                        className={cn(
                          "relative z-10 flex-1 flex items-center justify-center text-[10px] font-bold transition-colors duration-300",
                          language === "vi" ? "text-white" : "text-muted-foreground"
                        )}
                      >
                        TIẾNG VIỆT
                      </button>
                      <button 
                        onClick={() => setLanguage("en")}
                        className={cn(
                          "relative z-10 flex-1 flex items-center justify-center text-[10px] font-bold transition-colors duration-300",
                          language === "en" ? "text-white" : "text-muted-foreground"
                        )}
                      >
                        ENGLISH
                      </button>
                    </div>
                  </div>

                  {/* Logout Button - Only show if authenticated */}
                  {isAuthenticated && (
                    <div className="py-2 border-t border-border">
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center space-x-3 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-accent hover:bg-accent/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t.common.logout}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode, icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-primary flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
    >
      {icon}
      <span>{children}</span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
    </Link>
  )
}

function DropdownItem({ href, children, icon, onClick }: { href: string; children: React.ReactNode, icon: React.ReactNode, onClick?: (e: React.MouseEvent) => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center space-x-3 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-widest text-foreground hover:bg-secondary transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}
