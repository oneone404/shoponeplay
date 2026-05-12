"use client"

import { useEffect, useMemo, useState, useCallback, Suspense } from "react"
import Navbar from "@/components/layouts/Navbar"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  Search,
  Key,
  History,
  Calendar,
  SearchX,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  Monitor,
  Copy,
  ExternalLink,
  Loader2,
  X,
  AlertTriangle,
  RotateCcw,
  Trash2
} from "lucide-react"
import { useLanguage } from "@/providers/LanguageProvider"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import UserPageHeader from "@/components/shared/UserPageHeader"
import { useUI } from "@/providers/UIProvider"

interface HackOrder {
  id: string
  hackId: string
  duration: string
  machines: number
  totalPrice: number
  key: string
  status: string
  createdAt: string
  hack: {
    name: true,
    thumbnail: true,
    slug: true
  }
}

export default function HacksHistoryClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <HacksHistoryContent />
    </Suspense>
  )
}

function HacksHistoryContent() {
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

  // Modal State
  const [showManageModal, setShowManageModal] = useState(false)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [keyDetails, setKeyDetails] = useState<any>(null)
  const [isFetchingDetails, setIsFetchingDetails] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/hacks/my-orders/all")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng hack:", error)
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
      order.hack?.name.toLowerCase().includes(keyword) ||
      order.key?.toLowerCase().includes(keyword)
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
    spent: orders.reduce((acc, curr) => acc + curr.totalPrice, 0),
    keys: orders.length
  }

  const openManageModal = async (keyValue: string) => {
    setSelectedKey(keyValue)
    setShowManageModal(true)
    setIsFetchingDetails(true)
    try {
      const res = await fetch(`/api/hacks/manage-devices?key=${keyValue}`)
      if (res.ok) {
        const data = await res.json()
        setKeyDetails(data)
      } else {
        const err = await res.json()
        addMessage({ type: "error", text: err.error || "Không thể tải thông tin máy" })
      }
    } catch (e) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setIsFetchingDetails(false)
    }
  }

  const handleDeviceAction = async (action: 'reset' | 'delete', deviceIds?: string[]) => {
    if (!selectedKey) return
    
    const confirmMsg = action === 'reset' 
      ? "Bạn có chắc chắn muốn RESET toàn bộ thiết bị? Phí là 5,000 VND." 
      : `Bạn có chắc chắn muốn XÓA ${deviceIds?.length} thiết bị đã chọn? Phí là 5,000 VND.`

    if (!confirm(confirmMsg)) return

    setIsProcessing(true)
    try {
      const res = await fetch('/api/hacks/manage-devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyValue: selectedKey, action, deviceIds })
      })

      const data = await res.json()
      if (res.ok) {
        addMessage({ type: "success", text: data.message || "Thao tác thành công!" })
        openManageModal(selectedKey)
      } else {
        addMessage({ type: "error", text: data.error || "Thao tác thất bại" })
      }
    } catch (e) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <UserPageHeader
        subtitle="Quản Lý Danh Sách Key VIP Đã Mua"
        title="LỊCH SỬ"
        highlightTitle="MUA KEY"
      />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SummaryCard label="Tổng đơn hàng" value={stats.total.toLocaleString("vi-VN")} icon={<Package className="w-5 h-5" />} color="text-primary" />
          <SummaryCard label="Tổng chi tiêu" value={stats.spent.toLocaleString("vi-VN") + " VND"} icon={<CreditCard className="w-5 h-5" />} color="text-green-500" />
          <SummaryCard label="Số lượng Key" value={stats.keys.toLocaleString("vi-VN")} icon={<Key className="w-5 h-5" />} color="text-amber-500" />
        </div>

        {/* Table Container */}
        <div className="flex flex-col bg-card border border-border rounded-2xl overflow-visible shadow-sm">
          <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm Tên Hack, Mã Key..." 
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
                    <th className="px-6 py-4 font-bold">Thông tin bản hack</th>
                    <th className="px-6 py-4 font-bold text-center">Thời hạn</th>
                    <th className="px-6 py-4 font-bold">Mã Key VIP</th>
                    <th className="px-6 py-4 font-bold text-center">Tổng tiền</th>
                    <th className="px-6 py-4 font-bold text-right">Quản lý</th>
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
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Không tìm thấy key nào</p>
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
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border bg-secondary shrink-0">
                                <Image
                                  src={order.hack?.thumbnail || "/images/product.png"}
                                  fill
                                  sizes="48px"
                                  alt=""
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-foreground uppercase text-xs truncate max-w-[150px]">
                                  {order.hack?.name}
                                </p>
                                <p className="text-[9px] text-muted-foreground font-bold mt-0.5 uppercase tracking-widest">
                                  Ngày: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className="px-2 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-lg uppercase border border-primary/10">
                                {order.duration}
                              </span>
                              <span className="text-[9px] font-bold text-muted-foreground mt-1 uppercase">{order.machines} Thiết Bị</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <code 
                                onClick={() => {
                                  navigator.clipboard.writeText(order.key)
                                  addMessage({ type: "success", text: "Đã copy key!" })
                                }}
                                className="bg-background border border-border px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-foreground cursor-pointer hover:border-primary/50 transition-all shadow-sm"
                              >
                                {order.key.substring(0, 15)}...
                              </code>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(order.key)
                                  addMessage({ type: "success", text: "Đã copy key!" })
                                }}
                                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <p className="font-bold text-amber-500 tabular-nums">{order.totalPrice.toLocaleString("vi-VN")} VND</p>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openManageModal(order.key)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border text-foreground rounded-lg font-bold text-[9px] uppercase tracking-widest hover:bg-secondary active:scale-95 transition-all shadow-sm"
                              >
                                <Monitor className="w-3 h-3" />
                                <span>QL Máy</span>
                              </button>
                              <button
                                onClick={() => router.push(`/app/hacks/${order.hack?.slug}`)}
                                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                                title="Xem bản hack"
                              >
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
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

      {/* Manage Devices Modal - Reused from HackPurchaseHistory */}
      {showManageModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowManageModal(false)}>
          <div className="absolute inset-0 bg-black/50 transition-opacity" />
          <div 
            className="relative w-full max-w-lg bg-card border-2 border-border rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">Quản Lý Thiết Bị</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Key: {selectedKey?.substring(0, 15)}...</p>
                </div>
              </div>
              <button onClick={() => setShowManageModal(false)} className="p-2 hover:bg-secondary rounded-xl transition-all text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isFetchingDetails ? (
                <div className="py-20 text-center animate-pulse"><Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" /><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Đang tải danh sách máy...</p></div>
              ) : keyDetails ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-4 rounded-2xl border border-border">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Giới Hạn Máy</p>
                      <p className="text-lg font-bold text-foreground tabular-nums">{keyDetails.device_limit} THIẾT BỊ</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-2xl border border-border">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Đang Sử Dụng</p>
                      <p className="text-lg font-bold text-amber-500">{(keyDetails.devices || []).length} / {keyDetails.device_limit}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Danh Sách Máy Đã Lưu</h4>
                    {(keyDetails.devices || []).length === 0 ? (
                      <div className="py-10 text-center border-2 border-dashed border-border rounded-2xl text-xs font-bold text-muted-foreground uppercase tracking-widest">Chưa có máy nào kết nối</div>
                    ) : (
                      keyDetails.devices.map((device: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-secondary/10 border border-border rounded-2xl group hover:border-rose-500/20 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground border border-border"><Monitor className="w-4 h-4" /></div>
                            <div>
                              <p className="text-[11px] font-bold text-foreground leading-tight truncate max-w-[200px]">{device.device_model || "Thiết bị không tên"}</p>
                              <p className="text-[9px] text-muted-foreground font-bold truncate max-w-[200px]">{device.device_id}</p>
                            </div>
                          </div>
                          <button 
                            disabled={isProcessing}
                            onClick={() => handleDeviceAction('delete', [device.device_id])}
                            className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Lưu ý quan trọng</p>
                      <p className="text-[10px] text-muted-foreground font-bold leading-relaxed uppercase tracking-wider">
                        Phí cho mỗi lần Reset hoặc Xóa THIẾT BỊ là <span className="text-rose-500 font-black">5,000 VND</span>. Thao tác này sẽ giải phóng slot để bạn có thể đăng nhập trên THIẾT BỊ khác.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-6 border-t border-border bg-secondary/20 flex items-center gap-4">
              <button 
                disabled={isProcessing || isFetchingDetails || (keyDetails?.devices || []).length === 0}
                onClick={() => handleDeviceAction('reset')}
                className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
              >
                <RotateCcw className={cn("w-3.5 h-3.5", isProcessing && "animate-spin")} />
                {isProcessing ? "Đang Xử Lý..." : "Reset Toàn Bộ (5k)"}
              </button>
              <button onClick={() => setShowManageModal(false)} className="px-6 py-3 border border-border text-foreground rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary transition-all">Đóng</button>
            </div>
          </div>
        </div>
      )}
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
