"use client"

import { useMemo, useState, useTransition } from "react"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Building2,
  CreditCard,
  User as UserIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
  Check,
  X,
  ExternalLink,
  QrCode,
  Loader2
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import AdminHeader from "../AdminHeader"
import { handleWithdrawalAction } from "@/app/admin/withdrawals/actions"
import { useUI } from "@/providers/UIProvider"

interface Withdrawal {
  id: string
  userId: string
  amount: number
  bankName: string
  accountNumber: string
  accountName: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

interface AdminWithdrawalsClientProps {
  initialWithdrawals: Withdrawal[]
}

export default function AdminWithdrawalsClient({
  initialWithdrawals
}: AdminWithdrawalsClientProps) {
  const { addMessage } = useUI()
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isPending, startTransition] = useTransition()
  const itemsPerPage = 15

  const filteredWithdrawals = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return initialWithdrawals.filter((item) => {
      return !keyword ||
        item.id.toLowerCase().includes(keyword) ||
        item.user.email?.toLowerCase().includes(keyword) ||
        item.user.name?.toLowerCase().includes(keyword) ||
        item.bankName.toLowerCase().includes(keyword) ||
        item.accountNumber.toLowerCase().includes(keyword)
    })
  }, [initialWithdrawals, search])

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage)
  const currentItems = filteredWithdrawals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const [selectedQR, setSelectedQR] = useState<Withdrawal | null>(null)
  const [qrLoading, setQrLoading] = useState(true)

  const onAction = (withdrawalId: string, action: "done" | "cancel") => {
    if (isPending) return

    startTransition(async () => {
      const result = await handleWithdrawalAction(withdrawalId, action)
      if (result.success) {
        addMessage({ type: "success", text: result.message })
        if (selectedQR?.id === withdrawalId) setSelectedQR(null)
      } else {
        addMessage({ type: "error", text: result.message })
      }
    })
  }

  const getQRUrl = (item: Withdrawal) => {
    const bankId = getBankId(item.bankName)
    const addInfo = encodeURIComponent(`RT ${item.userId.slice(-6).toUpperCase()}`)
    const accountName = encodeURIComponent(item.accountName.toUpperCase())
    return `https://img.vietqr.io/image/${bankId}-${item.accountNumber}-compact2.jpg?amount=${item.amount}&addInfo=${addInfo}&accountName=${accountName}`
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "COMPLETED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "REJECTED": return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case "PENDING": return "ĐANG CHỜ"
      case "COMPLETED": return "HOÀN TẤT"
      case "REJECTED": return "ĐÃ TỪ CHỐI"
      default: return status
    }
  }

  const getBankId = (bankName: string) => {
    const match = bankName.match(/\(([^)]+)\)/)
    const short = match ? match[1] : bankName.trim()
    
    const mapping: Record<string, string> = {
      "vcb": "VCB", "vietcombank": "VCB",
      "tcb": "TCB", "techcombank": "TCB",
      "mb": "MB", "mbbank": "MB", "mb bank": "MB",
      "acb": "ACB",
      "vpb": "VPB", "vpbank": "VPB",
      "tpb": "TPB", "tpbank": "TPB",
      "stb": "STB", "sacombank": "STB",
      "bidv": "BIDV",
      "vba": "VBA", "agribank": "VBA",
      "icb": "ICB", "vietinbank": "ICB",
      "shb": "SHB",
      "hdb": "HDB", "hdbank": "HDB",
      "ocb": "OCB",
      "msb": "MSB",
      "lpb": "LPB", "lienvietpostbank": "LPB",
      "seab": "SEAB", "seabank": "SEAB",
      "eib": "EIB", "eximbank": "EIB",
      "vib": "VIB",
      "nab": "NAB", "nam a bank": "NAB",
      "bab": "BAB", "bac a bank": "BAB",
      "momo": "MOMO", "zalopay": "ZALOPAY"
    }
    return mapping[short.toLowerCase()] || short.toUpperCase().replace(/\s+/g, "")
  }

  return (
    <div className="space-y-6 relative">
      {/* QR Modal Overlay */}
      {selectedQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={() => setSelectedQR(null)}
          />
          <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 space-y-6 text-center">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">Mã QR Thanh Toán</h3>
                </div>
                <button 
                  onClick={() => setSelectedQR(null)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="relative aspect-square w-full bg-white rounded-2xl border border-border p-2 overflow-hidden shadow-inner flex items-center justify-center">
                {qrLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/50 backdrop-blur-[2px] z-10">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Đang tạo mã...</p>
                  </div>
                )}
                <img 
                  src={getQRUrl(selectedQR)} 
                  alt="QR Code" 
                  className={cn(
                    "w-full h-full object-contain p-2 transition-opacity duration-300",
                    qrLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => setQrLoading(false)}
                />
              </div>

              <div className="space-y-3 bg-secondary/30 p-4 rounded-2xl border border-border/50 text-left">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-muted-foreground uppercase tracking-wider">Số tiền</span>
                  <span className="text-primary">{new Intl.NumberFormat('vi-VN').format(selectedQR.amount)} VND</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-muted-foreground uppercase tracking-wider">Ngân hàng</span>
                  <span className="text-foreground">{selectedQR.bankName}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-muted-foreground uppercase tracking-wider">STK</span>
                  <span className="text-foreground tabular-nums">{selectedQR.accountNumber}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onAction(selectedQR.id, "done")}
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  Xác nhận đã chuyển
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminHeader
        title="Lịch Sử Thanh Toán"
        subtitle="Quản lý và phê duyệt các yêu cầu rút tiền từ Seller"
      />

      {/* Filter Area */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Tìm Theo ID, Seller, Email, Ngân Hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        />
      </div>

      {/* Table Area */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Yêu Cầu / Ngày Tạo</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Seller</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Thông Tin Nhận Tiền</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Số Tiền</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Trạng Thái</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[11px] font-bold">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="text-foreground uppercase tracking-tight">#{item.id.slice(-10).toUpperCase()}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary border border-border overflow-hidden shrink-0 relative">
                          {item.user.image ? (
                            <Image src={item.user.image} alt="" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <UserIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground truncate uppercase">{item.user.name || "Seller"}</p>
                          <p className="text-[9px] font-medium text-muted-foreground truncate">{item.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-foreground">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                          {item.bankName}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CreditCard className="w-3.5 h-3.5 opacity-50" />
                          <span className="tabular-nums">{item.accountNumber}</span>
                        </div>
                        <p className="text-[9px] uppercase text-muted-foreground ml-5.5">{item.accountName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-foreground tabular-nums">
                        {new Intl.NumberFormat('vi-VN').format(item.amount)} VND
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-widest",
                        getStatusStyle(item.status)
                      )}>
                        {item.status === "PENDING" && <Clock className="w-3 h-3" />}
                        {item.status === "COMPLETED" && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === "REJECTED" && <XCircle className="w-3 h-3" />}
                        {getStatusName(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setQrLoading(true)
                              setSelectedQR(item)
                            }}
                            className="inline-flex items-center justify-center gap-2 p-2 bg-background border border-border text-foreground rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-secondary active:scale-95 transition-all shadow-sm group/btn"
                            title="Quét QR Chuyển Khoản"
                          >
                            <QrCode className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-primary group-hover/btn:scale-110 transition-transform" />
                            <span className="hidden sm:inline">Thanh Toán</span>
                          </button>

                          <button
                            onClick={() => onAction(item.id, "done")}
                            disabled={isPending}
                            className="p-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                            title="Xác Nhận Hoàn Thành"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => onAction(item.id, "cancel")}
                            disabled={isPending}
                            className="p-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                            title="Từ Chối / Hoàn Tiền"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end pr-3">
                          <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground/30 border border-border/50">
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <History className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Không có yêu cầu rút tiền</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/30">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trang {currentPage} / {totalPages}</div>
            <div className="flex items-center space-x-2">
              <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"><ChevronsLeft className="w-4 h-4" /></button>
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-4 text-xs font-bold text-primary">{currentPage}</div>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all shadow-sm"><ChevronsRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
