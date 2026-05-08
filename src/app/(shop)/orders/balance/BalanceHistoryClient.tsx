"use client"

import { useEffect, useState, useMemo } from "react"
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Calendar,
  Clock,
  Loader2,
  History as HistoryIcon,
  SearchX,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import Navbar from "@/components/layouts/Navbar"
import PageHeader from "@/components/shared/PageHeader"

interface Transaction {
  id: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  type: string
  description: string
  createdAt: string
}

export default function BalanceHistoryClient() {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/user/history/balance")
      const data = await res.json()
      if (data.success) setTransactions(data.transactions)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => 
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [transactions, searchQuery])

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const stats = {
    total: transactions.length,
    plus: transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0),
    minus: Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto space-y-6">
        <PageHeader
          subtitle="Theo Dõi Biến Động Tài Khoản"
          title="BIẾN ĐỘNG"
          highlightTitle="SỐ DƯ"
          className="!px-0"
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SummaryCard label="Tổng giao dịch" value={stats.total.toLocaleString("vi-VN")} icon={<HistoryIcon className="w-5 h-5" />} color="text-primary" />
          <SummaryCard label="Tổng tiền cộng" value={stats.plus.toLocaleString("vi-VN") + " VND"} icon={<ArrowUpRight className="w-5 h-5" />} color="text-emerald-500" />
          <SummaryCard label="Tổng tiền trừ" value={stats.minus.toLocaleString("vi-VN") + " VND"} icon={<ArrowDownLeft className="w-5 h-5" />} color="text-rose-500" />
        </div>

        {/* Table Container */}
        <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Filter Bar */}
          <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
              <input 
                type="text" 
                placeholder="Tìm Nội Dung, Mã Giao Dịch..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm font-bold outline-none focus:border-primary/50 transition-colors shadow-sm"
              />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">
              Kết quả: {filteredTransactions.length}
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold">Giao dịch</th>
                    <th className="px-6 py-4 font-bold">Nội dung</th>
                    <th className="px-6 py-4 font-bold text-center">Thời gian</th>
                    <th className="px-6 py-4 font-bold text-center">Số tiền</th>
                    <th className="px-6 py-4 font-bold text-right">Số dư cuối</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-4 rounded-full bg-secondary">
                            <SearchX className="w-8 h-8 text-muted-foreground opacity-20" />
                          </div>
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Không tìm thấy giao dịch nào</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((tx) => (
                      <tr key={tx.id} className="hover:bg-secondary/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              tx.amount > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                            )}>
                              {tx.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-foreground">#{tx.id.slice(-8).toUpperCase()}</span>
                              <span className={cn(
                                "text-[9px] font-bold uppercase tracking-wider",
                                tx.amount > 0 ? "text-emerald-500" : "text-rose-500"
                              )}>
                                {tx.amount > 0 ? "Cộng tiền" : "Trừ tiền"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-foreground/80 max-w-[300px] truncate uppercase">
                            {tx.description || "Giao dịch hệ thống"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="text-xs font-bold text-foreground">{format(new Date(tx.createdAt), 'dd/MM/yyyy')}</span>
                            <span className="text-[9px] font-bold text-muted-foreground">{format(new Date(tx.createdAt), 'HH:mm:ss')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "text-sm font-bold tabular-nums",
                            tx.amount > 0 ? "text-emerald-500" : "text-rose-500"
                          )}>
                            {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("vi-VN")} VND
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-bold text-foreground/70 tabular-nums">
                            {tx.balanceAfter.toLocaleString("vi-VN")} VND
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination - Synchronized with Orders */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/30">
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trang {currentPage} / {totalPages}</div>
              <div className="flex items-center space-x-2">
                <PaginationButton onClick={() => goToPage(1)} disabled={currentPage === 1} icon={<ChevronsLeft className="w-4 h-4" />} />
                <PaginationButton onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} icon={<ChevronLeft className="w-4 h-4" />} />
                <div className="w-8 h-8 flex items-center justify-center text-[10px] font-black text-primary bg-primary/10 rounded-lg">{currentPage}</div>
                <PaginationButton onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} icon={<ChevronRight className="w-4 h-4" />} />
                <PaginationButton onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} icon={<ChevronsRight className="w-4 h-4" />} />
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
              Dữ liệu biến động số dư được cập nhật thời gian thực. 
              Mọi thắc mắc vui lòng liên hệ <span className="text-primary underline cursor-pointer">Chăm sóc khách hàng</span>.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

function SummaryCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-xl font-bold mt-1.5 text-foreground tabular-nums tracking-tight">{value}</p>
        </div>
        <div className={cn("w-10 h-10 rounded-xl bg-secondary flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner", color)}>{icon}</div>
      </div>
    </div>
  )
}

function PaginationButton({ onClick, disabled, icon }: { onClick: () => void, disabled: boolean, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-8 h-8 flex items-center justify-center bg-card border border-border rounded-lg transition-all shadow-sm",
        disabled ? "opacity-20 cursor-not-allowed" : "hover:text-primary hover:border-primary/50 active:scale-90"
      )}
    >
      {icon}
    </button>
  )
}
