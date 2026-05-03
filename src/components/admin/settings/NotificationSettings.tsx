"use client"

import { useState, useEffect } from "react"
import { Bell, MessageSquare, Save, Loader2, ToggleLeft, ToggleRight } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { cn } from "@/lib/utils"

export default function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const { addMessage } = useUI()

  const [formData, setFormData] = useState({
    TELEGRAM_TOKEN: "",
    TELEGRAM_ID: "",
    TELEGRAM_ENABLED: "false"
  })

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/config?keys=TELEGRAM_TOKEN,TELEGRAM_ID,TELEGRAM_ENABLED")
      const data = await res.json()
      if (res.ok) {
        setFormData({
          TELEGRAM_TOKEN: data.TELEGRAM_TOKEN || "",
          TELEGRAM_ID: data.TELEGRAM_ID || "",
          TELEGRAM_ENABLED: data.TELEGRAM_ENABLED || "false"
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        addMessage({ type: 'success', text: "Cập nhật cấu hình thông báo thành công!" })
      } else {
        throw new Error("Lỗi khi lưu cấu hình")
      }
    } catch (err: any) {
      addMessage({ type: 'error', text: err.message || "Có lỗi xảy ra, vui lòng thử lại sau" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendTest = async () => {
    setIsSendingTest(true)
    try {
      const res = await fetch("/api/admin/config/test-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (res.ok) {
        addMessage({ type: 'success', text: "Đã gửi tin nhắn test thành công! Hãy kiểm tra Telegram." })
      } else {
        throw new Error(data.error || "Lỗi khi gửi test")
      }
    } catch (err: any) {
      addMessage({ type: 'error', text: err.message || "Không thể gửi tin nhắn test. Hãy kiểm tra Token và ID." })
    } finally {
      setIsSendingTest(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Telegram Config */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
              Thông báo Telegram (Withdrawals)
            </h3>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, TELEGRAM_ENABLED: prev.TELEGRAM_ENABLED === "true" ? "false" : "true" }))}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all",
                formData.TELEGRAM_ENABLED === "true" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
              )}
            >
              {formData.TELEGRAM_ENABLED === "true" ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {formData.TELEGRAM_ENABLED === "true" ? "ĐANG BẬT" : "ĐANG TẮT"}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Telegram Bot Token</label>
              <input
                type="text"
                value={formData.TELEGRAM_TOKEN}
                onChange={e => setFormData({ ...formData, TELEGRAM_TOKEN: e.target.value })}
                placeholder="7816461580:..."
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Telegram Chat ID (Admin)</label>
              <input
                type="text"
                value={formData.TELEGRAM_ID}
                onChange={e => setFormData({ ...formData, TELEGRAM_ID: e.target.value })}
                placeholder="5661137513"
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSendTest}
              disabled={isSaving || isSendingTest || !formData.TELEGRAM_TOKEN || !formData.TELEGRAM_ID}
              className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
            >
              {isSendingTest ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bell className="w-3 h-3" />}
              Gửi Test
            </button>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Bot sẽ gửi thông báo cho mỗi yêu cầu rút tiền mới của Seller. <br/>
              Bạn có thể lấy Chat ID bằng cách nhắn tin cho <code className="text-blue-500">@userinfobot</code>.
            </p>
          </div>
          <p className="text-[9px] text-muted-foreground/60 italic">
            * Webhook sẽ tự động được kích hoạt khi bạn nhấn <b>Lưu cấu hình</b> (chỉ hoạt động trên tên miền HTTPS công khai).
          </p>
        </div>

        {/* Future Notification Types */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm opacity-50">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <div className="w-1.5 h-4 bg-muted rounded-full" />
            Các loại thông báo khác (Sắp ra mắt)
          </h3>
          <p className="text-[10px] text-muted-foreground italic">Cấu hình thông báo cho đơn hàng mới, nạp tiền thành công, v.v. sẽ được cập nhật trong tương lai.</p>
        </div>


        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-foreground text-background rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu cấu hình
          </button>
        </div>
      </form>
    </div>
  )
}
