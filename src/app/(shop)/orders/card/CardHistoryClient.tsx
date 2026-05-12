"use client"

import { useEffect, useState, useMemo } from "react"
import {
  CreditCard,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader2,
  SearchX,
  History as HistoryIcon,
  Tag,
  Hash,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import Navbar from "@/components/layouts/Navbar"
import UserPageHeader from "@/components/shared/UserPageHeader"

const TELCOS = [
  { id: "VIETTEL", name: "Viettel", logo: "/images/networks/viettel.svg" },
  { id: "MOBIFONE", name: "Mobifone", logo: "/images/networks/mobifone.svg" },
  { id: "VINAPHONE", name: "Vinaphone", logo: "/images/networks/vinaphone.svg" },
  { id: "ZING", name: "Zing", logo: "/images/networks/zing.svg" },
  { id: "GARENA", name: "Garena", logo: "/images/networks/garena.svg" },
]

interface CardDeposit {
  id: string
  cardType: string
  serial: string
  pin: string
  declaredValue: number
  amount: number | null
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED"
  note: string | null
  createdAt: string
}

export default function CardHistoryClient() {
  const [loading, setLoading] = useState(true)
  const [deposits, setDeposits] = useState<CardDeposit[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/user/history/card")
      const data = await res.json()
      if (data.success) setDeposits(data.deposits)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDeposits = useMemo(() => {
    return deposits.filter(d =>
      d.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.cardType.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [deposits, searchQuery])

  // Pagination Logic
  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDeposits.slice(indexOfFirstItem, indexOfLastItem)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
          label: "Thành công"
        }
      case "FAILED":
      case "CANCELLED":
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: "text-rose-500",
          bg: "bg-rose-500/10",
          label: "Thất bại"
        }
      default:
        return {
          icon: <Clock3 className="w-4 h-4 animate-pulse" />,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          label: "Chờ duyệt"
        }
    }
  }

  const stats = {
    total: deposits.length,
    actual: deposits.filter(d => d.status === "COMPLETED").reduce((acc, d) => acc + (d.amount || 0), 0),
    failed: deposits.filter(d => d.status === "FAILED").length
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <UserPageHeader
        subtitle="Quản Lý Lịch Sử Nạp Thẻ Cào"
        title="LỊCH SỬ"
        highlightTitle="NẠP CARD"
      />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SummaryCard label="Tổng thẻ gửi" value={stats.total.toLocaleString("vi-VN")} icon={<HistoryIcon className="w-5 h-5" />} color="text-primary" />
          <SummaryCard label="Thực nhận" value={stats.actual.toLocaleString("vi-VN") + " VND"} icon={<CreditCard className="w-5 h-5" />} color="text-emerald-500" />
          <SummaryCard label="Thẻ nạp lỗi" value={stats.failed.toLocaleString("vi-VN")} icon={<AlertTriangle className="w-5 h-5" />} color="text-rose-500" />
        </div>

        {/* Table Container */}
        <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Filter Bar */}
          <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
              <input
                type="text"
                placeholder="Tìm Seri, Mã Thẻ, Nhà Mạng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm font-bold outline-none focus:border-primary/50 transition-colors shadow-sm"
              />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">
              Kết quả: {filteredDeposits.length}
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
                    <th className="px-6 py-4 font-bold">Nhà mạng / Seri</th>
                    <th className="px-6 py-4 font-bold">Mệnh giá / Thực nhận</th>
                    <th className="px-6 py-4 font-bold text-center">Thời gian</th>
                    <th className="px-6 py-4 font-bold text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-4 rounded-full bg-secondary">
                            <SearchX className="w-8 h-8 text-muted-foreground opacity-20" />
                          </div>
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Không tìm thấy giao dịch nào</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item) => {
                      const style = getStatusStyle(item.status)
                      const telco = TELCOS.find(t => t.id === item.cardType.toUpperCase())
                      return (
                        <tr key={item.id} className="hover:bg-secondary/20 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 aspect-video rounded-lg bg-background border border-border/50 flex items-center justify-center p-1.5 shadow-sm overflow-hidden shrink-0">
                                {telco ? (
                                  <img src={telco.logo} alt={telco.name} className="w-full h-full object-contain" />
                                ) : (
                                  <CreditCard className="w-4 h-4 text-primary/40" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">S: {item.serial}</span>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">M: {item.pin.substring(0, 4)}****</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">{item.declaredValue.toLocaleString("vi-VN")} VND</span>
                              {item.status === "COMPLETED" && (
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                                  Nhận: {item.amount?.toLocaleString("vi-VN")} VND
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-secondary/50 rounded-lg border border-border text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5 opacity-50" />
                              <span className="text-[10px] font-bold">
                                {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <div className={cn(
                                "inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider",
                                style.bg, style.color, "border-current/10"
                              )}>
                                {style.icon}
                                <span>{style.label}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })
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
            <HistoryIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
              Vui lòng kiểm tra kỹ <span className="text-primary">Mã thẻ & Seri</span> trước khi gửi.
              Thẻ sai mệnh giá sẽ bị trừ 100% giá trị hoặc không được chấp nhận.
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
