"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Package, 
  Hash, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Copy,
  Check,
  ExternalLink,
  Wallet,
  ChevronUp,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import AdminHeader from "../AdminHeader"

interface AdminOrderDetailViewProps {
  order: any
}

export default function AdminOrderDetailView({ order }: AdminOrderDetailViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      default: return "bg-red-500/10 text-red-500 border-red-500/20"
    }
  }

  return (
    <div className="space-y-6 max-w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <Link 
            href="/admin/transactions" 
            className="mt-1 p-2 bg-card border border-border rounded-xl hover:bg-secondary transition-all active:scale-95 shadow-sm shrink-0"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter">
              Đơn hàng #{order.id.slice(-12).toUpperCase()}
            </h1>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">
              Quản lý chi tiết giao dịch và các mục sản phẩm
            </p>
          </div>
        </div>
      </div>

      {/* Top Info Cards - Hàng đầu tiên */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card Khách hàng */}
        <div className="md:col-span-1 xl:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 mb-4 relative">
            <User className="w-3.5 h-3.5 text-primary" /> Khách hàng
          </h3>
          <div className="flex items-center gap-5 relative">
            <div className="w-16 h-16 rounded-2xl bg-secondary border border-border overflow-hidden relative shadow-md shrink-0">
              {order.user.image ? (
                <Image src={order.user.image} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-foreground text-base truncate">{order.user.name || "Chưa đặt tên"}</p>
                <p className="text-xs text-muted-foreground truncate">{order.user.email}</p>
              </div>
              <div className="flex flex-col gap-1 sm:items-end sm:text-right">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Số dư</span>
                <span className="text-sm font-bold text-primary">{new Intl.NumberFormat('vi-VN').format(order.user.balance)} VND</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Trạng thái & Thanh toán */}
        <div className="md:col-span-1 xl:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-primary" /> Tổng quan giao dịch
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Trạng thái</span>
              <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold border tracking-widest inline-block", getStatusStyle(order.status))}>
                {order.status === "COMPLETED" ? "HOÀN TẤT" : order.status === "PENDING" ? "CHỜ XỬ LÝ" : "ĐÃ HỦY"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Ngày đặt</span>
              <span className="text-xs font-bold text-foreground block">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
            </div>
            <div className="space-y-1 sm:text-right">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Tổng thanh toán</span>
              <span className="text-lg font-bold text-primary block">{new Intl.NumberFormat('vi-VN').format(order.totalAmount)} VND</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Danh sách sản phẩm & Tài khoản */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-primary" /> Chi tiết sản phẩm & Tài khoản bàn giao
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold">
              {order.items.length} SẢN PHẨM
            </span>
          </div>
          
          <div className="divide-y divide-border">
            {order.items.map((item: any) => (
              <div key={item.id} className="p-6 space-y-6">
                {/* Header Sản phẩm */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-secondary/20 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-9 rounded-lg bg-secondary border border-border relative overflow-hidden shrink-0 shadow-inner">
                      <Image 
                        src={item.product?.category.image || "/images/product.png"} 
                        alt="" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm uppercase tracking-tight">{item.titleSnapshot}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2 mt-0.5">
                        <span>Số lượng: {item.quantity}</span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span>Đơn giá: {new Intl.NumberFormat('vi-VN').format(item.priceAtPurchase)} VND</span>
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Thành tiền</p>
                    <p className="text-base font-bold text-primary">
                      {new Intl.NumberFormat('vi-VN').format(item.priceAtPurchase * item.quantity)} VND
                    </p>
                  </div>
                </div>

                {/* Bảng Tài khoản (Table format) */}
                <div className="border border-border rounded-xl overflow-x-auto bg-card/50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <table className="w-full min-w-[700px] text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-secondary/30 border-b border-border">
                        <th className="px-4 py-3 font-bold uppercase tracking-widest text-muted-foreground text-[9px] w-12 text-center">#</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-widest text-muted-foreground text-[9px]">Tài khoản</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-widest text-muted-foreground text-[9px]">Mật khẩu</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-widest text-muted-foreground text-[9px]">ID ACCOUNT</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-widest text-muted-foreground text-[9px]">Thông tin thêm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {item.deliveredSecrets.map((secret: any, idx: number) => (
                        <tr key={secret.id} className="hover:bg-secondary/40 transition-colors group">
                          <td className="px-4 py-3 text-center text-muted-foreground/50 font-mono text-[10px]">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-foreground font-medium">{secret.username}</span>
                              <button 
                                onClick={() => handleCopy(secret.username, secret.id + 'u')}
                                className="p-1 text-muted-foreground hover:text-primary transition-all active:scale-90"
                              >
                                {copiedId === secret.id + 'u' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-muted-foreground/80 font-medium">{secret.password}</span>
                              <button 
                                onClick={() => handleCopy(secret.password, secret.id + 'p')}
                                className="p-1 text-muted-foreground hover:text-primary transition-all active:scale-90"
                              >
                                {copiedId === secret.id + 'p' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-muted-foreground/60 font-medium">{secret.accountId || "---"}</span>
                              {secret.accountId && (
                                <button 
                                  onClick={() => handleCopy(secret.accountId, secret.id + 'id')}
                                  className="p-1 text-muted-foreground hover:text-primary transition-all active:scale-90"
                                >
                                  {copiedId === secret.id + 'id' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[10px] text-muted-foreground italic leading-snug">
                              {secret.extraInfo || "---"}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
