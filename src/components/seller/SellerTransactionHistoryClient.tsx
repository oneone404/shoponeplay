"use client"

import { useMemo, useState } from "react"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import AdminHeader from "@/components/admin/AdminHeader"

interface Transaction {
  id: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  type: string
  description: string | null
  createdAt: string
}

interface SellerTransactionHistoryClientProps {
  initialTransactions: Transaction[]
}

export default function SellerTransactionHistoryClient({
  initialTransactions
}: SellerTransactionHistoryClientProps) {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return initialTransactions.filter((tx) => {
      return !keyword ||
        tx.id.toLowerCase().includes(keyword) ||
        tx.description?.toLowerCase().includes(keyword)
    })
  }, [initialTransactions, search])

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const currentTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "SALE_REVENUE": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
      case "PURCHASE": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "WITHDRAW": return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      case "REFUND": return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "ADMIN_ADD": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
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
        subtitle="Theo dõi toàn bộ biến động số dư cá nhân của bạn"
      />

      {/* Filter */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Tìm Theo Mã, Email, Nội dung..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-bold"
        />
      </div>

      {/* Table Area */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mã GD / Ngày tạo</th>
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
                        <div className="flex items-center gap-1.5 text-[10px] text-foreground/70 font-bold">
                          <Calendar className="w-3 h-3" />
                          {new Date(tx.createdAt).toLocaleString('vi-VN')}
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
                      <p className="text-[9px] text-foreground/70 mt-0.5 tabular-nums font-bold">
                        Trước: {new Intl.NumberFormat('vi-VN').format(tx.balanceBefore)} VND
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        {new Intl.NumberFormat('vi-VN').format(tx.balanceAfter)}
                      </span>
                      <p className="text-[9px] text-foreground/70 mt-0.5 font-bold uppercase tracking-widest">VND</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-[250px]">
                        <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <p className="text-[10px] text-foreground/70 italic leading-snug line-clamp-2 font-bold">
                          {tx.description || "Không có nội dung"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
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

        {/* Pagination Area */}
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
