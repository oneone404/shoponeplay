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
  Copy,
  Loader2
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

      <div className="space-y-8">
        {/* Top Section: General Config (Horizontal) */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Settings className="w-4 h-4" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Quy tắc nạp tiền tự động</h3>
            </div>
            <button
              onClick={handleSaveConfig}
              disabled={isPending}
              className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
              title="Lưu cấu hình"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Cú pháp trước ID</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary transition-all"
                  placeholder="Ví dụ: NAP"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Cú pháp sau ID</label>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary transition-all"
                  placeholder="Ví dụ: chuyen tien"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Webhook Token (Pay2S)</label>
                <input 
                  type="password" 
                  value={pay2sToken}
                  onChange={(e) => setPay2sToken(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary transition-all"
                  placeholder="Token từ Pay2S..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Nạp tối thiểu (VND)</label>
                <input
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl font-bold text-sm outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Preview & Save Action Integrated */}
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Xem trước nội dung:</span>
                </div>
                <p className="text-sm font-bold text-foreground tracking-tight">
                  {[prefix, "ABCDXYZ", suffix].filter(Boolean).join(" ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Bank List (Full Width) */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm h-fit">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Danh sách ngân hàng nhận</h3>
              </div>
              <button
                onClick={() => {
                  setEditingBank({ isActive: true })
                  setShowForm(true)
                }}
                className="px-3 py-1.5 bg-white text-muted-foreground border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/50 transition-all flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm ngân hàng
              </button>
            </div>

            <div className="p-6 space-y-6">
              {showForm && (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-in slide-in-from-top-4 duration-300 mb-8">
                  <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {editingBank?.id ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                        {editingBank?.id ? "Chỉnh sửa ngân hàng" : "Thêm ngân hàng mới"}
                      </h3>
                    </div>
                    <button
                      onClick={handleSaveBank}
                      disabled={isPending}
                      className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
                      title="Lưu ngân hàng"
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Chọn Ngân Hàng</label>
                        <div className="relative group">
                          <select
                            value={editingBank?.bankName || ""}
                            onChange={(e) => handleBankSelect(e.target.value)}
                            className="w-full px-5 py-4 bg-background/50 border border-border rounded-2xl font-bold text-sm outline-none focus:border-primary cursor-pointer appearance-none transition-all"
                          >
                            <option value="">-- Chọn Ngân Hàng --</option>
                            {VIETNAM_BANKS.map(b => (
                              <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                            ))}
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                            <Building2 className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Số Tài Khoản</label>
                        <input
                          type="text"
                          placeholder="Nhập số tài khoản..."
                          value={editingBank?.accountNumber || ""}
                          onChange={(e) => setEditingBank({ ...editingBank, accountNumber: e.target.value })}
                          className="w-full px-5 py-4 bg-background/50 border border-border rounded-2xl font-bold text-sm outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Chủ Tài Khoản</label>
                        <input
                          type="text"
                          placeholder="Tên người nhận (VIET HOA)..."
                          value={editingBank?.accountName || ""}
                          onChange={(e) => setEditingBank({ ...editingBank, accountName: e.target.value.toUpperCase() })}
                          className="w-full px-5 py-4 bg-background/50 border border-border rounded-2xl font-bold text-sm outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Logo URL (Tùy chọn)</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={editingBank?.logo || ""}
                          onChange={(e) => setEditingBank({ ...editingBank, logo: e.target.value })}
                          className="w-full px-5 py-4 bg-background/50 border border-border rounded-2xl font-bold text-sm outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/50">
                      <button
                        onClick={() => setShowForm(false)}
                        className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all hover:bg-secondary/50 rounded-xl"
                      >
                        Hủy bỏ
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {initialBanks.map((bank) => (
                  <div key={bank.id} className={cn(
                    "group relative bg-background border border-border rounded-2xl p-4 transition-all hover:border-primary/20 hover:shadow-md flex flex-col md:flex-row items-center justify-between gap-4",
                    !bank.isActive && "opacity-60 grayscale-[0.5]"
                  )}>
                    <div className="flex items-center space-x-4 flex-1 w-full">
                      <div className="w-12 h-12 min-w-[48px] rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden p-2 shadow-inner">
                        {bank.logo ? (
                          <img src={bank.logo} alt={bank.bankName} className="w-full h-full object-contain" />
                        ) : (
                          <Banknote className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-[11px] font-bold text-foreground uppercase tracking-tight leading-none mb-1">{bank.bankName}</h4>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{bank.accountNumber}</p>
                        </div>
                        <div className="hidden md:block">
                          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Chủ Tài Khoản</span>
                          <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">{bank.accountName}</span>
                        </div>
                        <div className="flex items-center md:justify-center">
                          <div className={cn(
                            "px-2.5 py-1 rounded-md text-[8px] font-bold uppercase tracking-[0.1em] border h-fit",
                            bank.isActive ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" : "bg-slate-500/5 text-slate-500 border-slate-500/20"
                          )}>
                            {bank.isActive ? "Hoạt động" : "Tạm ngưng"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border/50">
                      <div className="flex items-center space-x-1">
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
                      
                      <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" />

                      <button
                        onClick={() => handleToggle(bank)}
                        className={cn(
                          "p-2 rounded-lg transition-colors flex items-center space-x-2 group/toggle",
                          bank.isActive ? "text-emerald-500" : "text-muted-foreground"
                        )}
                      >
                        <span className="text-[9px] font-bold uppercase tracking-widest hidden lg:block opacity-0 group-hover/toggle:opacity-100 transition-opacity">
                          {bank.isActive ? "Tắt" : "Bật"}
                        </span>
                        {bank.isActive ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                      </button>
                    </div>
                  </div>
                ))}

                {initialBanks.length === 0 && !showForm && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[32px] space-y-4 bg-secondary/10 opacity-50">
                    <div className="p-4 bg-background rounded-full shadow-inner">
                      <Building2 className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Chưa có ngân hàng nào</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
