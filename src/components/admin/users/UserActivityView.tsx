"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ShoppingBag, ArrowLeft, Calendar, Wallet, CreditCard } from "lucide-react"
import Link from "next/link"
import AdminHeader from "../AdminHeader"

interface UserActivityViewProps {
  user: {
    id: string
    name: string | null
    email: string | null
    balance: number
    totalDeposited: number
    createdAt: Date
    orders: any[]
    activities: any[]
  }
}

export default function UserActivityView({ user }: UserActivityViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link 
          href="/admin/users"
          className="p-2 bg-secondary text-muted-foreground hover:text-foreground rounded-xl transition-all shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <AdminHeader 
            title="Lịch sử hoạt động" 
            subtitle={`Người dùng: ${user.name || user.email || user.id}`} 
          />
        </div>
      </div>

      {/* User Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-2xl flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Số dư hiện tại</p>
            <p className="text-lg font-bold">{new Intl.NumberFormat('vi-VN').format(user.balance)} VND</p>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-2xl flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tổng nạp</p>
            <p className="text-lg font-bold">{new Intl.NumberFormat('vi-VN').format(user.totalDeposited || 0)} VND</p>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-2xl flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tổng đơn hàng</p>
            <p className="text-lg font-bold">{user.orders.length}</p>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-2xl flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ngày tham gia</p>
            <p className="text-lg font-bold">{format(new Date(user.createdAt), "dd/MM/yyyy", { locale: vi })}</p>
          </div>
        </div>
      </div>

      {/* Activity List - Orders */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center">
            <ShoppingBag className="w-3 h-3 mr-2 text-primary" />
            Lịch sử mua hàng
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Mã đơn</th>
                <th className="px-6 py-4 font-bold">Sản phẩm</th>
                <th className="px-6 py-4 font-bold">Tổng tiền</th>
                <th className="px-6 py-4 font-bold">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {user.orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic uppercase text-[10px] font-bold tracking-widest">
                    CHƯA CÓ ĐƠN HÀNG NÀO
                  </td>
                </tr>
              ) : (
                user.orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-mono text-[10px] font-bold">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-0.5">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="font-bold text-xs">
                            {item.titleSnapshot} <span className="text-muted-foreground font-medium">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {new Intl.NumberFormat('vi-VN').format(order.totalAmount)} VND
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                        order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-muted-foreground font-medium">
                      {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity List - User Logs */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center">
            <Calendar className="w-3 h-3 mr-2 text-primary" />
            Lịch sử đăng nhập & Hoạt động
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Hoạt động</th>
                <th className="px-6 py-4 font-bold">Địa chỉ IP</th>
                <th className="px-6 py-4 font-bold">Thiết bị / Trình duyệt</th>
                <th className="px-6 py-4 font-bold text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {user.activities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic uppercase text-[10px] font-bold tracking-widest">
                    CHƯA CÓ DỮ LIỆU HOẠT ĐỘNG
                  </td>
                </tr>
              ) : (
                user.activities.map((activity: any) => (
                  <tr key={activity.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                        activity.type === 'LOGIN' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                        activity.type === 'PURCHASE' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        'bg-secondary text-muted-foreground border-border'
                      }`}>
                        {activity.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {activity.ip || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground truncate max-w-[300px]" title={activity.userAgent || ""}>
                      {activity.userAgent || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-muted-foreground font-medium">
                      {format(new Date(activity.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
