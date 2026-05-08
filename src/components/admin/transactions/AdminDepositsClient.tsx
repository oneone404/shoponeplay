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
  CreditCard,
  Filter,
  ChevronDown,
  Copy
} from "lucide-react"
import Image from "next/image"
import AdminHeader from "../AdminHeader"
import { cn } from "@/lib/utils"

interface Deposit {
  id: string
  amount: number
  status: string
  createdAt: string
  // Bank fields
  bankName?: string
  transactionId?: string
  description?: string
  // Card fields
  cardType?: string
  serial?: string
  pin?: string
  declaredValue?: number
  realValue?: number
  requestId?: string
  note?: string | null
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
}

interface AdminDepositsClientProps {
  initialDeposits: Deposit[]
  type: "BANK" | "CARD"
}

export default function AdminDepositsClient({
  initialDeposits,
  type
}: AdminDepositsClientProps) {
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const statusDropdownRef = useRef<HTMLDivElement | null>(null)

  const filteredDeposits = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return initialDeposits.filter((dep) => {
      const matchesSearch = !keyword ||
        dep.id.toLowerCase().includes(keyword) ||
        dep.user.email?.toLowerCase().includes(keyword) ||
        dep.user.name?.toLowerCase().includes(keyword)

      const matchesStatus = selectedStatus === "ALL" || dep.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [initialDeposits, search, selectedStatus])

  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage)
  const currentDeposits = filteredDeposits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedStatus])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!statusDropdownRef.current?.contains(event.target as Node)) setIsStatusOpen(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const stats = {
    total: initialDeposits.length,
    completed: initialDeposits.filter(d => d.status === "COMPLETED").length,
    amount: initialDeposits.filter(d => d.status === "COMPLETED").reduce((acc, d) => acc + d.amount, 0)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      default: return "bg-rose-500/10 text-rose-500 border-rose-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={type === "BANK" ? "Lịch Sử Nạp Bank" : "Lịch Sử Nạp Card"}
        subtitle={type === "BANK" ? "Quản lý các giao dịch nạp tiền qua tài khoản ngân hàng" : "Quản lý các giao dịch nạp tiền qua thẻ cào điện thoại"}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Tổng giao dịch", value: stats.total, icon: Wallet, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Thành công", value: stats.completed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Tổng tiền nạp", value: `${new Intl.NumberFormat('vi-VN').format(stats.amount)} VND`, icon: CreditCard, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Tìm Theo Mã, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-bold"
          />
        </div>

        <div className="relative" ref={statusDropdownRef}>
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="px-4 py-3 bg-card border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 hover:bg-secondary transition-all shadow-sm min-w-[160px]"
          >
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-left uppercase text-[10px] tracking-widest font-bold">
              {selectedStatus === "ALL" ? "Tất cả trạng thái" :
                selectedStatus === "COMPLETED" ? "Hoàn tất" :
                  selectedStatus === "PENDING" ? "Đang chờ" : "Đã hủy"}
            </span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isStatusOpen && "rotate-180")} />
          </button>
          {isStatusOpen && (
            <div className="absolute top-full right-0 mt-2 w-full bg-card border border-border rounded-xl shadow-xl z-10 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
              {["ALL", "COMPLETED", "PENDING", "CANCELLED"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setSelectedStatus(s); setIsStatusOpen(false); }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-[10px] font-bold transition-colors uppercase tracking-widest",
                    selectedStatus === s ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
                  )}
                >
                  {s === "ALL" ? "Tất cả trạng thái" :
                    s === "COMPLETED" ? "Hoàn tất" :
                      s === "PENDING" ? "Đang chờ" : "Đã hủy"}
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
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Giao Dịch / Ngày tạo</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Khách Hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Số Tiền</th>
                {type === "BANK" && (
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Thông Tin Bank</th>
                )}
                {type === "CARD" && (
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Thông Tin Thẻ</th>
                )}
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ghi Chú</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[11px] font-bold">
              {currentDeposits.length > 0 ? (
                currentDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">#{dep.id.slice(-12).toUpperCase()}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(dep.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary border border-border overflow-hidden shrink-0 relative">
                          {dep.user.image ? (
                            <Image
                              src={dep.user.image}
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
                          <p className="text-xs font-bold text-foreground truncate">{dep.user.name || "Khách hàng"}</p>
                          <p className="text-[10px] font-medium text-muted-foreground truncate">{dep.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">
                          +{new Intl.NumberFormat('vi-VN').format(dep.amount)} VND
                        </p>
                        {type === "CARD" && dep.declaredValue && (
                          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                            Mệnh giá: {new Intl.NumberFormat('vi-VN').format(dep.declaredValue)} VND
                          </p>
                        )}
                      </div>
                    </td>
                    {type === "BANK" && (
                      <td className="px-6 py-4">
                        <div className="space-y-1 min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-bold uppercase">{dep.bankName || "N/A"}</span>
                            <span className="text-[10px] text-foreground font-mono font-bold truncate">{dep.transactionId || "No ID"}</span>
                            {dep.transactionId && (
                              <button 
                                onClick={() => { navigator.clipboard.writeText(dep.transactionId || ""); }}
                                className="p-1 hover:text-primary transition-colors text-muted-foreground"
                                title="Copy Trans ID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          {dep.description && (
                            <p className="text-[10px] text-muted-foreground italic truncate max-w-[200px]" title={dep.description}>
                              "{dep.description}"
                            </p>
                          )}
                        </div>
                      </td>
                    )}
                    {type === "CARD" && (
                      <td className="px-6 py-4">
                        <div className="space-y-1.5 min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase">{dep.cardType || "N/A"}</span>
                            <span className="text-[10px] text-muted-foreground font-mono truncate">{dep.serial}</span>
                            <button 
                              onClick={() => { navigator.clipboard.writeText(dep.serial || ""); }}
                              className="p-1 hover:text-primary transition-colors"
                              title="Copy Serial"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter shrink-0 w-8">PIN:</span>
                            <span className="text-[10px] text-foreground font-mono font-bold truncate">{dep.pin}</span>
                            <button 
                              onClick={() => { navigator.clipboard.writeText(dep.pin || ""); }}
                              className="p-1 hover:text-primary transition-colors"
                              title="Copy PIN"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      {dep.note ? (
                        <p className="text-[10px] text-rose-500 font-bold max-w-[200px] break-words">
                          {dep.note}
                        </p>
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                        getStatusStyle(dep.status)
                      )}>
                        {dep.status === "COMPLETED" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {dep.status}
                      </span>
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
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Không có dữ liệu nạp tiền</p>
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
