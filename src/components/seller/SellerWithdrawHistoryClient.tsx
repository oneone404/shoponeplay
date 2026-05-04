"use client"

import { useMemo, useState, useEffect } from "react"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Building2,
  CreditCard,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History
} from "lucide-react"
import { cn } from "@/lib/utils"
import AdminHeader from "@/components/admin/AdminHeader"

interface Withdrawal {
  id: string
  amount: number
  bankName: string
  accountNumber: string
  accountName: string
  status: string
  createdAt: string
}

interface SellerWithdrawHistoryClientProps {
  initialWithdrawals: Withdrawal[]
}

export default function SellerWithdrawHistoryClient({
  initialWithdrawals
}: SellerWithdrawHistoryClientProps) {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredWithdrawals = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return initialWithdrawals.filter((item) => {
      return !keyword ||
        item.id.toLowerCase().includes(keyword) ||
        item.bankName.toLowerCase().includes(keyword) ||
        item.accountNumber.toLowerCase().includes(keyword)
    })
  }, [initialWithdrawals, search])

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage)
  const currentItems = filteredWithdrawals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "COMPLETED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "REJECTED":
      case "CANCELLED": return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="w-3.5 h-3.5" />
      case "COMPLETED": return <CheckCircle2 className="w-3.5 h-3.5" />
      case "REJECTED":
      case "CANCELLED": return <XCircle className="w-3.5 h-3.5" />
      default: return <AlertCircle className="w-3.5 h-3.5" />
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case "PENDING": return "ĐANG CHỜ"
      case "COMPLETED": return "HOÀN TẤT"
      case "REJECTED": return "TỪ CHỐI"
      case "CANCELLED": return "ĐÃ HỦY"
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Lịch Sử Thanh Toán"
        subtitle="Theo dõi trạng thái các yêu cầu rút tiền về tài khoản ngân hàng"
      />

      {/* Filter Area */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Tìm Theo Ngân Hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        />
      </div>

      {/* Table Area */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mã Yêu Cầu / Ngày tạo</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Thông Tin Nhận Tiền</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Số Tiền</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">#{item.id.slice(-10).toUpperCase()}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-foreground">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                          {item.bankName}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                          <CreditCard className="w-3.5 h-3.5 opacity-50" />
                          {item.accountNumber}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                          <User className="w-3.5 h-3.5 opacity-50" />
                          {item.accountName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-foreground tabular-nums">
                        {new Intl.NumberFormat('vi-VN').format(item.amount)} VND
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest",
                        getStatusStyle(item.status)
                      )}>
                        {getStatusIcon(item.status)}
                        {getStatusName(item.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <History className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Không có lịch sử rút tiền</p>
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
