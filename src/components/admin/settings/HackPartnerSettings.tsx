"use client"

import { useState, useEffect } from "react"
import { Shield, Save, Loader2, Key, Globe, ShoppingBag, Gamepad2, Clock, Zap } from "lucide-react"
import { useUI } from "@/providers/UIProvider"

export default function HackPartnerSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { addMessage } = useUI()

  const [formData, setFormData] = useState({
    HACKVIET_BASE_URL: "",
    HACKVIET_EMAIL: "",
    HACKVIET_PASSWORD: "",
    HACKVIET_SHOP_SLUG: "",
    HACKVIET_GAME_SLUG: "",
    HACKVIET_KEEP_ALIVE_MINUTES: "90",
    LINK4M_API_TOKEN: ""
  })

  useEffect(() => {
    const keys = [
      "HACKVIET_BASE_URL",
      "HACKVIET_EMAIL",
      "HACKVIET_PASSWORD",
      "HACKVIET_SHOP_SLUG",
      "HACKVIET_GAME_SLUG",
      "HACKVIET_KEEP_ALIVE_MINUTES",
      "LINK4M_API_TOKEN"
    ].join(",")

    fetch(`/api/admin/config?keys=${keys}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          HACKVIET_BASE_URL: data.HACKVIET_BASE_URL || "https://hackviet.io",
          HACKVIET_EMAIL: data.HACKVIET_EMAIL || "",
          HACKVIET_PASSWORD: data.HACKVIET_PASSWORD || "",
          HACKVIET_SHOP_SLUG: data.HACKVIET_SHOP_SLUG || "",
          HACKVIET_GAME_SLUG: data.HACKVIET_GAME_SLUG || "",
          HACKVIET_KEEP_ALIVE_MINUTES: data.HACKVIET_KEEP_ALIVE_MINUTES || "90",
          LINK4M_API_TOKEN: data.LINK4M_API_TOKEN || ""
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        addMessage({ type: "success", text: "Đã cập nhật cấu hình đối tác thành công!" })
      } else {
        const errorData = await res.json()
        addMessage({ type: "error", text: errorData.error || "Có lỗi xảy ra" })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass = "w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm font-bold"
  const labelClass = "text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70"

  if (isLoading) return null

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest">Cấu Hình Đối Tác & Dịch Vụ (API)</h3>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Base URL */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-muted-foreground" />
            <label className={labelClass}>Base URL</label>
          </div>
          <input 
            type="url" 
            name="HACKVIET_BASE_URL" 
            value={formData.HACKVIET_BASE_URL} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="https://hackviet.io" 
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-muted-foreground" />
            <label className={labelClass}>Email Tài Khoản</label>
          </div>
          <input 
            type="email" 
            name="HACKVIET_EMAIL" 
            value={formData.HACKVIET_EMAIL} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="admin@example.com" 
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Key className="w-3 h-3 text-muted-foreground" />
            <label className={labelClass}>Mật Khẩu</label>
          </div>
          <input 
            type="password" 
            name="HACKVIET_PASSWORD" 
            value={formData.HACKVIET_PASSWORD} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="********" 
          />
        </div>

        {/* Shop Slug */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-3 h-3 text-muted-foreground" />
            <label className={labelClass}>Shop Slug</label>
          </div>
          <input 
            type="text" 
            name="HACKVIET_SHOP_SLUG" 
            value={formData.HACKVIET_SHOP_SLUG} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="shop-name-slug" 
          />
        </div>

        {/* Game Slug */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-3 h-3 text-muted-foreground" />
            <label className={labelClass}>Game Slug Mặc Định</label>
          </div>
          <input 
            type="text" 
            name="HACKVIET_GAME_SLUG" 
            value={formData.HACKVIET_GAME_SLUG} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="play-together" 
          />
        </div>

        {/* Keep Alive */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <label className={labelClass}>Thời Gian Duy Trì (Phút)</label>
          </div>
          <input 
            type="number" 
            name="HACKVIET_KEEP_ALIVE_MINUTES" 
            value={formData.HACKVIET_KEEP_ALIVE_MINUTES} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="90" 
          />
        </div>

        {/* Link4M Token */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-amber-500" />
            <label className={labelClass}>Link4M API Token</label>
          </div>
          <input 
            type="text" 
            name="LINK4M_API_TOKEN" 
            value={formData.LINK4M_API_TOKEN} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="Nhập API Token của Link4M" 
          />
        </div>
      </div>

      <div className="p-4 bg-amber-500/5 border-t border-border flex items-start gap-3">
        <Shield className="w-4 h-4 text-amber-500 mt-0.5" />
        <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
          Thông tin cấu hình này sẽ được sử dụng để kết nối API mua key tự động. Vui lòng bảo mật thông tin tài khoản đại lý của bạn. Hệ thống sẽ tự động đăng nhập lại nếu phiên làm việc hết hạn.
        </p>
      </div>
    </div>
  )
}
