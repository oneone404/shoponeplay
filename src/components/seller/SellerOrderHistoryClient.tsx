"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Package,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Timer,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import AdminHeader from "@/components/admin/AdminHeader"
import Link from "next/link"

interface Order {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
  items: {
    titleSnapshot: string
  }[]
  _count: {
    items: number
  }
}

interface Stats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}

interface SellerOrderHistoryClientProps {
  initialOrders: Order[]
  stats: Stats
}

export default function SellerOrderHistoryClient({
  initialOrders,
  stats
}: SellerOrderHistoryClientProps) {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const itemsPerPage = 15
  const statusDropdownRef = useRef<HTMLDivElement>(null)

  // Logic đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!statusDropdownRef.current?.contains(event.target as Node)) {
        setIsStatusOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return initialOrders.filter((order) => {
      const matchSearch = !keyword ||
        order.id.toLowerCase().includes(keyword)
      
      const matchStatus = selectedStatus === "ALL" || order.status === selectedStatus
      
      return matchSearch && matchStatus
    })
  }, [initialOrders, search, selectedStatus])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "COMPLETED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "CANCELLED": return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="w-3.5 h-3.5" />
      case "COMPLETED": return <CheckCircle2 className="w-3.5 h-3.5" />
      case "CANCELLED": return <XCircle className="w-3.5 h-3.5" />
      default: return null
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case "PENDING": return "CHỜ XỬ LÝ"
      case "COMPLETED": return "HOÀN TẤT"
      case "CANCELLED": return "ĐÃ HỦY"
      default: return status
    }
  }

  const summaryCards = [
    {
      label: "Tổng đơn hàng",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Hoàn tất",
      value: initialOrders.filter(o => o.status === "COMPLETED").length.toLocaleString(),
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Doanh thu",
      value: `${new Intl.NumberFormat('vi-VN').format(stats.totalRevenue)} VND`,
      icon: Calendar,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ]

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Lịch Sử Đơn Hàng"
        subtitle="Quản lý toàn bộ đơn hàng có chứa sản phẩm của bạn"
      />

      {/* Stats Cards - Matching Admin 100% */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", card.bg)}>
              <card.icon className={cn("w-6 h-6", card.color)} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{card.label}</p>
              <p className="text-xl font-bold text-foreground">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Tìm Theo Mã Đơn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="px-4 py-3 bg-card border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 hover:bg-secondary transition-all shadow-sm min-w-[180px]"
            >
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-left uppercase text-[10px] tracking-widest font-bold">
                {selectedStatus === "ALL" ? "Tất cả trạng thái" : getStatusName(selectedStatus)}
              </span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isStatusOpen && "rotate-180")} />
            </button>

            {isStatusOpen && (
              <div className="absolute top-full right-0 mt-2 w-full bg-card border border-border rounded-xl shadow-xl z-10 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
                {["ALL", "PENDING", "COMPLETED", "CANCELLED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status)
                      setIsStatusOpen(false)
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-[10px] font-bold transition-colors uppercase tracking-widest",
                      selectedStatus === status ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
                    )}
                  >
                    {status === "ALL" ? "Tất cả trạng thái" : getStatusName(status)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mã Đơn / Ngày tạo</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center text-nowrap">Sản phẩm</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tổng Thanh Toán</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Trạng Thái</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4 text-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors">#{order.id.slice(-12).toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1.5 min-w-[200px]">
                        <span className="text-[11px] font-bold text-foreground text-center line-clamp-1">
                          {order.items?.[0]?.titleSnapshot || "N/A"}
                        </span>
                        {(order._count?.items || 0) > 1 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold">
                            +{(order._count?.items || 0) - 1} Sản Phẩm Khác
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-foreground text-nowrap">
                        {new Intl.NumberFormat('vi-VN').format(order.totalAmount)} VND
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                        getStatusStyle(order.status)
                      )}>
                        {getStatusIcon(order.status)}
                        {getStatusName(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-nowrap">
                      <Link
                        href={`/seller/transactions/order/${order.id}`}
                        className="p-2 inline-flex items-center justify-center bg-card border border-border hover:bg-secondary/80 text-foreground rounded-lg transition-all active:scale-95 shadow-sm group/btn"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <Package className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Không có dữ liệu đơn hàng</p>
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
