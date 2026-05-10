"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { LayoutDashboard, Users, ShoppingBag, Receipt, Settings, FolderTree, LogOut, X, ChevronRight, ChevronDown, History, ShoppingCart, Globe, PackageCheck, Gamepad2 } from "lucide-react"

export default function AdminSidebar({
  onCloseMobile,
  logoUrl
}: {
  onCloseMobile?: () => void,
  logoUrl?: string
}) {
  const pathname = usePathname()
  const DEFAULT_LOGO = "https://placehold.co/400x120/e2e8f0/1e293b?text=No+Image";
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Quản lý User", icon: Users },
    { href: "/admin/sellers", label: "Quản lý Seller", icon: Users },
    {
      href: "/admin/categories",
      label: "Danh mục",
      icon: FolderTree,
    },
    {
      href: "/admin/products",
      label: "Sản phẩm",
      icon: ShoppingBag,
      subItems: [
        { href: "/admin/products", label: "Tất cả sản phẩm" },
        { href: "/admin/products/play", label: "Tài khoản Play" },
        { href: "/admin/products/random", label: "Tài khoản Random" },
      ]
    },
    {
      href: ADMIN_ROUTES.SERVICES.path,
      label: "Dịch vụ Game",
      icon: PackageCheck,
      subItems: [
        { href: ADMIN_ROUTES.SERVICES.path, label: "Tất cả dịch vụ" },
        { href: ADMIN_ROUTES.SERVICES_ORDERS.path, label: "Đơn hàng dịch vụ" },
      ]
    },
    {
      href: ADMIN_ROUTES.HACKS.path,
      label: "Hack Tools",
      icon: Gamepad2,
    },
    {
      href: "/admin/history",
      label: "LỊCH SỬ",
      icon: History,
      subItems: [
        { href: "/admin/transactions/history", label: "Lịch Sử Giao Dịch" },
        { href: "/admin/transactions", label: "Lịch Sử Đơn Hàng" },
        { href: "/admin/withdrawals", label: "Lịch Sử Thanh Toán" },
        { href: "/admin/accounts", label: "Lịch Sử Bán Acc" },
        { href: "/admin/deposits/bank", label: "Lịch Sử Nạp Bank" },
        { href: "/admin/deposits/card", label: "Lịch Sử Nạp Card" },
        { href: ADMIN_ROUTES.TOPUPS.path, label: "Lịch Sử Nạp Gói" },
      ]
    },
    {
      href: "/admin/settings",
      label: "Cài đặt",
      icon: Settings,
      subItems: [
        { href: "/admin/settings", label: "Cấu Hình Chung" },
        { href: "/admin/settings/notifications", label: "Cấu Hình Thông Báo" },
        { href: "/admin/settings/seller", label: "Cấu Hình Seller" },
        { href: "/admin/settings/banks", label: "Cấu Hình Nạp Bank" },
        { href: "/admin/settings/cards", label: "Cấu Hình Nạp Card" },
        { href: "/admin/settings/napgame", label: "Cấu Hình Nạp Gói" },
        { href: "/admin/settings/branding", label: "Giao diện & Branding" },
        { href: "/admin/settings/system", label: "Trạng thái hệ thống" }
      ]
    },
  ]

  // Automatically expand the menu if we are currently inside it
  useEffect(() => {
    const currentPaths = links
      .filter(l => l.subItems && (
        pathname === l.href ||
        (pathname.startsWith(l.href) && l.href !== "/admin") ||
        l.subItems.some(si => pathname === si.href || pathname.startsWith(si.href))
      ))
      .map(l => l.href)

    setExpandedMenus(prev => {
      const newMenus = [...prev]
      currentPaths.forEach(p => {
        if (!newMenus.includes(p)) newMenus.push(p)
      })
      return newMenus
    })
  }, [pathname])

  const toggleExpand = (e: React.MouseEvent, href: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      e.preventDefault() // Prevent navigation when clicking the parent link if it acts as a toggle
      setExpandedMenus(prev =>
        prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
      )
    } else {
      if (onCloseMobile) onCloseMobile()
    }
  }

  return (
    <aside className="w-full md:w-[280px] border-r border-border p-4 md:p-6 flex flex-col bg-card h-full overflow-hidden">
      <div className="flex items-start justify-between mb-8">
        <Link href="/" className="block group" onClick={onCloseMobile}>
          <div className="relative h-8 w-auto transition-all duration-300 group-hover:opacity-80 active:scale-95 mb-1.5">
            <Image
              src={logoUrl ? `${logoUrl}?v=1` : DEFAULT_LOGO}
              alt="ShopOnePlay Logo"
              height={100}
              width={180}
              priority
              unoptimized={true}
              className="h-8 w-auto object-contain"
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-foreground/90 text-background px-2 py-1 rounded-md inline-block">Admin Panel</span>
        </Link>
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1 text-rose-500 hover:text-rose-400 transition-colors active:scale-95"
        >
          <X className="w-7 h-7" strokeWidth={2.5} />
        </button>
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => {
          const isSubItemActive = !!link.subItems?.some(si => pathname === si.href || pathname.startsWith(si.href));
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin") || isSubItemActive;
          const isExpanded = expandedMenus.includes(link.href);
          const hasSubItems = !!link.subItems && link.subItems.length > 0;

          return (
            <div key={link.href} className="space-y-1">
              <Link
                href={link.href}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all duration-200 group",
                  isActive && !hasSubItems
                    ? "bg-foreground text-background font-bold shadow-lg shadow-foreground/10"
                    : isActive && hasSubItems
                      ? "bg-secondary text-foreground font-bold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground font-bold"
                )}
                onClick={(e) => toggleExpand(e, link.href, hasSubItems)}
              >
                <div className="flex items-center space-x-3">
                  <link.icon className={cn("w-5 h-5", isActive && !hasSubItems ? "text-background" : "text-current")} />
                  <span className="uppercase tracking-widest text-[11px]">{link.label}</span>
                </div>
                {hasSubItems && (
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isExpanded ? "rotate-90" : "",
                    isActive && !hasSubItems ? "text-background/50" : "text-muted-foreground opacity-50 group-hover:opacity-100"
                  )} />
                )}
              </Link>

              {/* Sub Items Dropdown */}
              {hasSubItems && isExpanded && (
                <div className="pl-4 pr-2 py-1 space-y-1 animate-in slide-in-from-top-2 opacity-100 duration-200">
                  {link.subItems!.map(subItem => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-200",
                          isSubActive
                            ? "text-foreground bg-secondary font-bold"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-bold"
                        )}
                        onClick={onCloseMobile}
                      >
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-200",
                          isSubActive ? "bg-foreground scale-110" : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                        )} />
                        <span className="uppercase tracking-widest text-[9px]">{subItem.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="pt-6 border-t border-border mt-auto">
        <Link href="/" className="flex items-center space-x-3 p-3 font-bold text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="uppercase tracking-widest text-[11px]">Về Cửa Hàng</span>
        </Link>
      </div>
    </aside>
  )
}
