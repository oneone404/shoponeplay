"use client"

import { useState } from "react"
import { Search, History, CheckCircle2, Clock, XCircle, AlertCircle, Eye, MessageSquare, User } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { cn } from "@/lib/utils"
import OrderDetailModal from "./OrderDetailModal"

interface ServiceOrder {
  id: string
  userId: string
  serviceId: string
  optionId: string
  customerData: any
  totalAmount: number
  status: string
  adminNote: string | null
  createdAt: string
  user: {
    name: string | null
    email: string | null
  }
  service: {
    name: string
  }
  option: {
    name: string
  }
}

interface AdminServiceOrdersClientProps {
  initialOrders: ServiceOrder[]
}

export default function AdminServiceOrdersClient({ initialOrders }: AdminServiceOrdersClientProps) {
  const [orders, setOrders] = useState<ServiceOrder[]>(initialOrders)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  
  const [viewingOrder, setViewingOrder] = useState<ServiceOrder | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { addMessage } = useUI()

  const filteredOrders = orders.filter((order) => {
    const keyword = search.trim().toLowerCase()
    const matchesSearch = !keyword || 
      order.id.toLowerCase().includes(keyword) || 
      order.user.email?.toLowerCase().includes(keyword) ||
      order.user.name?.toLowerCase().includes(keyword) ||
      order.service.name.toLowerCase().includes(keyword)

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING': return { label: 'Chờ xử lý', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: <Clock className="w-3 h-3" /> }
      case 'PROCESSING': return { label: 'Đang làm', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: <AlertCircle className="w-3 h-3" /> }
      case 'COMPLETED': return { label: 'Hoàn thành', color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> }
      case 'CANCELLED': return { label: 'Đã hủy', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: <XCircle className="w-3 h-3" /> }
      case 'REFUNDED': return { label: 'Hoàn tiền', color: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20', icon: <History className="w-3 h-3" /> }
      default: return { label: status, color: 'text-zinc-500 bg-secondary', icon: null }
    }
  }

  const handleOpenDetail = (order: ServiceOrder) => {
    setViewingOrder(order)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard label="Chờ xử lý" value={orders.filter(o => o.status === 'PENDING').length.toString()} color="text-amber-500" />
        <StatCard label="Đang làm" value={orders.filter(o => o.status === 'PROCESSING').length.toString()} color="text-blue-500" />
        <StatCard label="Hoàn thành" value={orders.filter(o => o.status === 'COMPLETED').length.toString()} color="text-green-500" />
        <StatCard label="Tổng đơn" value={orders.length.toString()} color="text-primary" />
      </div>

      <div className="flex flex-col bg-card border border-border rounded-2xl shadow-sm">
        <div className="p-4 border-b border-border bg-secondary/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm Mã đơn, Email khách, Tên dịch vụ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl w-full outline-none focus:border-primary/50 text-[11px] font-bold transition-colors uppercase tracking-widest"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-background border border-border rounded-xl outline-none focus:border-primary/50 text-[11px] font-bold uppercase tracking-widest transition-colors"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
              <option value="REFUNDED">Đã hoàn tiền</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Mã Đơn / Ngày Đặt</th>
                <th className="px-6 py-4 font-bold">Khách Hàng</th>
                <th className="px-6 py-4 font-bold">Dịch Vụ / Gói</th>
                <th className="px-6 py-4 font-bold">Thanh Toán</th>
                <th className="px-6 py-4 font-bold text-center">Trạng Thái</th>
                <th className="px-6 py-4 font-bold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                const status = getStatusInfo(order.status)
                return (
                  <tr key={order.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-mono text-[11px] font-bold text-primary">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate max-w-[150px] text-xs">{order.user.name || 'N/A'}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{order.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground text-xs">{order.service.name}</p>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">{order.option.name}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground tabular-nums">
                      {order.totalAmount.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                        status.color
                      )}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenDetail(order)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" 
                          title="Chi tiết & Xử lý"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <History className="w-8 h-8 text-muted-foreground opacity-20" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Không có đơn hàng nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && viewingOrder && (
        <OrderDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          order={viewingOrder} 
          onUpdate={(updatedOrder) => {
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o))
          }}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className={cn("text-2xl font-bold mt-2 tabular-nums tracking-tight", color)}>{value}</p>
    </div>
  )
}
