"use client"

import { useEffect, useMemo, useState } from "react"
import Navbar from "@/components/layouts/Navbar"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  Search,
  ShoppingBag,
  Eye,
  SearchX,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  CheckCircle,
  ExternalLink
} from "lucide-react"
import { useLanguage } from "@/providers/LanguageProvider"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import PageHeader from "@/components/shared/PageHeader"

interface Order {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  items: any[]
}

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/shop/orders")
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()
    return orders.filter(order =>
      order.id.toLowerCase().includes(keyword) ||
      (order.items[0]?.titleSnapshot && order.items[0].titleSnapshot.toLowerCase().includes(keyword))
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
    success: orders.filter(o => o.status === "COMPLETED").length || orders.length // Assuming completed for now based on display
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <PageHeader
          subtitle=" Quản Lý Đơn Hàng Đã Mua"
          title="ĐƠN HÀNG"
          highlightTitle="ĐÃ MUA"
          className="!px-0"
        />

        {/* Summary Cards - Admin Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SummaryCard label="Tổng đơn hàng" value={stats.total.toLocaleString("vi-VN")} icon={<Package className="w-5 h-5" />} color="text-primary" />
          <SummaryCard label="Tổng chi tiêu" value={stats.spent.toLocaleString("vi-VN") + " VND"} icon={<CreditCard className="w-5 h-5" />} color="text-green-500" />
          <SummaryCard label="Đã hoàn tất" value={stats.success.toLocaleString("vi-VN")} icon={<CheckCircle className="w-5 h-5" />} color="text-blue-500" />
        </div>

        {/* Table Container */}
        <div className="flex flex-col bg-card border border-border rounded-2xl overflow-visible shadow-sm">
          {/* Filter Bar - Admin Style */}
          <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm Mã Đơn, Tên Sản Phẩm..." 
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
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold">Mã đơn hàng</th>
                    <th className="px-6 py-4 font-bold">Sản phẩm</th>
                    <th className="px-6 py-4 font-bold text-center">Ngày mua</th>
                    <th className="px-6 py-4 font-bold text-center">Tổng tiền</th>
                    <th className="px-6 py-4 font-bold text-right">Thao tác</th>
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
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Không tìm thấy đơn hàng nào</p>
                          </div>
                        </td>
                      </motion.tr>
                    ) : (
                      currentOrders.map((order, idx) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: idx * 0.02 }}
                          className="hover:bg-secondary/20 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-foreground">#{order.id.slice(-12).toUpperCase()}</span>
                              <div className="flex items-center mt-1 gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Thành công</span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-20 aspect-video rounded-lg overflow-hidden border border-border bg-secondary shrink-0 group/img">
                                <Image
                                  src={order.items[0]?.product?.thumbnail || "/images/product.png"}
                                  fill
                                  sizes="80px"
                                  alt=""
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-foreground truncate max-w-[200px] uppercase text-xs">
                                  {order.items[0]?.titleSnapshot || "Đơn hàng hệ thống"}
                                </p>
                                {order.items.length > 1 ? (
                                  <p className="text-[9px] font-bold text-primary uppercase tracking-tighter mt-0.5">+{order.items.length - 1} Sản Phẩm Khác</p>
                                ) : (
                                  <p className="text-[9px] text-muted-foreground font-medium uppercase mt-0.5">Mã SP: {order.items[0]?.productId?.slice(-8)}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-secondary/50 rounded-lg border border-border text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5 opacity-50" />
                              <span className="text-[11px] font-bold">
                                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <p className="font-bold text-primary">{order.totalAmount.toLocaleString("vi-VN")} VND</p>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end">
                              <button
                                onClick={() => router.push(`/orders/${order.id}`)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border text-foreground rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary active:scale-95 transition-all shadow-sm group/btn"
                              >
                                <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                <span>Xem Tài Khoản</span>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination - Admin Style */}
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

        {/* Footer Info */}
        <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
              Nhấn vào <span className="text-primary">"Xem Tài Khoản"</span> để nhận thông tin đăng nhập và xuất file TXT.
              Dữ liệu của bạn được bảo mật tuyệt đối trên hệ thống ShopOnePlay.
            </p>
          </div>
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
