"use client"

import { useState } from "react"
import { DollarSign, Landmark, History, ArrowRight, Loader2 } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import AdminHeader from "../../admin/AdminHeader"
import { formatCurrency } from "@/lib/utils"

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
  history: WithdrawalRecord[]
  onRequestWithdraw: (data: any) => Promise<{ success: boolean; message: string }>
}

export default function WithdrawView({ balance, history, onRequestWithdraw }: WithdrawViewProps) {
  const [amount, setAmount] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [loading, setLoading] = useState(false)
  const { addMessage } = useUI()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        bankName,
        accountNumber,
        accountName
      })

      if (result.success) {
        addMessage({ type: "success", text: result.message })
        setAmount("")
        // Refresh page or update local state could be done via router.refresh() in the caller
      } else {
        addMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Đã có lỗi xảy ra, vui lòng thử lại sau" })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">ĐANG CHỜ</span>
      case "COMPLETED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500">HOÀN TẤT</span>
      case "REJECTED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500">TỪ CHỐI</span>
      case "CANCELLED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">ĐÃ HỦY</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <AdminHeader title="Ví Tiền" subtitle="Quản lý số dư và các giao dịch của bạn" />

      <div className="space-y-6">
        {/* Withdrawal Form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">Yêu cầu rút tiền</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Số tiền rút</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Tối Thiểu 50.000 VND"
                      className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Số Dư Khả Dụng: <span className="text-primary">{formatCurrency(balance)}</span></p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tên ngân hàng</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-xs"
                    required
                  >
                    <option value="">Chọn Ngân Hàng</option>
                    <option value="MBBANK">MBBANK (MB)</option>
                    <option value="VIETCOMBANK">VIETCOMBANK (VCB)</option>
                    <option value="VIETINBANK">VIETINBANK (ICB)</option>
                    <option value="TECHCOMBANK">TECHCOMBANK (TCB)</option>
                    <option value="AGRIBANK">AGRIBANK (VBA)</option>
                    <option value="BIDV">BIDV</option>
                    <option value="ACB">ACB</option>
                    <option value="VPBANK">VPBANK (VPB)</option>
                    <option value="TPBANK">TPBANK (TPB)</option>
                    <option value="SACOMBANK">SACOMBANK (STB)</option>
                    <option value="HDBANK">HDBANK (HDB)</option>
                    <option value="VIB">VIB</option>
                    <option value="MSB">MSB</option>
                    <option value="SEABANK">SEABANK</option>
                    <option value="OCB">OCB</option>
                    <option value="EXIMBANK">EXIMBANK</option>
                    <option value="LPBANK">LPBANK (LPB)</option>
                    <option value="SHB">SHB</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Số tài khoản</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Nhập Số Tài Khoản"
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tên chủ tài khoản</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="VIET HOA KHONG DAU"
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
                    required
                  />
                </div>
              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-6 py-2.5 bg-background border border-border text-foreground rounded-xl font-bold text-xs md:text-sm hover:bg-secondary active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Gửi Yêu Cầu</span>
              </button>
            </form>
          </div>

          {/* History Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest flex items-center">
                <History className="w-4 h-4 mr-2 text-primary" />
                Lịch sử giao dịch ví
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold">Ngày tạo</th>
                    <th className="px-6 py-4 font-bold">Ngân hàng</th>
                    <th className="px-6 py-4 font-bold text-right">Số tiền</th>
                    <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        CHƯA CÓ GIAO DỊCH NÀO
                      </td>
                    </tr>
                  ) : (
                    history.map((record) => (
                      <tr key={record.id} className="hover:bg-secondary/10 transition-colors">
                        <td className="px-6 py-4 text-xs">
                          {new Date(record.createdAt).toLocaleDateString("vi-VN")} {new Date(record.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-xs">{record.bankName}</span>
                            <span className="text-[10px] text-muted-foreground">{record.accountNumber} - {record.accountName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-primary">
                          {formatCurrency(record.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(record.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
  )
}
