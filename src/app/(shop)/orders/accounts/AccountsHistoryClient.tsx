"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import Navbar from "@/components/layouts/Navbar"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  Search,
  SearchX,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  Copy,
  ExternalLink,
  Loader2,
  Calendar,
  Eye,
  Key,
  Gamepad2,
  User,
  Lock,
  Info
} from "lucide-react"
import { useLanguage } from "@/providers/LanguageProvider"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import PageHeader from "@/components/shared/PageHeader"
import { useUI } from "@/providers/UIProvider"

export default function AccountsHistoryClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <AccountsHistoryContent />
    </Suspense>
  )
}

function AccountsHistoryContent() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const router = useRouter()
  const { t } = useLanguage()
  const { addMessage } = useUI()

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/shop/orders/accounts")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng acc:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()
    return orders.filter(order =>
      order.id.toLowerCase().includes(keyword) ||
      order.items.some((item: any) => 
        item.titleSnapshot.toLowerCase().includes(keyword) ||
        item.deliveredSecrets.some((s: any) => s.username.toLowerCase().includes(keyword))
      )
    )
  }, [orders, searchQuery])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const stats = {
    total: orders.length,
    spent: orders.reduce((acc, curr) => acc + curr.totalAmount, 0),
    accs: orders.length
  }

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text)
    addMessage({ type: "success", text: msg })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto space-y-6">
        <PageHeader
          subtitle="Quản Lý Danh Sách Tài Khoản Game Đã Mua"
          title="TÀI KHOẢN"
          highlightTitle="ĐÃ MUA"
          className="!px-0"
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SummaryCard label="Tổng tài khoản" value={stats.total.toLocaleString("vi-VN")} icon={<Gamepad2 className="w-5 h-5" />} color="text-primary" />
          <SummaryCard label="Tổng chi tiêu" value={stats.spent.toLocaleString("vi-VN") + " VND"} icon={<CreditCard className="w-5 h-5" />} color="text-green-500" />
          <SummaryCard label="Số đơn hàng" value={stats.accs.toLocaleString("vi-VN")} icon={<Package className="w-5 h-5" />} color="text-blue-500" />
        </div>

        {/* Table Container */}
        <div className="flex flex-col bg-card border border-border rounded-2xl overflow-visible shadow-sm">
          <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm Tên Sản Phẩm, Tài Khoản..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm font-bold outline-none focus:border-primary/50 transition-colors shadow-sm"
              />
            </div>
            <div className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap px-2">
              Tổng: {filteredOrders.length}
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold">Thông tin tài khoản</th>
                    <th className="px-6 py-4 font-bold">Dữ liệu đăng nhập (TK | MK)</th>
                    <th className="px-6 py-4 font-bold text-center">Ngày mua</th>
                    <th className="px-6 py-4 font-bold text-center">Tổng tiền</th>
                    <th className="px-6 py-4 font-bold text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <AnimatePresence mode="wait">
                    {currentOrders.length === 0 ? (
                      <motion.tr
                        key="no-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="p-4 rounded-full bg-secondary">
                              <SearchX className="w-8 h-8 text-muted-foreground opacity-20" />
                            </div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Không tìm thấy tài khoản nào</p>
                          </div>
                        </td>
                      </motion.tr>
                    ) : (
                      currentOrders.map((order, idx) => {
                        const item = order.items[0]
                        const secret = item?.deliveredSecrets[0]
                        
                        return (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: idx * 0.02 }}
                            className="hover:bg-secondary/20 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border bg-secondary shrink-0">
                                  <Image
                                    src={item?.product?.thumbnail || "/images/product.png"}
                                    fill
                                    sizes="48px"
                                    alt=""
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-foreground uppercase text-xs truncate max-w-[150px]">
                                    {item?.titleSnapshot}
                                  </p>
                                  <p className="text-[9px] text-muted-foreground font-bold mt-0.5 uppercase tracking-widest">
                                    Mã: #{order.id.slice(-8).toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              {secret ? (
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 bg-background border border-border px-2 py-1 rounded-lg">
                                      <User className="w-3 h-3 text-muted-foreground" />
                                      <span className="text-xs font-mono font-bold text-foreground">{secret.username}</span>
                                      <button 
                                        onClick={() => copyToClipboard(secret.username, "Đã copy tài khoản!")}
                                        className="p-1 hover:bg-secondary rounded transition-colors"
                                      >
                                        <Copy className="w-3 h-3 text-primary" />
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-background border border-border px-2 py-1 rounded-lg">
                                      <Lock className="w-3 h-3 text-muted-foreground" />
                                      <span className="text-xs font-mono font-bold text-foreground">••••••••</span>
                                      <button 
                                        onClick={() => copyToClipboard(secret.password, "Đã copy mật khẩu!")}
                                        className="p-1 hover:bg-secondary rounded transition-colors"
                                      >
                                        <Copy className="w-3 h-3 text-primary" />
                                      </button>
                                    </div>
                                  </div>
                                  {secret.extraInfo && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                                      <Info className="w-3 h-3" />
                                      <span className="truncate max-w-[250px]">{secret.extraInfo}</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest italic">Đang chờ bàn giao...</span>
                              )}
                            </td>

                            <td className="px-6 py-4 text-center">
                              <div className="inline-flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5 opacity-50" />
                                <span className="text-[11px] font-bold">
                                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <p className="font-bold text-primary tabular-nums">{order.totalAmount.toLocaleString("vi-VN")} VND</p>
                            </td>

                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => router.push(`/orders/${order.id}`)}
                                className="p-2 bg-background border border-border text-foreground rounded-xl hover:bg-secondary active:scale-90 transition-all shadow-sm"
                                title="Xem chi tiết đơn hàng"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        )
                      })
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/30">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trang {currentPage} / {totalPages}</div>
              <div className="flex items-center space-x-2">
                <PaginationButton onClick={() => goToPage(1)} disabled={currentPage === 1} icon={<ChevronsLeft className="w-4 h-4" />} />
                <PaginationButton onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} icon={<ChevronLeft className="w-4 h-4" />} />
                <div className="px-4 text-xs font-black text-primary">{currentPage}</div>
                <PaginationButton onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} icon={<ChevronRight className="w-4 h-4" />} />
                <PaginationButton onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} icon={<ChevronsRight className="w-4 h-4" />} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function SummaryCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-xl font-bold mt-1.5 text-foreground tabular-nums tracking-tight">{value}</p>
        </div>
        <div className={cn("w-10 h-10 rounded-xl bg-secondary flex items-center justify-center transition-transform group-hover:scale-110", color)}>{icon}</div>
      </div>
    </div>
  )
}

function PaginationButton({ onClick, disabled, icon }: { onClick: () => void, disabled: boolean, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm",
        disabled ? "opacity-20 cursor-not-allowed" : "active:scale-90"
      )}
    >
      {icon}
    </button>
  )
}
