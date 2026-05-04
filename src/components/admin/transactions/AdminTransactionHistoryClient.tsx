"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User as UserIcon,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  ChevronDown,
  Info
} from "lucide-react"
import Image from "next/image"
import AdminHeader from "../AdminHeader"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  type: string
  status: string
  description: string | null
  createdAt: string
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
}

interface AdminTransactionHistoryClientProps {
  initialTransactions: Transaction[]
}

export default function AdminTransactionHistoryClient({
  initialTransactions
}: AdminTransactionHistoryClientProps) {
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState<string>("ALL")
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const typeDropdownRef = useRef<HTMLDivElement | null>(null)

  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return initialTransactions.filter((tx) => {
      const matchesSearch = !keyword ||
        tx.id.toLowerCase().includes(keyword) ||
        tx.user.email?.toLowerCase().includes(keyword) ||
        tx.user.name?.toLowerCase().includes(keyword) ||
        tx.description?.toLowerCase().includes(keyword)

      const matchesType = selectedType === "ALL" || tx.type === selectedType

      return matchesSearch && matchesType
    })
  }, [initialTransactions, search, selectedType])

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const currentTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedType])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!typeDropdownRef.current?.contains(event.target as Node)) setIsTypeOpen(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "DEPOSIT": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "PURCHASE": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "REFUND": return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "ADMIN_ADD": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "ADMIN_SUB": return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      case "SALE_REVENUE": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "DEPOSIT": return "NẠP TIỀN"
      case "PURCHASE": return "MUA HÀNG"
      case "REFUND": return "HOÀN TIỀN"
      case "ADMIN_ADD": return "CỘNG TIỀN"
      case "ADMIN_SUB": return "TRỪ TIỀN"
      case "WITHDRAW": return "RÚT TIỀN"
      case "SALE_REVENUE": return "DOANH THU"
      default: return type
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Lịch Sử Giao Dịch"
        subtitle="Theo dõi toàn bộ biến động số dư của hệ thống"
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Tìm Theo Mã, Email, Nội dung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-bold"
          />
        </div>

        <div className="relative" ref={typeDropdownRef}>
          <button
            onClick={() => setIsTypeOpen(!isTypeOpen)}
            className="px-4 py-3 bg-card border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 hover:bg-secondary transition-all shadow-sm min-w-[200px]"
          >
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-left uppercase text-[10px] tracking-widest font-bold">
              {selectedType === "ALL" ? "Tất cả loại giao dịch" : getTypeName(selectedType)}
            </span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isTypeOpen && "rotate-180")} />
          </button>
          {isTypeOpen && (
            <div className="absolute top-full right-0 mt-2 w-full bg-card border border-border rounded-xl shadow-xl z-10 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
              {["ALL", "DEPOSIT", "PURCHASE", "REFUND", "ADMIN_ADD", "ADMIN_SUB", "WITHDRAW"].map((t) => (
                <button
                  key={t}
                  onClick={() => { setSelectedType(t); setIsTypeOpen(false); }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-[10px] font-bold transition-colors uppercase tracking-widest",
                    selectedType === t ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
                  )}
                >
                  {t === "ALL" ? "Tất cả loại giao dịch" : getTypeName(t)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mã GD / Ngày tạo</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Khách Hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Loại GD</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Biến Động</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Số Dư Sau</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nội Dung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[11px] font-bold">
              {currentTransactions.length > 0 ? (
                currentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">#{tx.id.slice(-12).toUpperCase()}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(tx.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary border border-border overflow-hidden shrink-0 relative">
                          {tx.user.image ? (
                            <Image src={tx.user.image} alt="" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <UserIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-foreground truncate">{tx.user.name || "Khách hàng"}</p>
                          <p className="text-[9px] font-medium text-muted-foreground truncate">{tx.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded-lg text-[9px] font-bold border uppercase tracking-widest",
                        getTypeStyle(tx.type)
                      )}>
                        {getTypeName(tx.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={cn(
                          "text-sm font-bold tabular-nums",
                          tx.amount > 0 ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {tx.amount > 0 ? "+" : ""}{new Intl.NumberFormat('vi-VN').format(tx.amount)}
                        </span>
                        {tx.amount > 0 ? (
                          <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <ArrowDownLeft className="w-3 h-3 text-rose-500" />
                        )}
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-0.5 tabular-nums">
                        Trước: {new Intl.NumberFormat('vi-VN').format(tx.balanceBefore)} VND
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        {new Intl.NumberFormat('vi-VN').format(tx.balanceAfter)}
                      </span>
                      <p className="text-[9px] text-muted-foreground mt-0.5 font-bold uppercase tracking-widest">VND</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <p className="text-[10px] text-muted-foreground italic leading-snug line-clamp-2">
                          {tx.description || "Không có nội dung"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <Wallet className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Không có dữ liệu giao dịch</p>
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
