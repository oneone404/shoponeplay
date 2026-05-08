"use client"

import { useState, useEffect } from "react"
import { X, Loader2, Save, Upload, Plus, Trash2, GripVertical } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ServiceField {
  id: string
  name: string
  label: string
  type: "text" | "password" | "number" | "select" | "textarea"
  required: boolean
  options?: string // For select type, comma separated
  placeholder?: string
}

interface ServiceFormModalProps {
  isOpen: boolean
  onClose: () => void
  service: any | null
  onSuccess: (service: any, isNew: boolean) => void
}

export default function ServiceFormModal({ isOpen, onClose, service, onSuccess }: ServiceFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    thumbnail: "",
    description: "",
    type: "LEVELING",
    status: "ACTIVE",
  })
  
  const [fields, setFields] = useState<ServiceField[]>([])
  const { addMessage } = useUI()

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        slug: service.slug || "",
        thumbnail: service.thumbnail || "",
        description: service.description || "",
        type: service.type || "LEVELING",
        status: service.status || "ACTIVE",
      })
      setFields(service.fields || [])
    } else {
      setFormData({
        name: "",
        slug: "",
        thumbnail: "",
        description: "",
        type: "LEVELING",
        status: "ACTIVE",
      })
      setFields([
        { id: "1", name: "username", label: "Tài khoản (ID/Username)", type: "text", required: true, placeholder: "Nhập tài khoản đăng nhập..." },
        { id: "2", name: "password", label: "Mật khẩu", type: "password", required: true, placeholder: "Nhập mật khẩu..." },
      ])
    }
  }, [service, isOpen])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!service) {
      setFormData({ ...formData, name: val, slug: generateSlug(val) })
    } else {
      setFormData({ ...formData, name: val })
    }
  }

  const handleAddField = () => {
    const newField: ServiceField = {
      id: Date.now().toString(),
      name: `field_${fields.length + 1}`,
      label: "Trường dữ liệu mới",
      type: "text",
      required: false,
      placeholder: ""
    }
    setFields([...fields, newField])
  }

  const handleUpdateField = (id: string, key: keyof ServiceField, value: any) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f))
  }

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug) {
      addMessage({ type: 'error', text: 'Vui lòng điền Tên và Slug dịch vụ' })
      return
    }

    setIsLoading(true)
    try {
      const url = service ? `/api/admin/services/${service.id}` : '/api/admin/services'
      const method = service ? 'PUT' : 'POST'
      
      const payload = {
        ...formData,
        fields
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra')

      // Ensure we have count structure for the table
      const formattedData = {
        ...data,
        _count: service?._count || { options: 0, orders: 0 }
      }

      addMessage({ type: 'success', text: service ? 'Đã cập nhật dịch vụ' : 'Đã tạo dịch vụ mới' })
      onSuccess(formattedData, !service)
    } catch (error: any) {
      addMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-border shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-secondary/30">
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            {service ? 'Chỉnh sửa Dịch vụ' : 'Thêm Dịch vụ Mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="service-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <span className="w-6 h-px bg-primary"></span>
              Thông tin chung
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Tên Dịch Vụ</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none text-sm font-bold transition-all"
                  placeholder="VD: Cày Thuê Liên Quân"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Đường Dẫn (Slug)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none text-sm font-mono transition-all"
                  placeholder="cay-thue-lien-quan"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Phân Loại</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none text-sm font-bold transition-all"
                >
                  <option value="LEVELING">Cày thuê (Leveling)</option>
                  <option value="TOPUP">Nạp Game (Topup)</option>
                  <option value="OTHER">Khác (Other)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Trạng Thái</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none text-sm font-bold transition-all"
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                  <option value="HIDDEN">Đã ẩn</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">URL Ảnh Đại Diện (Thumbnail)</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none text-sm font-mono transition-all"
                    placeholder="https://..."
                  />
                  {formData.thumbnail && (
                    <div className="relative w-12 h-12 rounded-lg border border-border overflow-hidden shrink-0">
                      <Image src={formData.thumbnail} alt="Preview" fill className="object-cover" unoptimized />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Mô tả chi tiết</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none text-sm transition-all min-h-[100px]"
                  placeholder="Ghi chú thêm về dịch vụ này..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-500 flex items-center gap-2">
                <span className="w-6 h-px bg-blue-500"></span>
                Trường Thông Tin Yêu Cầu (Form Khách Điền)
              </h3>
              <button 
                type="button" 
                onClick={handleAddField}
                className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Thêm Trường
              </button>
            </div>
            
            <p className="text-[11px] text-muted-foreground">
              Đây là các thông tin khách hàng bắt buộc phải nhập khi đặt mua dịch vụ này (VD: Tài khoản, Mật khẩu, Server...).
            </p>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 bg-secondary/30 border border-border rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center relative group">
                  <div className="hidden md:flex items-center justify-center p-2 text-muted-foreground cursor-move opacity-50 hover:opacity-100">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full flex-1">
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Nhãn hiển thị (Label)</label>
                      <input 
                        type="text" 
                        value={field.label} 
                        onChange={(e) => handleUpdateField(field.id, 'label', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-blue-500/50"
                        placeholder="VD: Server đang chơi"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Tên biến (Key)</label>
                      <input 
                        type="text" 
                        value={field.name} 
                        onChange={(e) => handleUpdateField(field.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs font-mono outline-none focus:border-blue-500/50"
                        placeholder="server_name"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Kiểu nhập</label>
                      <select 
                        value={field.type} 
                        onChange={(e) => handleUpdateField(field.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs font-bold outline-none focus:border-blue-500/50"
                      >
                        <option value="text">Văn bản ngắn</option>
                        <option value="password">Mật khẩu</option>
                        <option value="textarea">Văn bản dài</option>
                        <option value="select">Dropdown</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Placeholder / Tùy chọn</label>
                      <input 
                        type="text" 
                        value={field.type === 'select' ? (field.options || "") : (field.placeholder || "")} 
                        onChange={(e) => {
                          if (field.type === 'select') handleUpdateField(field.id, 'options', e.target.value)
                          else handleUpdateField(field.id, 'placeholder', e.target.value)
                        }}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-blue-500/50"
                        placeholder={field.type === 'select' ? "Lựa chọn 1, Lựa chọn 2" : "Gợi ý nhập..."}
                      />
                    </div>
                    <div className="md:col-span-1 flex flex-row md:flex-col items-center justify-center gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={field.required}
                          onChange={(e) => handleUpdateField(field.id, 'required', e.target.checked)}
                          className="rounded bg-background border-border text-blue-500 focus:ring-0"
                        />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground md:hidden">Bắt buộc</span>
                      </label>
                      <button 
                        type="button"
                        onClick={() => handleRemoveField(field.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors ml-auto md:ml-0 md:mt-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {fields.length === 0 && (
                <div className="text-center py-8 border border-dashed border-border rounded-xl">
                  <p className="text-xs text-muted-foreground italic">Chưa có trường thông tin nào. Khách hàng sẽ không cần điền gì thêm.</p>
                </div>
              )}
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
            form="service-form"
            disabled={isLoading}
            className="px-8 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {service ? 'Cập Nhật' : 'Tạo Dịch Vụ'}
          </button>
        </div>
      </div>
    </div>
  )
}
