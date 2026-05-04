"use client"

import { useState, useTransition } from "react"
import {
  Building2,
  CreditCard,
  User as UserIcon,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Save,
  Settings,
  Info,
  Banknote,
  Copy
} from "lucide-react"
import AdminHeader from "../AdminHeader"
import { upsertBank, deleteBank, updateDepositConfig } from "@/app/admin/settings/banks/actions"
import { useUI } from "@/providers/UIProvider"
import { cn } from "@/lib/utils"

const VIETNAM_BANKS = [
  { id: "VCB", name: "Vietcombank", logo: "https://api.vietqr.io/img/VCB.png" },
  { id: "MB", name: "MB Bank", logo: "/images/banks/mbbank.svg" },
  { id: "TCB", name: "Techcombank", logo: "https://api.vietqr.io/img/TCB.png" },
  { id: "ACB", name: "ACB", logo: "/images/banks/acb.svg" },
  { id: "BIDV", name: "BIDV", logo: "https://api.vietqr.io/img/BIDV.png" },
  { id: "ICB", name: "VietinBank", logo: "https://api.vietqr.io/img/ICB.png" },
  { id: "VBA", name: "Agribank", logo: "https://api.vietqr.io/img/VBA.png" },
  { id: "STB", name: "Sacombank", logo: "https://api.vietqr.io/img/STB.png" },
  { id: "TPB", name: "TPBank", logo: "https://api.vietqr.io/img/TPB.png" },
  { id: "VPB", name: "VPBank", logo: "https://api.vietqr.io/img/VPB.png" },
  { id: "VIB", name: "VIB", logo: "https://api.vietqr.io/img/VIB.png" },
  { id: "HDB", name: "HDBank", logo: "https://api.vietqr.io/img/HDB.png" },
  { id: "OCB", name: "OCB", logo: "https://api.vietqr.io/img/OCB.png" },
  { id: "MSB", name: "MSB", logo: "https://api.vietqr.io/img/MSB.png" },
  { id: "SHB", name: "SHB", logo: "https://api.vietqr.io/img/SHB.png" },
  { id: "LPB", name: "LPBank", logo: "https://api.vietqr.io/img/LPB.png" },
  { id: "SEAB", name: "SeaBank", logo: "https://api.vietqr.io/img/SEAB.png" },
  { id: "MOMO", name: "Ví MoMo", logo: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" },
  { id: "ZALOPAY", name: "Ví ZaloPay", logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-V.png" },
]

interface Bank {
  id: string
  bankName: string
  accountNumber: string
  accountName: string
  logo: string | null
  isActive: boolean
}

interface AdminBanksClientProps {
  initialBanks: Bank[]
  initialPrefix: string
  initialSuffix: string
  initialPay2sToken: string
  initialMinAmount: number
}

export default function AdminBanksClient({
  initialBanks,
  initialPrefix,
  initialSuffix,
  initialPay2sToken,
  initialMinAmount
}: AdminBanksClientProps) {
  const { addMessage } = useUI()
  const [isPending, startTransition] = useTransition()

  // Config state
  const [prefix, setPrefix] = useState(initialPrefix)
  const [suffix, setSuffix] = useState(initialSuffix)
  const [pay2sToken, setPay2sToken] = useState(initialPay2sToken)
  const [minAmount, setMinAmount] = useState(initialMinAmount)

  // Bank Form state
  const [editingBank, setEditingBank] = useState<Partial<Bank> | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleSaveConfig = () => {
    startTransition(async () => {
      const result = await updateDepositConfig(prefix, minAmount, suffix, pay2sToken)
      if (result.success) {
        addMessage({ type: "success", text: "Cập nhật cấu hình nạp tiền thành công" })
      }
    })
  }

  const handleSaveBank = () => {
    if (!editingBank?.bankName || !editingBank?.accountNumber || !editingBank?.accountName) {
      addMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin bắt buộc" })
      return
    }

    startTransition(async () => {
      const result = await upsertBank(editingBank as any)
      if (result.success) {
        addMessage({ type: "success", text: editingBank.id ? "Cập nhật ngân hàng thành công" : "Thêm ngân hàng mới thành công" })
        setShowForm(false)
        setEditingBank(null)
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ngân hàng này?")) return
    startTransition(async () => {
      const result = await deleteBank(id)
      if (result.success) {
        addMessage({ type: "success", text: "Đã xóa ngân hàng" })
      }
    })
  }

  const handleToggle = (bank: Bank) => {
    startTransition(async () => {
      await upsertBank({ ...bank, isActive: !bank.isActive })
    })
  }

  const handleBankSelect = (bankId: string) => {
    const selectedBankInfo = VIETNAM_BANKS.find(b => b.id === bankId)
    if (selectedBankInfo) {
      setEditingBank(prev => ({
        ...prev,
        bankName: selectedBankInfo.id,
        logo: selectedBankInfo.logo
      }))
    } else {
      setEditingBank(prev => ({
        ...prev,
        bankName: "",
        logo: ""
      }))
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <AdminHeader
        title="Cấu Hình Nạp Tiền"
        subtitle="Quản lý ngân hàng thụ hưởng và quy tắc nạp tiền tự động"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: General Config */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">Quy tắc nạp tiền</h3>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Cú pháp trước ID</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary transition-all"
                  placeholder="Ví dụ: NAP (Có thể để trống)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Cú pháp sau ID</label>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary transition-all"
                  placeholder="Ví dụ: chuyen tien (Có thể để trống)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Pay2S Webhook Token</label>
                <input 
                  type="password" 
                  value={pay2sToken}
                  onChange={(e) => setPay2sToken(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary transition-all"
                  placeholder="Nhập token từ Pay2S..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Nạp tối thiểu (VND)</label>
                <input
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <button
                onClick={handleSaveConfig}
                disabled={isPending}
                className="w-full py-3 bg-foreground text-background rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu cấu hình
              </button>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-500">
              <h4 className="text-[10px] font-bold uppercase tracking-widest">Xem trước nội dung:</h4>
              <span className="text-xs font-black text-foreground bg-white/50 px-2 py-0.5 rounded border border-amber-500/20">
                {[prefix, "ABCDXYZ", suffix].filter(Boolean).join(" ")}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
              Hệ thống sẽ tự động cộng tiền khi nhận được biến động số dư có nội dung chứa cú pháp trên.
              Mã ID 12345678 là ví dụ cho ID tài khoản của người dùng.
            </p>
          </div>
        </div>

        {/* Right Column: Bank List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">Danh sách ngân hàng nhận</h3>
            </div>
            <button
              onClick={() => {
                setEditingBank({ isActive: true })
                setShowForm(true)
              }}
              className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Thêm ngân hàng
            </button>
          </div>

          {showForm && (
            <div className="bg-card border border-primary/30 rounded-2xl p-6 shadow-xl animate-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Chọn Ngân Hàng</label>
                  <select
                    value={editingBank?.bankName || ""}
                    onChange={(e) => handleBankSelect(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="">-- Chọn Ngân Hàng --</option>
                    {VIETNAM_BANKS.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Số Tài Khoản</label>
                  <input
                    type="text"
                    placeholder="Nhập số tài khoản..."
                    value={editingBank?.accountNumber || ""}
                    onChange={(e) => setEditingBank({ ...editingBank, accountNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Chủ Tài Khoản</label>
                  <input
                    type="text"
                    placeholder="Tên người nhận (VIET HOA)..."
                    value={editingBank?.accountName || ""}
                    onChange={(e) => setEditingBank({ ...editingBank, accountName: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Logo URL (Tùy chọn)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={editingBank?.logo || ""}
                    onChange={(e) => setEditingBank({ ...editingBank, logo: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSaveBank}
                  disabled={isPending}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  {editingBank?.id ? "Cập nhật" : "Lưu ngân hàng"}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialBanks.map((bank) => (
              <div key={bank.id} className={cn(
                "group relative bg-card border border-border rounded-2xl p-5 transition-all hover:border-primary/30 hover:shadow-md",
                !bank.isActive && "opacity-60 grayscale-[0.5]"
              )}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center overflow-hidden p-2 bg-white">
                      {bank.logo ? (
                        <img src={bank.logo} alt={bank.bankName} className="w-full h-full object-contain" />
                      ) : (
                        <Banknote className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground tracking-tight">{bank.bankName}</h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{bank.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggle(bank)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        bank.isActive ? "text-emerald-500 hover:bg-emerald-500/10" : "text-muted-foreground hover:bg-secondary"
                      )}
                      title={bank.isActive ? "Đang bật" : "Đang tắt"}
                    >
                      {bank.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground uppercase tracking-widest">Chủ TK:</span>
                    <span className="text-foreground uppercase">{bank.accountName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingBank(bank)
                        setShowForm(true)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(bank.id)}
                      className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-[0.1em]",
                    bank.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500"
                  )}>
                    {bank.isActive ? "Hoạt động" : "Tạm ngưng"}
                  </span>
                </div>
              </div>
            ))}

            {initialBanks.length === 0 && !showForm && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[32px] space-y-4">
                <div className="p-4 bg-secondary rounded-full">
                  <Building2 className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Chưa có ngân hàng nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
