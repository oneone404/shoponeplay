"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft, Loader2, Plus, Trash2, Key, Info, ListChecks, Monitor, Video, History, Star, Upload, Image as ImageIcon, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface PriceOption {
  label: string
  price: number
}

interface FeatureOption {
  name: string
  category: string
  isVip?: boolean
}

interface ChangelogEntry {
  version: string
  content: string
  date: string
}

interface DownloadOption {
  label: string
  url: string
}

interface HackToolFormProps {
  initialData?: any
  mode: "create" | "edit"
  title: string
  subtitle?: string
  backPath: string
}

export default function HackToolForm({ initialData, mode, title, subtitle, backPath }: HackToolFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    version: initialData?.version || "1.0.0",
    description: initialData?.description || "",
    thumbnail: initialData?.thumbnail || "",
    downloadUrl: initialData?.downloadUrl || "",
    fileName: initialData?.fileName || "",
    fileSize: initialData?.fileSize || "",
    requirements: initialData?.requirements || "",
    videoUrl: initialData?.videoUrl || "",
    status: initialData?.status || "ACTIVE",
    externalId: initialData?.externalId || "",
  })

  const [downloadLinks, setDownloadLinks] = useState<DownloadOption[]>(
    Array.isArray(initialData?.downloadUrl) 
      ? initialData.downloadUrl 
      : (typeof initialData?.downloadUrl === 'string' && initialData.downloadUrl 
          ? [{ label: "Link Tải", url: initialData.downloadUrl }] 
          : [{ label: "PLAY TOGETHER VNG", url: "" }, { label: "PLAY TOGETHER GLOBAL", url: "" }])
  )

  const [prices, setPrices] = useState<PriceOption[]>(
    Array.isArray(initialData?.prices) ? initialData.prices : [{ label: "1 Ngày", price: 10000 }]
  )

  const [features, setFeatures] = useState<FeatureOption[]>(
    Array.isArray(initialData?.features) ? initialData.features : []
  )

  const [changelog, setChangelog] = useState<ChangelogEntry[]>(
    Array.isArray(initialData?.changelog) ? initialData.changelog : []
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === "name" && mode === "create") {
      const slug = value
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setForm(prev => ({ ...prev, slug }))
    }
  }

  // Manage Prices
  const addPrice = () => setPrices([...prices, { label: "", price: 0 }])
  const removePrice = (index: number) => setPrices(prices.filter((_, i) => i !== index))
  const updatePrice = (index: number, field: keyof PriceOption, value: any) => {
    const newPrices = [...prices]
    newPrices[index] = { ...newPrices[index], [field]: field === 'price' ? parseInt(value) || 0 : value }
    setPrices(newPrices)
  }

  // Manage Features
  const addFeature = () => setFeatures([...features, { name: "", category: "Chung", isVip: false }])
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index))
  const updateFeature = (index: number, field: keyof FeatureOption, value: any) => {
    const newFeatures = [...features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setFeatures(newFeatures)
  }

  // Manage Changelog
  const addChangelog = () => setChangelog([
    { version: form.version, content: "", date: new Date().toLocaleDateString('vi-VN') },
    ...changelog
  ])
  const removeChangelog = (index: number) => setChangelog(changelog.filter((_, i) => i !== index))
  const updateChangelog = (index: number, field: keyof ChangelogEntry, value: string) => {
    const newChangelog = [...changelog]
    newChangelog[index] = { ...newChangelog[index], [field]: value }
    setChangelog(newChangelog)
  }

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const res = await fetch("/api/admin/hacks/upload", {
        method: "POST",
        body: formDataUpload,
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Lỗi khi tải ảnh")

      setForm(prev => ({ ...prev, thumbnail: data.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi khi upload")
    } finally {
      setUploading(false)
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""
    }
  }

  // Manage Download Links
  const addDownloadLink = () => setDownloadLinks([...downloadLinks, { label: "", url: "" }])
  const removeDownloadLink = (index: number) => setDownloadLinks(downloadLinks.filter((_, i) => i !== index))
  const updateDownloadLink = (index: number, field: keyof DownloadOption, value: string) => {
    const newLinks = [...downloadLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setDownloadLinks(newLinks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const url = mode === "create" ? "/api/admin/hacks" : `/api/admin/hacks/${initialData.id}`
      const method = mode === "create" ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...form, 
          prices,
          features,
          changelog,
          downloadUrl: downloadLinks,
          externalId: form.externalId ? parseInt(form.externalId.toString()) : null 
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Có lỗi xảy ra.")
        return
      }

      router.push(backPath)
      router.refresh()
    } catch (e) {
      setError("Có lỗi xảy ra khi lưu.")
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-secondary/50 border-2 border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all font-bold"
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2"
  const sectionClass = "bg-card border-2 border-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6"

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href={backPath}
            className="mt-1 p-2 rounded-xl border-2 border-border bg-card hover:bg-secondary transition-all shrink-0"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto md:ml-auto">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-background border-2 border-border text-foreground rounded-xl font-bold text-xs md:text-sm hover:bg-secondary active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {mode === "create" ? "Lưu Bản Hack" : "Lưu Thay Đổi"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border-2 border-rose-500/20 rounded-2xl text-xs text-rose-500 font-bold uppercase tracking-wider">{error}</div>
      )}

      <div className="space-y-8">
        {/* 1. Thông Tin Cơ Bản */}
        <div className={sectionClass}>
          <div className="flex items-center gap-3 mb-2">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">Thông Tin Cơ Bản</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Tên Bản Hack *</label>
              <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Ví dụ: AccOne Hack" />
            </div>
            <div>
              <label className={labelClass}>Phiên Bản Hiện Tại</label>
              <input name="version" value={form.version} onChange={handleChange} required className={inputClass} placeholder="1.0.0" />
            </div>
            <div>
              <label className={labelClass}>Đường Dẫn (Slug)</label>
              <input name="slug" value={form.slug} onChange={handleChange} required className={inputClass} placeholder="accone-hack" />
            </div>
            <div>
              <label className={labelClass}>ID Game Đối Tác (HackViet)</label>
              <input name="externalId" type="number" value={form.externalId} onChange={handleChange} className={inputClass} placeholder="Ví dụ: 1" />
            </div>
            <div>
              <label className={labelClass}>Trạng Thái</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="ACTIVE">Hoạt Động</option>
                <option value="MAINTENANCE">Bảo Trì</option>
                <option value="HIDDEN">Ẩn Bản Hack</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Mô Tả Ngắn</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={inputClass} placeholder="Mô tả tóm tắt..." />
          </div>
        </div>

        {/* 2. Cấu Hình Giá & Key VIP */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">Cấu Hình Giá & Key VIP</h3>
            </div>
            <button type="button" onClick={addPrice} className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prices.map((p, index) => (
              <div key={index} className="flex items-center gap-4 bg-secondary/30 p-3 rounded-2xl border-2 border-border">
                <input 
                  value={p.label || ""} 
                  onChange={(e) => updatePrice(index, 'label', e.target.value)} 
                  placeholder="1 Ngày" 
                  className={cn(inputClass, "bg-background py-2 text-xs")}
                />
                <input 
                  type="number" 
                  value={p.price ?? 0} 
                  onChange={(e) => updatePrice(index, 'price', e.target.value)} 
                  placeholder="Giá" 
                  className={cn(inputClass, "bg-background py-2 text-xs w-28")}
                />
                <button type="button" onClick={() => removePrice(index)} className="p-1 text-muted-foreground hover:text-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Tệp Tin & Video */}
        <div className={sectionClass}>
          <div className="flex items-center gap-3 mb-2">
            <Monitor className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">Tệp Tin & Video</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Ảnh Đại Diện (URL)</label>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input name="thumbnail" value={form.thumbnail || ""} onChange={handleChange} className={cn(inputClass, "pl-11")} placeholder="https://..." />
                  </div>
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="px-4 bg-primary/10 text-primary rounded-xl border-2 border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-2 font-bold text-xs shrink-0"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Tải Ảnh Lên
                  </button>
                </div>
                {form.thumbnail && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-border group bg-secondary/30">
                    <Image
                      src={form.thumbnail}
                      alt="Preview"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, thumbnail: "" }))}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Danh Sách Link Tải (JSON)</label>
                <button type="button" onClick={addDownloadLink} className="p-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {downloadLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 bg-secondary/30 p-2 rounded-xl border-2 border-border">
                    <input 
                      value={link.label} 
                      onChange={(e) => updateDownloadLink(index, 'label', e.target.value)} 
                      placeholder="Tên bản (VNG...)" 
                      className={cn(inputClass, "bg-background py-1.5 text-[10px] w-40 shrink-0")}
                    />
                    <input 
                      value={link.url} 
                      onChange={(e) => updateDownloadLink(index, 'url', e.target.value)} 
                      placeholder="Link tải (https://...)" 
                      className={cn(inputClass, "bg-background py-1.5 text-[10px] flex-1")}
                    />
                    <button type="button" onClick={() => removeDownloadLink(index)} className="p-1 text-muted-foreground hover:text-rose-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tên File</label>
                <input name="fileName" value={form.fileName || ""} onChange={handleChange} className={inputClass} placeholder="AccOneHack.apk" />
              </div>
              <div>
                <label className={labelClass}>Dung Lượng</label>
                <input name="fileSize" value={form.fileSize || ""} onChange={handleChange} className={inputClass} placeholder="45MB" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Link Video Hướng Dẫn</label>
              <input name="videoUrl" value={form.videoUrl || ""} onChange={handleChange} className={inputClass} placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>

        {/* 4. Tính Năng & Yêu Cầu */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <ListChecks className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">Tính Năng & Yêu Cầu</h3>
            </div>
            <button type="button" onClick={addFeature} className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {features.map((f, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-3 bg-secondary/30 p-3 rounded-2xl border-2 border-border">
                <input 
                  value={f.name || ""} 
                  onChange={(e) => updateFeature(index, 'name', e.target.value)} 
                  placeholder="Tên tính năng" 
                  className={cn(inputClass, "bg-background py-1.5 text-xs flex-1")}
                />
                <input 
                  value={f.category || ""} 
                  onChange={(e) => updateFeature(index, 'category', e.target.value)} 
                  placeholder="Nhóm" 
                  className={cn(inputClass, "bg-background py-1.5 text-xs w-32")}
                />
                <label className="flex items-center gap-2 cursor-pointer bg-background border-2 border-border rounded-xl px-3 py-1.5 select-none shrink-0 hover:border-amber-500 transition-all group">
                  <input 
                    type="checkbox" 
                    checked={!!f.isVip} 
                    onChange={(e) => updateFeature(index, 'isVip', e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest", f.isVip ? "text-amber-500" : "text-muted-foreground")}>VIP</span>
                  <Star className={cn("w-3 h-3 transition-all", f.isVip ? "text-amber-500 fill-amber-500" : "text-muted-foreground opacity-20")} />
                </label>
                <button type="button" onClick={() => removeFeature(index)} className="p-2 text-muted-foreground hover:text-rose-500 transition-all shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <label className={labelClass}>Yêu Cầu Hệ Thống</label>
            <input name="requirements" value={form.requirements || ""} onChange={handleChange} className={inputClass} placeholder="Android 7.0+..." />
          </div>
        </div>

        {/* 5. Nhật Ký Cập Nhật (History) */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">Nhật Ký Cập Nhật (History)</h3>
            </div>
            <button type="button" onClick={addChangelog} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all text-[10px] font-bold uppercase">
              <Plus className="w-3 h-3" />
              Thêm Bản Ghi
            </button>
          </div>

          <div className="space-y-4">
            {changelog.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-[10px] uppercase font-bold tracking-widest border-2 border-dashed border-border rounded-2xl">
                Chưa có nhật ký cập nhật
              </div>
            ) : (
              changelog.map((item, index) => (
                <div key={index} className="bg-secondary/30 p-4 rounded-2xl border-2 border-border space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Ver:</span>
                        <input 
                          value={item.version || ""} 
                          onChange={(e) => updateChangelog(index, 'version', e.target.value)} 
                          className="bg-background border-border border-2 rounded-lg px-2 py-1 text-[10px] font-bold w-20"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Ngày:</span>
                        <input 
                          value={item.date || ""} 
                          onChange={(e) => updateChangelog(index, 'date', e.target.value)} 
                          className="bg-background border-border border-2 rounded-lg px-2 py-1 text-[10px] font-bold w-28"
                        />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeChangelog(index)} className="text-muted-foreground hover:text-rose-500 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea 
                    value={item.content || ""} 
                    onChange={(e) => updateChangelog(index, 'content', e.target.value)} 
                    placeholder="Nội dung cập nhật (Ví dụ: Thêm Mod Skin, Fix lỗi văng game...)" 
                    rows={2}
                    className={cn(inputClass, "bg-background py-2 text-xs font-medium")}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
