"use client"

import { useState, useTransition } from "react"
import { Save, Building2, CreditCard, User } from "lucide-react"
import { cn } from "@/lib/utils"
import AdminHeader from "@/components/admin/AdminHeader"
import { updateSellerBankInfo } from "@/app/seller/settings/actions"
import { useUI } from "@/providers/UIProvider"

interface SellerSettingsClientProps {
  initialData: {
    bankName: string
    accountNumber: string
    accountName: string
  }
}

const BANKS = [
  "Vietcombank (VCB)",
  "Techcombank (TCB)",
  "MB Bank",
  "ACB",
  "VPBank",
  "TPBank",
  "Sacombank",
  "BIDV",
  "Agribank",
  "VietinBank",
  "SHB",
  "HDBank",
  "OCB",
  "MSB",
  "LienVietPostBank",
  "SeABank",
  "Eximbank",
  "VIB",
  "Nam A Bank",
  "Bac A Bank",
  "MOMO",
  "ZaloPay",
  "Khác"
]

export default function SellerSettingsClient({ initialData }: SellerSettingsClientProps) {
  const { addMessage } = useUI()
  const [bankName, setBankName] = useState(initialData.bankName)
  const [accountNumber, setAccountNumber] = useState(initialData.accountNumber)
  const [accountName, setAccountName] = useState(initialData.accountName)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (!bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
      addMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin" })
      return
    }

    startTransition(async () => {
      try {
        const result = await updateSellerBankInfo({
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          accountName: accountName.trim(),
        })
        
        if (result.success) {
          addMessage({ type: "success", text: result.message })
        } else {
          addMessage({ type: "error", text: result.message })
        }
      } catch (error) {
        addMessage({ type: "error", text: "Đã có lỗi xảy ra, vui lòng thử lại sau" })
      }
    })
  }

  const hasChanges = bankName !== initialData.bankName ||
    accountNumber !== initialData.accountNumber ||
    accountName !== initialData.accountName

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Cài Đặt Cửa Hàng"
        subtitle="Quản lý thông tin tài khoản ngân hàng để rút tiền nhanh chóng"
      />

      {/* Bank Info Card */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Building2 className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Thông Tin Ngân Hàng</p>
              <p className="text-xl font-bold text-foreground">Tài Khoản Rút Tiền Mặc Định</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Bank Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" />
              Ngân hàng
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">-- Chọn Ngân Hàng --</option>
              {BANKS.map((bank) => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5" />
              Số tài khoản
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Nhập Số Tài Khoản..."
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Account Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Tên chủ tài khoản
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value.toUpperCase())}
              placeholder="VD: NGUYEN VAN A"
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSubmit}
            disabled={isPending || !hasChanges}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-[0.98]",
              hasChanges
                ? "bg-foreground text-background hover:opacity-90 shadow-lg shadow-foreground/10"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
          >
            <Save className="w-4 h-4" />
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  )
}
