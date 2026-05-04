"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  ChevronDown,
  Filter,
  Search,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Calendar,
  User as UserIcon,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react"
import Link from "next/link"
import AdminHeader from "../AdminHeader"
import { cn } from "@/lib/utils"

interface OrderItem {
  id: string
  titleSnapshot: string
  quantity: number
  priceAtPurchase: number
}

interface Order {
  id: string
  totalAmount: number
  status: "PENDING" | "COMPLETED" | "CANCELLED"
  createdAt: string
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
  items: {
    titleSnapshot: string
  }[]
  _count?: {
    items: number
  }
}

interface AdminTransactionsClientProps {
  initialOrders: Order[]
}

export default function AdminTransactionsClient({
  initialOrders
}: AdminTransactionsClientProps) {
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "PENDING" | "COMPLETED" | "CANCELLED">("ALL")
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const statusDropdownRef = useRef<HTMLDivElement | null>(null)

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return initialOrders.filter((order) => {
      const matchesSearch = !keyword ||
        order.id.toLowerCase().includes(keyword) ||
        order.user.email?.toLowerCase().includes(keyword) ||
        order.user.name?.toLowerCase().includes(keyword)

      const matchesStatus = selectedStatus === "ALL" || order.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [initialOrders, search, selectedStatus])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem)

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
    total: initialOrders.length,
    completed: initialOrders.filter(o => o.status === "COMPLETED").length,
    revenue: initialOrders.filter(o => o.status === "COMPLETED").reduce((acc, o) => acc + o.totalAmount, 0)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "PENDING":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-3.5 h-3.5" />
      case "PENDING":
        return <Clock className="w-3.5 h-3.5" />
      case "CANCELLED":
        return <XCircle className="w-3.5 h-3.5" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Quản Lý Đơn Hàng"
        subtitle="Quản lý toàn bộ lịch sử giao dịch mua sắm trên hệ thống"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Tổng đơn hàng", value: stats.total, icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Hoàn tất", value: stats.completed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Doanh thu hệ thống", value: `${new Intl.NumberFormat('vi-VN').format(stats.revenue)} VND`, icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
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
            placeholder="Tìm Theo Mã Đơn, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="px-4 py-3 bg-card border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 hover:bg-secondary transition-all shadow-sm min-w-[180px]"
            >
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-left uppercase text-[10px] tracking-widest font-bold">
                {selectedStatus === "ALL" ? "Tất cả trạng thái" :
                  selectedStatus === "PENDING" ? "Chờ xử lý" :
                    selectedStatus === "COMPLETED" ? "Hoàn tất" : "Đã hủy"}
              </span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isStatusOpen && "rotate-180")} />
            </button>

            {isStatusOpen && (
              <div className="absolute top-full right-0 mt-2 w-full bg-card border border-border rounded-xl shadow-xl z-10 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
                {["ALL", "PENDING", "COMPLETED", "CANCELLED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status as any)
                      setIsStatusOpen(false)
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-[10px] font-bold transition-colors uppercase tracking-widest",
                      selectedStatus === status ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
                    )}
                  >
                    {status === "ALL" ? "Tất cả trạng thái" :
                      status === "PENDING" ? "Chờ xử lý" :
                        status === "COMPLETED" ? "Hoàn tất" : "Đã hủy"}
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
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Khách Hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Sản phẩm</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tổng Thanh Toán</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Trạng Thái</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4">
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary border border-border overflow-hidden shrink-0 relative">
                          {order.user.image ? (
                            <img
                              src={order.user.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <UserIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-bold text-foreground truncate">{order.user.name || "Khách hàng"}</p>
                          <p className="text-[10px] font-medium text-muted-foreground truncate">{order.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1.5 min-w-[120px]">
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
                      <p className="text-sm font-bold text-foreground">
                        {new Intl.NumberFormat('vi-VN').format(order.totalAmount)} VND
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                        getStatusStyle(order.status)
                      )}>
                        {getStatusIcon(order.status)}
                        {order.status === "COMPLETED" ? "HOÀN TẤT" :
                          order.status === "PENDING" ? "CHỜ XỬ LÝ" : "ĐÃ HỦY"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-2 inline-flex items-center justify-center bg-card border border-border hover:bg-secondary/80 text-foreground rounded-lg transition-all active:scale-95 shadow-sm group/btn"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <ShoppingCart className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Không tìm thấy đơn hàng nào</p>
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
