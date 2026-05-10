"use client"

import { useState } from "react"
import { Search, Clock, CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronUp, History, ExternalLink, MessageSquare } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ServiceOrdersClientProps {
  initialOrders: any[]
}

export default function ServiceOrdersClient({ initialOrders }: ServiceOrdersClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filteredOrders = initialOrders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.service.name.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING': return { label: 'Chờ xử lý', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: <Clock className="w-4 h-4" /> }
      case 'PROCESSING': return { label: 'Đang thực hiện', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: <AlertCircle className="w-4 h-4" /> }
      case 'COMPLETED': return { label: 'Hoàn thành', color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: <CheckCircle2 className="w-4 h-4" /> }
      case 'CANCELLED': return { label: 'Đã hủy', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: <XCircle className="w-4 h-4" /> }
      case 'REFUNDED': return { label: 'Đã hoàn tiền', color: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20', icon: <History className="w-4 h-4" /> }
      default: return { label: status, color: 'text-zinc-500 bg-secondary', icon: null }
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm theo mã đơn hoặc tên dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-2xl outline-none focus:border-primary/50 text-sm font-bold transition-all"
        />
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => {
          const isExpanded = expandedId === order.id
          const status = getStatusInfo(order.status)
          
          return (
            <div 
              key={order.id} 
              className={cn(
                "bg-card border border-border rounded-[2rem] overflow-hidden transition-all duration-300",
                isExpanded ? "ring-2 ring-primary/20 shadow-xl" : "hover:border-primary/30"
              )}
            >
              {/* Header row */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 cursor-pointer"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-border">
                  <Image src={order.service.thumbnail || "/images/placeholder.jpg"} alt={order.service.name} fill className="object-cover" unoptimized />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">{order.service.name}</h3>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{order.option.name}</p>
                  <p className="text-[9px] font-bold text-muted-foreground mt-1 tabular-nums">#{order.id.slice(-8).toUpperCase()} • {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.1em] border",
                    status.color
                  )}>
                    {status.icon}
                    {status.label}
                  </span>
                  <span className="text-sm font-bold text-foreground">{order.totalAmount.toLocaleString('vi-VN')} đ</span>
                </div>

                <div className="p-2 text-muted-foreground">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-border bg-secondary/10 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    
                    {/* Dữ liệu đã nhập */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> Thông tin bạn đã cung cấp
                      </h4>
                      <div className="p-4 bg-background rounded-2xl border border-border space-y-3 shadow-inner">
                        {Object.entries(order.customerData).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground font-medium uppercase tracking-tight text-[9px]">{key}:</span>
                            <span className="font-bold text-foreground font-mono">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phản hồi từ Admin */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Phản hồi từ hệ thống
                      </h4>
                      <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-3 min-h-[80px] flex flex-col justify-center">
                        {order.adminNote ? (
                          <p className="text-sm font-medium text-foreground italic">"{order.adminNote}"</p>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">Đơn hàng đang chờ kỹ thuật viên tiếp nhận và xử lý. Vui lòng quay lại sau ít phút.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-secondary rounded-[2.5rem] flex items-center justify-center mb-6">
              <History className="w-8 h-8 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-foreground uppercase tracking-tight">Bạn chưa có đơn hàng nào</h3>
            <p className="text-muted-foreground text-sm font-medium mt-2">Hãy khám phá các dịch vụ hấp dẫn của chúng tôi.</p>
          </div>
        )}
      </div>
    </div>
  )
}
