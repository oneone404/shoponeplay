"use client"

import { useState, useEffect } from "react"
import { Bell, MessageSquare, Save, Loader2, ToggleLeft, ToggleRight } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { cn } from "@/lib/utils"

export default function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testType, setTestType] = useState<"withdraw" | "order">("withdraw")
  const { addMessage } = useUI()

  const [formData, setFormData] = useState({
    TELEGRAM_TOKEN: "",
    TELEGRAM_ID: "",
    TELEGRAM_ENABLED: "false",
    TELEGRAM_NOTIFY_ORDER: "true",
    TELEGRAM_NOTIFY_WITHDRAW: "true"
  })

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/config?keys=TELEGRAM_TOKEN,TELEGRAM_ID,TELEGRAM_ENABLED,TELEGRAM_NOTIFY_ORDER,TELEGRAM_NOTIFY_WITHDRAW")
      const data = await res.json()
      if (res.ok) {
        setFormData({
          TELEGRAM_TOKEN: data.TELEGRAM_TOKEN || "",
          TELEGRAM_ID: data.TELEGRAM_ID || "",
          TELEGRAM_ENABLED: data.TELEGRAM_ENABLED || "false",
          TELEGRAM_NOTIFY_ORDER: data.TELEGRAM_NOTIFY_ORDER || "true",
          TELEGRAM_NOTIFY_WITHDRAW: data.TELEGRAM_NOTIFY_WITHDRAW || "true"
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (dataToSave: any, sectionName: string) => {
    setSavingSection(sectionName)

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave)
      })

      if (res.ok) {
        addMessage({ type: 'success', text: `Cập nhật ${sectionName} thành công!` })
      } else {
        throw new Error("Lỗi khi lưu cấu hình")
      }
    } catch (err: any) {
      addMessage({ type: 'error', text: err.message || "Có lỗi xảy ra, vui lòng thử lại sau" })
    } finally {
      setSavingSection(null)
    }
  }

  const handleSendTest = async () => {
    setIsSendingTest(true)
    try {
      const res = await fetch("/api/admin/config/test-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, testType })
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
      <div className="space-y-6">
        {/* Card 1: Telegram Bot Connection Config */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cấu hình kết nối Telegram Bot</h3>
            </div>
            <button
              onClick={() => handleSave({
                TELEGRAM_TOKEN: formData.TELEGRAM_TOKEN,
                TELEGRAM_ID: formData.TELEGRAM_ID
              }, "kết nối Bot")}
              disabled={!!savingSection}
              title="Lưu cấu hình kết nối"
              className="p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              {savingSection === "kết nối Bot" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-6 space-y-6">
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
              <div className="flex items-center gap-2">
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as any)}
                  className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest focus:outline-none"
                >
                  <option value="withdraw">Test Rút Tiền</option>
                  <option value="order">Test Đơn Hàng</option>
                </select>
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={!!savingSection || isSendingTest || !formData.TELEGRAM_TOKEN || !formData.TELEGRAM_ID}
                  className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
                >
                  {isSendingTest ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bell className="w-3 h-3" />}
                  Gửi Test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Notification Toggles */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-rose-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Các loại thông báo hệ thống</h3>
            </div>
            <button
              onClick={() => handleSave({
                TELEGRAM_ENABLED: formData.TELEGRAM_ENABLED,
                TELEGRAM_NOTIFY_ORDER: formData.TELEGRAM_NOTIFY_ORDER,
                TELEGRAM_NOTIFY_WITHDRAW: formData.TELEGRAM_NOTIFY_WITHDRAW
              }, "loại thông báo")}
              disabled={!!savingSection}
              title="Lưu lựa chọn thông báo"
              className="p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              {savingSection === "loại thông báo" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Global Switch */}
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wide">Kích hoạt thông báo Telegram</h4>
                <p className="text-[10px] text-muted-foreground">Bật/Tắt toàn bộ hệ thống thông báo qua Telegram.</p>
              </div>
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
                  {formData.TELEGRAM_ENABLED === "true" ? "BẬT" : "TẮT"}
                </span>
              </button>
            </div>

            {/* Withdrawal Toggle */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/50">
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wide">Thông báo yêu cầu rút tiền</h4>
                <p className="text-[10px] text-muted-foreground">Nhận tin nhắn khi Seller gửi yêu cầu rút tiền về ngân hàng.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, TELEGRAM_NOTIFY_WITHDRAW: prev.TELEGRAM_NOTIFY_WITHDRAW === "true" ? "false" : "true" }))}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all",
                  formData.TELEGRAM_NOTIFY_WITHDRAW === "true" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                )}
              >
                {formData.TELEGRAM_NOTIFY_WITHDRAW === "true" ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {formData.TELEGRAM_NOTIFY_WITHDRAW === "true" ? "BẬT" : "TẮT"}
                </span>
              </button>
            </div>

            {/* New Order Toggle */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/50">
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wide">Thông báo đơn hàng mới</h4>
                <p className="text-[10px] text-muted-foreground">Nhận tin nhắn khi có khách hàng mua tài khoản thành công.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, TELEGRAM_NOTIFY_ORDER: prev.TELEGRAM_NOTIFY_ORDER === "true" ? "false" : "true" }))}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all",
                  formData.TELEGRAM_NOTIFY_ORDER === "true" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                )}
              >
                {formData.TELEGRAM_NOTIFY_ORDER === "true" ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {formData.TELEGRAM_NOTIFY_ORDER === "true" ? "BẬT" : "TẮT"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
