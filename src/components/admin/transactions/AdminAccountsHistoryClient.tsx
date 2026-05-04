"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User as UserIcon,
  Package,
  Copy,
  Check,
  Calendar,
  ExternalLink,
  ChevronUp,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import AdminHeader from "../AdminHeader"
import { cn } from "@/lib/utils"

interface AccountHistory {
  id: string
  username: string
  password: string
  extraInfo: string | null
  soldAt: string | null
  product: {
    title: string
    id: string
  }
  orderItem: {
    order: {
      id: string
      user: {
        name: string | null
        email: string | null
        image: string | null
      }
    }
  } | null
}

interface AdminAccountsHistoryClientProps {
  initialAccounts: AccountHistory[]
}

export default function AdminAccountsHistoryClient({
  initialAccounts
}: AdminAccountsHistoryClientProps) {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Nhóm các tài khoản theo mã đơn hàng
  const groupedAccounts = useMemo(() => {
    const groups: Record<string, {
      orderId: string;
      order: any;
      soldAt: string | null;
      product: any;
      secrets: { username: string; password: string; id: string }[];
    }> = {}

    initialAccounts.forEach(acc => {
      const orderId = acc.orderItem?.order.id || "manual"
      if (!groups[orderId]) {
        groups[orderId] = {
          orderId,
          order: acc.orderItem?.order,
          soldAt: acc.soldAt,
          product: acc.product,
          secrets: []
        }
      }
      groups[orderId].secrets.push({
        username: acc.username,
        password: acc.password,
        id: acc.id
      })
    })

    return Object.values(groups)
  }, [initialAccounts])

  const filteredAccounts = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return groupedAccounts.filter((group) => {
      return !keyword ||
        group.orderId.toLowerCase().includes(keyword) ||
        group.product.title.toLowerCase().includes(keyword) ||
        group.order.user.email?.toLowerCase().includes(keyword) ||
        group.secrets.some(s => s.username.toLowerCase().includes(keyword))
    })
  }, [groupedAccounts, search])

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAccounts = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Lịch Sử Bán Tài Khoản"
        subtitle="Quản lý chi tiết các tài khoản đã bàn giao cho khách hàng"
      />

      {/* Search Area */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Tìm Theo Tài Khoản, Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        />
      </div>

      {/* Table Area */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm text-xs font-bold">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sản Phẩm / Đơn Hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tài Khoản</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Khách Hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Ngày Bán</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentAccounts.length > 0 ? (
                currentAccounts.map((group) => (
                   <tr key={group.orderId} className="hover:bg-secondary/20 transition-colors group">
                     <td className="px-6 py-4 max-w-[250px]">
                       <div className="space-y-1">
                         <div className="flex items-center gap-2">
                           <Package className="w-3.5 h-3.5 text-primary shrink-0" />
                           <span className="text-foreground truncate">{group.product.title}</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                           <span className="font-bold uppercase tracking-tighter">Đơn:</span>
                           <Link href={`/orders/${group.orderId}`} className="hover:text-primary flex items-center gap-1">
                             #{group.orderId.slice(-12).toUpperCase()}
                             <ExternalLink className="w-2.5 h-2.5" />
                           </Link>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="space-y-2">
                         {group.secrets.slice(0, expandedOrders[group.orderId] ? undefined : 1).map((s, idx) => (
                           <div key={s.id} className="bg-secondary/40 rounded-lg p-2.5 space-y-1 border border-border/50 relative group/item transition-all hover:bg-secondary/60">
                             <div className="absolute top-2 right-2 text-[8px] font-bold text-muted-foreground/30">#{idx + 1}</div>
                             
                             <div className="flex items-center gap-2">
                               <span className="font-mono text-foreground text-[11px] truncate flex-1 text-left">
                                 {s.username}
                               </span>
                               <button onClick={() => handleCopy(s.username, s.id + 'u')} className="p-1 text-muted-foreground hover:text-primary transition-all shrink-0">
                                 {copiedId === s.id + 'u' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                               </button>
                             </div>

                             <div className="flex items-center gap-2">
                               <span className="font-mono text-muted-foreground/70 text-[11px] truncate flex-1 text-left">
                                 {s.password}
                               </span>
                               <button onClick={() => handleCopy(s.password, s.id + 'p')} className="p-1 text-muted-foreground hover:text-primary transition-all shrink-0">
                                 {copiedId === s.id + 'p' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                               </button>
                             </div>
                           </div>
                         ))}

                         {group.secrets.length > 1 && (
                           <button
                             onClick={() => toggleOrder(group.orderId)}
                             className="w-full py-1.5 flex items-center justify-center gap-1.5 text-[9px] font-bold text-primary hover:bg-primary/5 rounded-lg border border-primary/20 border-dashed transition-all"
                           >
                             {expandedOrders[group.orderId] ? (
                               <>
                                 THU GỌN <ChevronUp className="w-3 h-3" />
                               </>
                             ) : (
                               <>
                                 XEM TẤT CẢ (+{group.secrets.length - 1}) <ChevronDown className="w-3 h-3" />
                               </>
                             )}
                           </button>
                         )}
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-secondary border border-border overflow-hidden shrink-0 relative">
                           {group.order.user.image ? (
                             <Image
                               src={group.order.user.image}
                               alt=""
                               fill
                               className="object-cover"
                             />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                               <UserIcon className="w-5 h-5" />
                             </div>
                           )}
                         </div>
                         <div className="min-w-0">
                           <p className="text-xs font-bold text-foreground truncate">{group.order.user.name || "Khách hàng"}</p>
                           <p className="text-[10px] font-medium text-muted-foreground truncate">{group.order.user.email}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-right whitespace-nowrap">
                       <div className="flex flex-col items-end gap-1 text-[10px] font-bold text-muted-foreground">
                         <div className="flex items-center gap-1.5">
                           <Calendar className="w-3 h-3" />
                           {group.soldAt ? new Date(group.soldAt).toLocaleString('vi-VN') : "---"}
                         </div>
                       </div>
                     </td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <Package className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Không tìm thấy tài khoản nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/30">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trang {currentPage} / {totalPages}</div>
            <div className="flex items-center space-x-2">
              <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"><ChevronsLeft className="w-4 h-4" /></button>
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-4 text-xs font-bold text-primary">{currentPage}</div>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"><ChevronsRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
