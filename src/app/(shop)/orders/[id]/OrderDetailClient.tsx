"use client"

import Navbar from "@/components/layouts/Navbar"
import { motion } from "framer-motion"
import { 
  Package, 
  Copy, 
  Download, 
  Calendar, 
  CreditCard, 
  User, 
  Key,
  FileText,
  ShoppingBag,
  UserCheck,
  Lock,
  Info,
  Hash,
  CheckCircle,
  ExternalLink
} from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import PageHeader from "@/components/shared/PageHeader"

interface OrderDetailClientProps {
  order: any
}

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  const router = useRouter()
  const { addMessage } = useUI()

  const formatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addMessage({ type: "success", text: "Đã sao chép vào bộ nhớ tạm" })
  }

  const copyAllAccounts = () => {
    let allData = ""
    order.items.forEach((item: any) => {
      item.deliveredSecrets.forEach((secret: any) => {
        const accId = secret.accountId ? `|${secret.accountId}` : ""
        allData += `${secret.username}|${secret.password}${accId}\n`
      })
    })
    copyToClipboard(allData.trim())
  }

  const exportToFile = () => {
    const dateStr = new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour12: false
    }).format(new Date(order.createdAt)).replace(",", "")

    let content = `Đơn Hàng: #${order.id.toUpperCase()}\n`
    content += `Ngày Mua: ${dateStr}\n`
    content += `Tổng Tiền: ${formatCurrency(order.totalAmount)} VND\n`
    content += `----------------------------------------\n`

    order.items.forEach((item: any) => {
      item.deliveredSecrets.forEach((secret: any) => {
        const accId = secret.accountId ? `|${secret.accountId}` : ""
        content += `${secret.username}|${secret.password}${accId}\n`
      })
    })

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `order_${order.id.slice(-8).toUpperCase()}.txt`
    link.click()
    URL.revokeObjectURL(url)
    addMessage({ type: "success", text: "Đã xuất file thành công" })
  }

  const stats = {
    totalAccounts: order.items.reduce((acc: number, item: any) => acc + item.deliveredSecrets.length, 0),
    totalItems: order.items.length,
    spent: order.totalAmount
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <PageHeader 
          subtitle={`Mã giao dịch: #${order.id.slice(-12).toUpperCase()}`}
          title="CHI TIẾT"
          highlightTitle="ĐƠN HÀNG"
          showBackButton={true}
          className="!px-0"
        >
          <div className="flex items-center gap-2">
            <button 
              onClick={copyAllAccounts}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border text-foreground rounded-xl font-bold text-xs md:text-sm hover:bg-secondary active:scale-95 transition-all whitespace-nowrap shadow-sm"
            >
              <Copy className="w-4 h-4" /> COPY TẤT CẢ
            </button>
            <button 
              onClick={exportToFile}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs md:text-sm hover:bg-primary/90 active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-primary/20"
            >
              <Download className="w-4 h-4" /> XUẤT FILE TXT
            </button>
          </div>
        </PageHeader>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SummaryCard label="Tổng tài khoản" value={stats.totalAccounts.toLocaleString("vi-VN")} icon={<UserCheck className="w-5 h-5" />} color="text-primary" />
          <SummaryCard label="Thanh toán" value={stats.spent.toLocaleString("vi-VN") + " VND"} icon={<CreditCard className="w-5 h-5" />} color="text-green-500" />
          <SummaryCard label="Ngày mua" value={new Date(order.createdAt).toLocaleDateString("vi-VN")} icon={<Calendar className="w-5 h-5" />} color="text-blue-500" />
        </div>

        {/* Items List */}
        <div className="space-y-6">
          {order.items.map((item: any, idx: number) => (
            <div key={item.id} className="flex flex-col bg-card border border-border rounded-2xl overflow-visible shadow-sm">
              {/* Product Header Row */}
              <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-20 aspect-video rounded-lg overflow-hidden border border-border bg-secondary shrink-0 group/img shadow-sm">
                    <Image 
                      src={item.product?.thumbnail || "/images/product.png"} 
                      fill 
                      sizes="80px"
                      alt="" 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-sm uppercase tracking-tight">{item.titleSnapshot}</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Số lượng: {item.quantity} • Giá: {formatCurrency(item.priceAtPurchase)} VND</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle className="w-3.5 h-3.5" /> Đã giao hàng
                </div>
              </div>

              {/* Secrets Table */}
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-bold w-16">STT</th>
                      <th className="px-6 py-4 font-bold">Tên đăng nhập</th>
                      <th className="px-6 py-4 font-bold">Mật khẩu</th>
                      <th className="px-6 py-4 font-bold">ID Tài khoản</th>
                      <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {item.deliveredSecrets.map((secret: any, sIdx: number) => (
                      <tr key={secret.id} className="hover:bg-secondary/20 transition-colors group">
                        <td className="px-6 py-4 text-[11px] font-bold text-muted-foreground/40">
                          {sIdx + 1 < 10 ? `0${sIdx + 1}` : sIdx + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-foreground bg-secondary/50 px-2 py-1 rounded border border-border/50">{secret.username}</span>
                            <button 
                              onClick={() => copyToClipboard(secret.username)}
                              className="p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-all active:scale-90"
                              title="Copy Tên Đăng Nhập"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-foreground bg-secondary/50 px-2 py-1 rounded border border-border/50">{secret.password}</span>
                            <button 
                              onClick={() => copyToClipboard(secret.password)}
                              className="p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-all active:scale-90"
                              title="Copy Mật Khẩu"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-mono text-xs font-bold px-2 py-1 rounded border border-border/50",
                              secret.accountId ? "text-foreground bg-secondary/50" : "text-muted-foreground/30 italic bg-transparent border-transparent"
                            )}>
                              {secret.accountId || "N/A"}
                            </span>
                            {secret.accountId && (
                              <button 
                                onClick={() => copyToClipboard(secret.accountId)}
                                className="p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-all active:scale-90"
                                title="Copy ID Tài Khoản"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => copyToClipboard(`${secret.username}|${secret.password}${secret.accountId ? `|${secret.accountId}` : ""}`)}
                            className="p-2 bg-background border border-border hover:bg-secondary text-muted-foreground hover:text-foreground rounded-xl transition-all active:scale-95 shadow-sm"
                            title="Copy Toàn Bộ Dòng"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info Box */}
        <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
              Vui lòng bảo mật thông tin tài khoản sau khi mua. Nếu có bất kỳ vấn đề gì, hãy chụp màn hình và liên hệ hỗ trợ viên kèm mã đơn <span className="text-primary">#{order.id.toUpperCase()}</span>.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

function SummaryCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-bold mt-2 text-foreground tabular-nums tracking-tight">{value}</p>
        </div>
        <div className={cn("w-11 h-11 rounded-xl bg-secondary flex items-center justify-center transition-transform group-hover:scale-110", color)}>{icon}</div>
      </div>
    </div>
  )
}
