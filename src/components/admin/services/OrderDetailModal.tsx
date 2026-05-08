"use client"

import { useState } from "react"
import { X, Loader2, Save, User, Mail, CreditCard, Tag, FileText, CheckCircle2, Clock, XCircle, AlertCircle, History, MessageSquare } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { cn } from "@/lib/utils"

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
  onUpdate: (order: any) => void
}

export default function OrderDetailModal({ isOpen, onClose, order, onUpdate }: OrderDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(order.status)
  const [adminNote, setAdminNote] = useState(order.adminNote || "")
  
  const { addMessage } = useUI()

  const handleUpdate = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/services/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra')

      addMessage({ type: 'success', text: 'Đã cập nhật trạng thái đơn hàng' })
      onUpdate(data)
      onClose()
    } catch (error: any) {
      addMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'PENDING': return <Clock className="w-5 h-5 text-amber-500" />
      case 'PROCESSING': return <AlertCircle className="w-5 h-5 text-blue-500" />
      case 'COMPLETED': return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-rose-500" />
      case 'REFUNDED': return <History className="w-5 h-5 text-zinc-500" />
      default: return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-border shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-3">
            {getStatusIcon(order.status)}
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Chi tiết Đơn hàng #{order.id.slice(-8).toUpperCase()}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Cột trái: Thông tin khách & Dịch vụ */}
            <div className="space-y-6">
              <section className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <User className="w-3 h-3" /> Thông tin khách hàng
                </h3>
                <div className="p-4 bg-secondary/30 rounded-xl border border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tên:</span>
                    <span className="font-bold text-foreground">{order.user.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-bold text-foreground">{order.user.email}</span>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Dịch vụ đặt mua
                </h3>
                <div className="p-4 bg-secondary/30 rounded-xl border border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dịch vụ:</span>
                    <span className="font-bold text-foreground">{order.service.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gói chọn:</span>
                    <span className="font-bold text-primary uppercase tracking-widest text-[10px]">{order.option.name}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">Tổng tiền:</span>
                    <span className="font-bold text-foreground">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Cột phải: Dữ liệu khách nhập (QUAN TRỌNG) */}
            <div className="space-y-6">
              <section className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Dữ liệu tài khoản (Khách nhập)
                </h3>
                <div className="p-4 bg-secondary/50 rounded-xl border border-amber-500/20 space-y-4">
                  {Object.entries(order.customerData).map(([key, value]: [string, any]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{key}</label>
                      <div className="flex items-center gap-2 group">
                        <input 
                          readOnly 
                          value={value} 
                          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-primary outline-none"
                        />
                        <button 
                          onClick={() => { navigator.clipboard.writeText(value); addMessage({ type: 'success', text: `Đã copy ${key}` }) }}
                          className="p-2 bg-secondary hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {Object.keys(order.customerData).length === 0 && (
                    <p className="text-xs text-muted-foreground italic text-center py-4">Không có dữ liệu đi kèm</p>
                  )}
                </div>
              </section>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-border space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Xử lý đơn hàng
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Cập nhật trạng thái</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:border-primary/50 outline-none text-sm font-bold transition-all"
                >
                  <option value="PENDING">Chờ xử lý (Mới)</option>
                  <option value="PROCESSING">Đang thực hiện</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="CANCELLED">Hủy đơn</option>
                  <option value="REFUNDED">Đã hoàn tiền</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Ghi chú của Admin (Khách sẽ thấy)</label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:border-primary/50 outline-none text-sm transition-all"
                  placeholder="VD: Tài khoản sai mật khẩu, vui lòng check lại..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-border bg-secondary/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest text-muted-foreground hover:bg-secondary transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="px-8 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu Thay Đổi
          </button>
        </div>
      </div>
    </div>
  )
}
