"use client"

import { useState, useEffect } from "react"
import { X, Loader2, Save } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import Image from "next/image"

interface OptionFormModalProps {
  isOpen: boolean
  onClose: () => void
  serviceId: string
  option: any | null
  onSuccess: (option: any, isNew: boolean) => void
}

export default function OptionFormModal({ isOpen, onClose, serviceId, option, onSuccess }: OptionFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    thumbnail: "",
    description: "",
    status: "ACTIVE",
  })
  
  const { addMessage } = useUI()

  useEffect(() => {
    if (option) {
      setFormData({
        name: option.name || "",
        price: option.price.toString() || "",
        thumbnail: option.thumbnail || "",
        description: option.description || "",
        status: option.status || "ACTIVE",
      })
    } else {
      setFormData({
        name: "",
        price: "",
        thumbnail: "",
        description: "",
        status: "ACTIVE",
      })
    }
  }, [option, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price) {
      addMessage({ type: 'error', text: 'Vui lòng điền Tên gói và Giá tiền' })
      return
    }

    setIsLoading(true)
    try {
      const url = option ? `/api/admin/services/options/${option.id}` : `/api/admin/services/${serviceId}/options`
      const method = option ? 'PUT' : 'POST'
      
      const payload = {
        ...formData,
        price: parseFloat(formData.price)
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra')

      addMessage({ type: 'success', text: option ? 'Đã cập nhật gói' : 'Đã tạo gói mới' })
      onSuccess(data, !option)
    } catch (error: any) {
      addMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl overflow-hidden rounded-2xl border border-border shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-secondary/30">
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            {option ? 'Chỉnh sửa Gói' : 'Thêm Gói Mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="option-form" onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Tên Gói</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none text-sm font-bold transition-all"
                placeholder="VD: Cày Thuê Rank Vàng Lên Kim Cương"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Giá Tiền (VND)</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none text-sm font-bold transition-all text-primary"
                placeholder="100000"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Trạng Thái</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none text-sm font-bold transition-all"
              >
                <option value="ACTIVE">Đang bán</option>
                <option value="MAINTENANCE">Tạm ngưng</option>
                <option value="HIDDEN">Đã ẩn</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Ảnh Gói (Tùy chọn)</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none text-sm font-mono transition-all"
                  placeholder="https://... (URL Ảnh)"
                />
                {formData.thumbnail && (
                  <div className="relative w-12 h-12 rounded-lg border border-border overflow-hidden shrink-0">
                    <Image src={formData.thumbnail} alt="Preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Mô tả ngắn</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none text-sm transition-all min-h-[80px]"
                placeholder="Mô tả về gói dịch vụ này (thời gian hoàn thành, yêu cầu phụ...)"
              />
            </div>
          </div>
        </form>

        <div className="p-4 md:p-6 border-t border-border bg-secondary/30 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest text-muted-foreground hover:bg-secondary transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            form="option-form"
            disabled={isLoading}
            className="px-8 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {option ? 'Cập Nhật' : 'Tạo Gói'}
          </button>
        </div>
      </div>
    </div>
  )
}
