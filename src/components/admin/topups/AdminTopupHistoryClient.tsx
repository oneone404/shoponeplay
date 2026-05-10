"use client"

import { useState, useTransition, useMemo } from "react"
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft,
  ChevronsRight,
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  History,
  CreditCard,
  User as UserIcon,
  Gamepad2,
  Calendar,
  Ban,
  ChevronDown,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUI } from "@/providers/UIProvider"
import { retryTopupOrder } from "@/app/admin/settings/napgame/actions"
import { useRouter, useSearchParams } from "next/navigation"
import AdminHeader from "../AdminHeader"

interface TopupOrder {
  id: string
  userId: string
  roleId: string
  roleName: string
  serverId: string
  amount: number
  cardValue: number
  cardSerial: string | null
  cardPin: string | null
  vngProductId: string | null
  vngReturnCode: number | null
  status: string
  errorMessage: string | null
  statusLog: any
  createdAt: Date
  user: { name: string | null, email: string | null, image?: string | null }
  product: { name: string }
}

export default function AdminTopupHistoryClient({ 
  initialOrders, 
  totalPages, 
  currentPage 
}: { 
  initialOrders: any[], 
  totalPages: number, 
  currentPage: number 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addMessage } = useUI()
  const [isPending, startTransition] = useTransition()
  const [selectedOrder, setSelectedOrder] = useState<TopupOrder | null>(null)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL")
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) params.set("search", searchTerm)
    else params.delete("search")
    
    if (statusFilter !== "ALL") params.set("status", statusFilter)
    else params.delete("status")
    
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  const handleRetry = async (orderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn thử lại đơn hàng này?")) return
    
    startTransition(async () => {
      const result = await retryTopupOrder(orderId)
      if (result.success) {
        addMessage({ type: "success", text: "Nạp bù thành công!" })
        router.refresh()
        setSelectedOrder(null)
      } else {
        addMessage({ type: "error", text: result.message || "Lỗi khi nạp bù" })
      }
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED": return { icon: CheckCircle2, class: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", label: "Thành công" }
      case "ERROR": return { icon: XCircle, class: "bg-rose-500/10 text-rose-500 border-rose-500/20", label: "Lỗi" }
      case "REFUNDED": return { icon: Ban, class: "bg-amber-500/10 text-amber-500 border-amber-500/20", label: "Đã hoàn tiền" }
      case "PENDING": return { icon: Clock, class: "bg-blue-500/10 text-blue-500 border-blue-500/20", label: "Chờ xử lý" }
      case "WAITING_CARD": return { icon: CreditCard, class: "bg-purple-500/10 text-purple-500 border-purple-500/20", label: "Đợi thẻ NCC" }
      case "BUYING_CARD": return { icon: CreditCard, class: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20", label: "Đang mua thẻ" }
      case "PROCESSING_VNG": return { icon: RefreshCw, class: "bg-orange-500/10 text-orange-500 border-orange-500/20", label: "Đang nạp VNG" }
      default: return { icon: AlertTriangle, class: "bg-slate-500/10 text-slate-500 border-slate-500/20", label: status }
    }
  }

  const STATUS_OPTIONS = [
    { value: "ALL", label: "Tất cả trạng thái" },
    { value: "COMPLETED", label: "Thành công" },
    { value: "ERROR", label: "Lỗi" },
    { value: "REFUNDED", label: "Đã hoàn tiền" },
    { value: "PENDING", label: "Chờ xử lý" },
    { value: "WAITING_CARD", label: "Đợi thẻ NCC" },
  ]

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Lịch Sử Nạp Gói"
        subtitle="Quản lý và kiểm tra chi tiết các đơn nạp VNG tự động"
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm theo ID, Tên nhân vật, Email..."
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-bold"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="px-4 py-3 bg-card border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 hover:bg-secondary transition-all shadow-sm min-w-[200px]"
          >
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-left uppercase text-[10px] tracking-widest font-bold">
              {STATUS_OPTIONS.find(o => o.value === statusFilter)?.label || "Trạng thái"}
            </span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isStatusOpen && "rotate-180")} />
          </button>
          
          {isStatusOpen && (
            <div className="absolute top-full right-0 mt-2 w-full bg-card border border-border rounded-xl shadow-xl z-10 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setIsStatusOpen(false);
                    // Trigger search immediately on status change
                    const params = new URLSearchParams(searchParams.toString())
                    if (opt.value !== "ALL") params.set("status", opt.value)
                    else params.delete("status")
                    params.set("page", "1")
                    router.push(`?${params.toString()}`)
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-[10px] font-bold transition-colors uppercase tracking-widest",
                    statusFilter === opt.value ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Đơn Hàng / Ngày tạo</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Khách Hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nhân Vật</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Gói Nạp</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Giá Bán</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Trạng Thái</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[11px] font-bold">
              {initialOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <History className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Không tìm thấy đơn hàng nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                initialOrders.map((order) => {
                  const status = getStatusConfig(order.status)
                  const StatusIcon = status.icon
                  return (
                    <tr key={order.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="text-foreground uppercase tracking-tight group-hover:text-primary transition-colors font-mono">#{order.id.slice(-8).toUpperCase()}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleString("vi-VN")}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-secondary border border-border overflow-hidden shrink-0 relative flex items-center justify-center text-muted-foreground">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-foreground truncate">{order.user?.name || "Khách hàng"}</p>
                            <p className="text-[9px] font-medium text-muted-foreground truncate">{order.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="text-foreground font-bold">{order.roleName}</p>
                          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">SV: {order.serverId} • ID: {order.roleId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-primary/80">{order.product?.name}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-foreground tabular-nums">{order.amount.toLocaleString()}</span>
                        <p className="text-[9px] text-muted-foreground mt-0.5 font-bold uppercase tracking-widest">VND</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold border uppercase tracking-widest",
                          status.class
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 bg-card border border-border rounded-lg hover:text-primary transition-all shadow-sm"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.status === "ERROR" && (
                            <button 
                              onClick={() => handleRetry(order.id)}
                              className="p-2 bg-card border border-border rounded-lg text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                              disabled={isPending}
                              title="Thử nạp lại"
                            >
                              <RefreshCw className={cn("w-4 h-4", isPending && "animate-spin")} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/30">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trang {currentPage} / {totalPages}</div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => changePage(1)} 
                disabled={currentPage === 1} 
                className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => changePage(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-4 text-xs font-bold text-primary">{currentPage}</div>
              <button 
                onClick={() => changePage(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => changePage(totalPages)} 
                disabled={currentPage === totalPages} 
                className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal (Glassmorphism & Premium Style) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card/95 border border-border w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-border bg-secondary/30 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Chi Tiết Đơn Nạp Gói</h3>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mt-0.5">#{selectedOrder.id.toUpperCase()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="w-10 h-10 flex items-center justify-center bg-secondary/50 hover:bg-rose-500 hover:text-white border border-border rounded-xl transition-all"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Info Card 1 */}
                <div className="p-6 bg-secondary/20 rounded-[1.5rem] border border-border space-y-5">
                  <div className="flex items-center gap-2 text-primary">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Khách Hàng & Game</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Người mua</span>
                      <span className="text-xs font-bold">{selectedOrder.user?.name || "Khách"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Nhân vật</span>
                      <span className="text-xs font-bold">{selectedOrder.roleName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Server / ID</span>
                      <span className="text-xs font-bold">{selectedOrder.serverId} / {selectedOrder.roleId}</span>
                    </div>
                  </div>
                </div>

                {/* Info Card 2 */}
                <div className="p-6 bg-secondary/20 rounded-[1.5rem] border border-border space-y-5">
                  <div className="flex items-center gap-2 text-primary">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Thẻ Cào NCC</span>
                  </div>
                  <div className="space-y-3">
                    {selectedOrder.cardSerial ? (
                      <>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">Serial</p>
                          <p className="text-xs font-mono font-bold bg-background/50 px-3 py-2 rounded-xl border border-border">{selectedOrder.cardSerial}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">Mã PIN (Giải mã)</p>
                          <p className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/5 px-3 py-2 rounded-xl border border-emerald-500/20">{selectedOrder.cardPin}</p>
                        </div>
                      </>
                    ) : (
                      <div className="py-4 text-center">
                        <AlertTriangle className="w-8 h-8 text-amber-500/30 mx-auto mb-2" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Chưa có thông tin thẻ</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Logs Timeline */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Nhật Ký Xử Lý (Timeline)</span>
                </div>
                <div className="relative space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-border/50">
                  {Array.isArray(selectedOrder.statusLog) && selectedOrder.statusLog.map((log: any, idx: number) => (
                    <div key={idx} className="relative pl-10">
                      <div className={cn(
                        "absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-card flex items-center justify-center shadow-sm z-10",
                        log.status === "OK" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                      )}>
                        {log.status === "OK" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      </div>
                      <div className="p-4 bg-secondary/10 border border-border/50 rounded-2xl space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-tight text-foreground">{log.step}</span>
                          <span className="text-[9px] font-mono text-muted-foreground">{log.time ? new Date(log.time).toLocaleTimeString("vi-VN") : ""}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">{log.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Error (if any) */}
              {selectedOrder.errorMessage && (
                <div className="p-5 bg-rose-500/5 border-2 border-dashed border-rose-500/20 rounded-2xl flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Lỗi Hệ Thống Phát Sinh</p>
                    <p className="text-xs text-rose-500/80 font-bold leading-relaxed italic">"{selectedOrder.errorMessage}"</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-secondary/30 border-t border-border flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-8 py-3 bg-card border border-border text-foreground rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-all shadow-sm"
              >
                Đóng Cửa Sổ
              </button>
              {selectedOrder.status === "ERROR" && (
                <button 
                  onClick={() => handleRetry(selectedOrder.id)}
                  className="px-8 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                  disabled={isPending}
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isPending && "animate-spin")} />
                  Thử Nạp Lại Ngay
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
