"use client"

import { useState, useEffect } from "react"
import { Users, Save, Loader2, Percent, ShieldCheck, Banknote } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { PremiumLoader } from "@/components/utils/PremiumLoader"

export default function SellerSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { addMessage } = useUI()

  const [formData, setFormData] = useState({
    SELLER_FEE: "10"
  })

  useEffect(() => {
    fetch("/api/admin/settings/general")
      .then(res => res.json())
      .then(data => {
        setFormData({
          SELLER_FEE: data.SELLER_FEE || "10"
        })
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch("/api/admin/settings/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        addMessage({ type: "success", text: "Đã lưu cấu hình người bán thành công" })
      } else {
        throw new Error("Lỗi khi lưu cấu hình")
      }
    } catch (err) {
      addMessage({ type: "error", text: "Không thể lưu cấu hình" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <PremiumLoader />

  return (
    <div className="space-y-6">
      {/* Phí sàn & Chính sách */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Percent className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Chiết khấu & Chính sách Seller</h3>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            title="Lưu cấu hình người bán"
            className="p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side: Inputs */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">
                  Phí sàn mặc định (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="SELLER_FEE"
                    value={formData.SELLER_FEE}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full px-5 py-4 bg-secondary/30 border border-border rounded-2xl focus:border-primary/50 focus:bg-secondary/50 outline-none transition-all font-bold pr-12"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">%</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic ml-1 leading-relaxed">
                  * Ví dụ: 10% nghĩa là khi bán được 100.000 VNĐ, hệ thống thu 10.000 VNĐ, người bán nhận được 90.000 VNĐ.
                </p>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Banknote className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold uppercase">Luồng tiền Seller</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Doanh thu sẽ được cộng trực tiếp vào số dư của Seller ngay khi đơn hàng hoàn tất. Phí sàn được khấu trừ tự động dựa trên cấu hình này.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Info/Notice */}
            <div className="space-y-6">
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest">Bảo mật tài chính</h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Mọi giao dịch mua bán đều được hệ thống giám sát và bảo vệ. Đảm bảo tính minh bạch và công bằng cho cả người mua và cộng tác viên bán hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
