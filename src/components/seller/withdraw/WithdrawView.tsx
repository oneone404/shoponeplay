"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DollarSign, Landmark, History, ArrowRight, Loader2, Settings as SettingsIcon, AlertCircle } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import AdminHeader from "../../admin/AdminHeader"
import { formatCurrency } from "@/lib/utils"
import { SELLER_ROUTES } from "@/lib/config/seller-routes"

interface WithdrawalRecord {
  id: string
  amount: number
  bankName: string
  accountNumber: string
  accountName: string
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "REJECTED"
  createdAt: Date
}

interface WithdrawViewProps {
  balance: number
  totalDeposited: number
  totalWithdrawn: number
  onRequestWithdraw: (data: any) => Promise<{ success: boolean; message: string }>
  defaultBankInfo?: {
    bankName: string
    accountNumber: string
    accountName: string
  }
}

export default function WithdrawView({
  balance,
  totalDeposited,
  totalWithdrawn,
  onRequestWithdraw,
  defaultBankInfo
}: WithdrawViewProps) {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const { addMessage } = useUI()

  const isConfigured = !!(defaultBankInfo?.bankName && defaultBankInfo?.accountNumber && defaultBankInfo?.accountName)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConfigured) return

    setLoading(true)

    const withdrawAmount = parseFloat(amount)
    if (isNaN(withdrawAmount) || withdrawAmount < 50000) {
      addMessage({ type: "error", text: "Số tiền rút tối thiểu là 50.000 VND" })
      setLoading(false)
      return
    }

    if (withdrawAmount > balance) {
      addMessage({ type: "error", text: "Số dư không đủ để thực hiện giao dịch" })
      setLoading(false)
      return
    }

    try {
      const result = await onRequestWithdraw({
        amount: withdrawAmount,
        bankName: defaultBankInfo?.bankName,
        accountNumber: defaultBankInfo?.accountNumber,
        accountName: defaultBankInfo?.accountName
      })

      if (result.success) {
        addMessage({ type: "success", text: result.message })
        setAmount("")
      } else {
        addMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Đã có lỗi xảy ra, vui lòng thử lại sau" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <AdminHeader title="Ví Tiền" subtitle="Quản lý số dư và thực hiện yêu cầu rút tiền của bạn" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-4 group transition-all hover:border-primary/30">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Số dư khả dụng</p>
            <p className="text-xl font-bold text-foreground tabular-nums">
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        {/* Total Deposited Card */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-4 group transition-all hover:border-blue-500/30">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500/20">
            <History className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Tổng Nạp</p>
            <p className="text-xl font-bold text-foreground tabular-nums">
              {formatCurrency(totalDeposited)}
            </p>
          </div>
        </div>

        {/* Total Withdrawn Card */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-4 group transition-all hover:border-amber-500/30">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500/20">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Tổng đã rút</p>
            <p className="text-xl font-bold text-foreground tabular-nums">
              {formatCurrency(totalWithdrawn)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Withdrawal Form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">Yêu cầu rút tiền</h3>
            </div>
            {isConfigured && (
              <Link
                href={SELLER_ROUTES.SETTINGS.path}
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
              >
                <SettingsIcon className="w-3 h-3" />
                Thay đổi ngân hàng
              </Link>
            )}
          </div>

          {!isConfigured ? (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-sm">Chưa thiết lập tài khoản ngân hàng</h4>
                <p className="text-xs text-muted-foreground font-bold">Vui Lòng Cấu Hình Tài Khoản Ngân Hàng Để Tiếp Tục.</p>
              </div>
              <Link
                href={SELLER_ROUTES.SETTINGS.path}
                className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <SettingsIcon className="w-4 h-4" />
                Đến Trang Cài Đặt Ngay
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Compact Bank Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ngân hàng</p>
                  <p className="text-xs font-bold text-foreground">{defaultBankInfo?.bankName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Số tài khoản</p>
                  <p className="text-xs font-bold text-foreground tabular-nums">{defaultBankInfo?.accountNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chủ tài khoản</p>
                  <p className="text-xs font-bold text-foreground uppercase">{defaultBankInfo?.accountName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Số tiền rút</label>
                    <span className="text-[10px] text-muted-foreground font-bold">Tối Thiểu: <span className="text-foreground">50.000 VND</span></span>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-lg tabular-nums"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">VND</div>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-bold mb-4">Số Dư Hiện Tại: <span className="text-emerald-500">{formatCurrency(balance)}</span></p>

                  <button
                    type="submit"
                    disabled={loading || !amount || parseFloat(amount) <= 0}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-background border border-border text-foreground rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm group/btn w-full sm:w-fit"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-primary group-hover/btn:scale-110 transition-transform" />
                    )}
                    <span>Gửi Yêu Cầu</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
