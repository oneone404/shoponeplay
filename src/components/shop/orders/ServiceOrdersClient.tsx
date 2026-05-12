"use client"

import { useState, useMemo } from "react"
import {
  Search, Clock, CheckCircle2, AlertCircle, XCircle,
  History, MessageSquare, Gamepad2, Wrench,
  SearchX, Package, CreditCard, ChevronRight,
  User, Server, Tag, Info, Calendar, Eye,
  ChevronLeft, ChevronsLeft, ChevronsRight, X
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import UserPageHeader from "@/components/shared/UserPageHeader"
import Navbar from "@/components/layouts/Navbar"

interface ServiceOrdersClientProps {
  initialServiceOrders: any[]
  initialTopupOrders: any[]
}

export default function ServiceOrdersClient({
  initialServiceOrders,
  initialTopupOrders
}: ServiceOrdersClientProps) {
  const [activeTab, setActiveTab] = useState<"services" | "topups">("topups")
  const [search, setSearch] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredServiceOrders = useMemo(() => {
    return initialServiceOrders.filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.service.name.toLowerCase().includes(search.toLowerCase()) ||
      o.option.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [initialServiceOrders, search])

  const filteredTopupOrders = useMemo(() => {
    return initialTopupOrders.filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.productName?.toLowerCase().includes(search.toLowerCase()) ||
      o.roleName?.toLowerCase().includes(search.toLowerCase())
    )
  }, [initialTopupOrders, search])

  const currentList = useMemo(() => {
    return activeTab === "services" ? filteredServiceOrders : filteredTopupOrders
  }, [activeTab, filteredServiceOrders, filteredTopupOrders])

  const totalPages = Math.ceil(currentList.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOrdersList = currentList.slice(indexOfFirstItem, indexOfLastItem)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useMemo(() => {
    setCurrentPage(1)
  }, [activeTab, search])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING': return { label: 'Chờ xử lý', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: <Clock className="w-3.5 h-3.5" /> }
      case 'PROCESSING':
      case 'PROCESSING_VNG':
      case 'BUYING_CARD':
        return { label: 'Đang xử lý', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: <AlertCircle className="w-3.5 h-3.5" /> }
      case 'COMPLETED': return { label: 'Hoàn thành', color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
      case 'CANCELLED': 
      case 'ERROR':
        return { label: 'Thất bại', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: <XCircle className="w-3.5 h-3.5" /> }
      case 'REFUNDED': return { label: 'Hoàn tiền', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: <History className="w-3.5 h-3.5" /> }
      case 'WAITING_STOCK': return { label: 'Đợi hàng', color: 'text-amber-600 bg-amber-500/10 border-amber-500/20', icon: <Clock className="w-3.5 h-3.5" /> }
      case 'WAITING_CARD': return { label: 'Đang lấy thẻ', color: 'text-blue-600 bg-blue-500/10 border-blue-500/20', icon: <Clock className="w-3.5 h-3.5" /> }
      case 'CARD_READY': return { label: 'Đã có thẻ', color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20', icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
      case 'WAITING_ADMIN_PAY': return { label: 'Chờ duyệt', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: <Clock className="w-3.5 h-3.5" /> }
      default: return { label: status, color: 'text-zinc-500 bg-secondary', icon: null }
    }
  }

  const stats = useMemo(() => {
    const orders = activeTab === "services" ? initialServiceOrders : initialTopupOrders
    return {
      total: orders.length,
      spent: orders.reduce((acc, curr) => acc + (activeTab === "services" ? curr.totalAmount : curr.amount), 0),
      pending: orders.filter(o => ["PENDING", "PROCESSING", "PROCESSING_VNG", "BUYING_CARD", "WAITING_ADMIN_PAY", "WAITING_STOCK", "WAITING_CARD"].includes(o.status)).length
    }
  }, [activeTab, initialServiceOrders, initialTopupOrders])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <UserPageHeader
        title="LỊCH SỬ"
        highlightTitle={activeTab === "topups" ? "NẠP GAME" : "DỊCH VỤ"}
        subtitle={activeTab === "topups" ? "Theo dõi đơn nạp game vào tài khoản" : "Theo dõi yêu cầu cày thuê & dịch vụ"}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6 pb-safe">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SummaryCard label="Tổng đơn" value={stats.total.toLocaleString()} icon={<Package className="w-5 h-5" />} color="text-primary" />
          <SummaryCard label="Tổng chi" value={stats.spent.toLocaleString() + " VND"} icon={<CreditCard className="w-5 h-5" />} color="text-green-500" />
          <SummaryCard label="Đang xử lý" value={stats.pending.toLocaleString()} icon={<Clock className="w-5 h-5" />} color="text-amber-500" />
        </div>

        <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex bg-background border border-border p-1 rounded-xl w-full md:w-auto">
              <TabButton active={activeTab === "topups"} onClick={() => setActiveTab("topups")} label="Nạp Game" />
              <TabButton active={activeTab === "services"} onClick={() => setActiveTab("services")} label="Dịch vụ" />
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm Kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm font-bold outline-none focus:border-primary/50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="divide-y divide-border/60">
            <AnimatePresence mode="wait">
              {currentOrdersList.length > 0 ? (
                <motion.div key={`${activeTab}-${currentPage}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {currentOrdersList.map((order) => (
                    <OrderRow key={order.id} order={order} type={activeTab} onOpen={() => setSelectedOrder({ ...order, type: activeTab })} getStatusInfo={getStatusInfo} />
                  ))}
                </motion.div>
              ) : (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <SearchX className="w-8 h-8 text-muted-foreground opacity-20 mb-4" />
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Không có dữ liệu</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/30">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Trang {currentPage}/{totalPages}</div>
              <div className="flex items-center space-x-2">
                <PaginationButton onClick={() => goToPage(1)} disabled={currentPage === 1} icon={<ChevronsLeft className="w-4 h-4" />} />
                <PaginationButton onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} icon={<ChevronLeft className="w-4 h-4" />} />
                <PaginationButton onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} icon={<ChevronRight className="w-4 h-4" />} />
                <PaginationButton onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} icon={<ChevronsRight className="w-4 h-4" />} />
              </div>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} getStatusInfo={getStatusInfo} />
        )}
      </AnimatePresence>
    </div>
  )
}

function OrderRow({ order, type, onOpen, getStatusInfo }: any) {
  const status = getStatusInfo(order.status)
  return (
    <div onClick={onOpen} className="px-4 py-4 md:px-6 flex items-center gap-4 cursor-pointer hover:bg-secondary/20 transition-colors group">
      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border bg-secondary">
        {type === "services" ? (
          <Image src={order.service.thumbnail || "/images/placeholder.jpg"} alt="" fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary"><Gamepad2 className="w-6 h-6" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-bold text-foreground uppercase truncate">
          {type === "services" ? order.service.name : (order.productName || "Nạp Game")}
        </h3>
        <p className="text-[10px] font-bold text-muted-foreground mt-0.5 truncate uppercase tracking-widest">
          {new Date(order.createdAt).toLocaleDateString("vi-VN")} • #{order.id.slice(-8).toUpperCase()}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-bold text-foreground">{(type === "services" ? order.totalAmount : order.amount).toLocaleString()} VND</p>
        <span className={cn("text-[9px] font-bold uppercase tracking-widest mt-1 inline-block", status.color.split(" ")[0])}>{status.label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-20 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

function OrderDetailsModal({ order, onClose, getStatusInfo }: any) {
  const status = getStatusInfo(order.status)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pb-28 md:pb-6">
      {/* Backdrop - Standard Dark (Matching system modals) */}
      <div onClick={onClose} className="fixed inset-0 bg-black/60 animate-modal-backdrop-clean" />

      {/* Modal Content - Solid Style */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] md:max-h-[85vh] animate-modal-content">
        <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest leading-none">Chi tiết đơn hàng</h2>
            <p className="text-[9px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">#{order.id.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {/* Info Section */}
          <div className="space-y-3">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {order.type === "services" ? (
                Object.entries(order.customerData || {}).map(([key, value]: any) => (
                  <DetailBox key={key} label={key} value={value} />
                ))
              ) : (
                <>
                  <DetailBox label="Nhân vật" value={order.roleName} />
                  <DetailBox label="ID Game" value={order.roleId} />
                  <DetailBox label="Máy chủ" value={order.serverId} />
                  <DetailBox label="Gói nạp" value={order.cardValue.toLocaleString() + " VND"} />
                </>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-5 pb-4">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-500">
              Nhật ký phản hồi
            </h3>
            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
              {(() => {
                let notes = Array.isArray(order.adminNote) ? [...order.adminNote] : []

                // Inject status notes
                if (order.status === "COMPLETED") {
                  notes.push({ text: "Đơn hàng đã được hoàn thành thành công!", time: order.completedAt || order.updatedAt, isAuto: true })
                } else if (order.status === "CANCELLED" || order.status === "ERROR") {
                  notes.push({ text: `Đơn hàng thất bại: ${order.errorMessage || "Vui lòng liên hệ Admin"}`, time: order.updatedAt, isAuto: true })
                } else if (order.status === "REFUNDED") {
                  notes.push({ text: "Đơn hàng đã được hoàn tiền lại vào tài khoản!", time: order.updatedAt, isAuto: true })
                }

                // Sort by time descending (newest first)
                const displayNotes = notes.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

                if (displayNotes.length > 0) {
                  return displayNotes.map((note: any, idx: number) => (
                    <div key={idx} className="relative pl-6">
                      <div className={cn(
                        "absolute left-1 top-2 w-2 h-2 rounded-full border-2 border-background z-10",
                        idx === 0 
                          ? (order.status === "COMPLETED" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" 
                             : order.status === "REFUNDED" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                             : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]") 
                          : "bg-border"
                      )} />
                      <div className={cn(
                        "p-2 px-3 rounded-xl border transition-all",
                        idx === 0 
                          ? (order.status === "COMPLETED" ? "bg-green-600/10 border-green-500/20" 
                             : order.status === "REFUNDED" ? "bg-amber-600/10 border-amber-500/20"
                             : "bg-blue-600/10 border-blue-500/30") 
                          : "bg-secondary border-border"
                      )}>
                        <p className={cn(
                          "text-[11px] font-bold leading-tight italic", 
                          idx === 0 && order.status === "COMPLETED" ? "text-green-600" 
                          : idx === 0 && order.status === "REFUNDED" ? "text-amber-600"
                          : "text-foreground"
                        )}>{`"${note.text}"`}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                            {new Date(note.time).toLocaleString("vi-VN", { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                          </p>
                          {idx === 0 && <span className={cn(
                            "text-[7px] font-bold uppercase tracking-tighter", 
                            order.status === "COMPLETED" ? "text-green-600" 
                            : order.status === "REFUNDED" ? "text-amber-600"
                            : "text-blue-500"
                          )}>
                            {note.isAuto ? "[Hệ thống]" : "[Mới nhất]"}
                          </span>}
                        </div>
                      </div>
                    </div>
                  ))
                }

                // Fallback for Processing
                // Fallback for Processing
                return (
                  <div className="relative pl-6">
                    <div className="absolute left-1 top-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] border-2 border-background z-10" />
                    <div className="p-2 px-3 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                      <p className="text-[11px] text-blue-600 font-bold leading-tight italic">
                        "Đang trong quá trình xử lý..."
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                          {new Date(order.createdAt).toLocaleString("vi-VN", { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                        </p>
                        <span className="text-[7px] font-bold uppercase tracking-tighter text-blue-500">
                          [Hệ thống]
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        <div className="p-4 bg-secondary border-t border-border">
          {/* Solid footer area */}
        </div>
      </div>
    </div>
  )
}

function DetailBox({ label, value }: any) {
  return (
    <div className="p-2.5 bg-secondary border border-border rounded-xl">
      <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-0.5 flex items-center gap-1">{label}</p>
      <p className="text-[10px] font-bold text-foreground truncate">{value}</p>
    </div>
  )
}

function SummaryCard({ label, value, icon, color }: any) {
  return (
    <div className="p-4 bg-card border border-border rounded-2xl shadow-sm group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-lg font-bold mt-1 text-foreground">{value}</p>
        </div>
        <div className={cn("w-10 h-10 rounded-xl bg-secondary flex items-center justify-center transition-transform group-hover:scale-110", color)}>{icon}</div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label }: any) {
  return (
    <button onClick={onClick} className={cn("px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", active ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground")}>{label}</button>
  )
}

function PaginationButton({ onClick, disabled, icon }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className="p-2 bg-background border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all active:scale-90">{icon}</button>
  )
}
