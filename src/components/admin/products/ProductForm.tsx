"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Upload,
  X,
  PackageCheck
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  type: "PLAY" | "RANDOM"
  categories: Category[]
  backPath: string
  title: string
  subtitle?: string
  submitText?: string
  productId?: string
  initialData?: any
}

export default function ProductForm({
  type,
  categories,
  backPath,
  title,
  subtitle,
  submitText,
  productId,
  initialData
}: ProductFormProps) {
  const router = useRouter()
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const detailImagesInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [error, setError] = useState("")

  // Form State
  const [formData, setFormData] = useState({
    price: initialData?.price?.toString() || "",
    oldPrice: initialData?.oldPrice?.toString() || "",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    description: initialData?.description || [""],
    images: initialData?.images || [] as string[],
    thumbnail: initialData?.thumbnail || "",
  })

  const [playAccount, setPlayAccount] = useState({
    username: initialData?.secrets?.[0]?.username || "",
    password: initialData?.secrets?.[0]?.password || "",
    accountId: initialData?.secrets?.[0]?.accountId || "",
    extraInfo: initialData?.secrets?.[0]?.extraInfo || "",
  })

  const [randomBulk, setRandomBulk] = useState("")

  const [stats, setStats] = useState<Array<{ key: string, value: string }>>(
    initialData?.stats
      ? Object.entries(initialData.stats).map(([key, value]) => ({ key, value: String(value) }))
      : [{ key: "", value: "" }]
  )

  const handleStatChange = (index: number, field: "key" | "value", value: string) => {
    const newStats = [...stats]
    newStats[index][field] = value
    setStats(newStats)
  }

  const addStat = () => setStats([...stats, { key: "", value: "" }])
  const removeStat = (index: number) => {
    const newStats = stats.filter((_, i) => i !== index)
    setStats(newStats.length ? newStats : [{ key: "", value: "" }])
  }

  const handleDescriptionChange = (index: number, value: string) => {
    const newDesc = [...formData.description]
    newDesc[index] = value
    setFormData({ ...formData, description: newDesc })
  }

  const addDescription = () => {
    setFormData({ ...formData, description: [...formData.description, ""] })
  }

  const removeDescription = (index: number) => {
    const newDesc = formData.description.filter((_, i) => i !== index)
    setFormData({ ...formData, description: newDesc.length ? newDesc : [""] })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "thumbnail" | "detail") => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingField(field)
    setError("")

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)
      formDataUpload.append("type", field)

      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formDataUpload,
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Lỗi khi tải ảnh")

      if (field === "thumbnail") {
        setFormData(prev => ({ ...prev, thumbnail: data.url }))
      } else {
        setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi khi upload")
    } finally {
      setUploadingField(null)
      e.target.value = ""
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const statsObj = stats.reduce((acc, { key, value }) => {
        if (key.trim()) acc[key.trim()] = value
        return acc
      }, {} as Record<string, any>)

      const payload = {
        ...formData,
        type,
        stats: statsObj,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        ...(productId
          ? (type === "PLAY" ? { playAccount } : { newSecrets: randomBulk ? parseRandomBulk(randomBulk) : [] })
          : { secrets: type === "PLAY" ? [playAccount] : parseRandomBulk(randomBulk) }
        )
      }

      const res = await fetch(productId ? `/api/admin/products/${productId}` : "/api/admin/products", {
        method: productId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Có lỗi xảy ra khi ${productId ? 'cập nhật' : 'tạo'} sản phẩm`)
      }

      router.push(backPath)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  const parseRandomBulk = (text: string) => {
    return text.split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split("|")
        return {
          username: parts[0] || "",
          password: parts[1] || "",
          accountId: parts[2] || "",
          extraInfo: parts.slice(3).join("|") || "",
        }
      })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href={backPath}
            className="mt-1 p-2 rounded-xl border border-border bg-card hover:bg-secondary transition-colors shrink-0"
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
            disabled={isLoading || !!uploadingField}
            className="hidden md:inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border text-foreground rounded-xl font-bold text-xs md:text-sm hover:bg-secondary active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {submitText || "Lưu Sản Phẩm"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              Thông tin cơ bản
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Danh mục</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Giá bán (VND)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Giá cũ (nếu có)</label>
                <input
                  type="number"
                  value={formData.oldPrice}
                  onChange={e => setFormData({ ...formData, oldPrice: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-bold"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <div className={cn("w-1.5 h-4 rounded-full", type === "PLAY" ? "bg-amber-500" : "bg-primary")} />
              {type === "PLAY" ? "Thông tin tài khoản" : (productId ? "Trạng thái kho" : "Danh sách tài khoản")}
            </h3>

            {type === "PLAY" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ... (existing PLAY fields) ... */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Tài khoản</label>
                    <input
                      required
                      type="text"
                      value={playAccount.username}
                      onChange={e => setPlayAccount({ ...playAccount, username: e.target.value })}
                      placeholder="abc"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Mật khẩu</label>
                    <input
                      required
                      type="text"
                      value={playAccount.password}
                      onChange={e => setPlayAccount({ ...playAccount, password: e.target.value })}
                      placeholder="123"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">ID Tài khoản (nếu có)</label>
                    <input
                      type="text"
                      value={playAccount.accountId}
                      onChange={e => setPlayAccount({ ...playAccount, accountId: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Thông tin thêm (2FA...)</label>
                    <input
                      type="text"
                      value={playAccount.extraInfo}
                      onChange={e => setPlayAccount({ ...playAccount, extraInfo: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Stats Section - Only for PLAY */}
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-accent rounded-full" />
                      Chỉ số tài khoản (Stats)
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {stats.map((stat, idx) => (
                      <div key={idx} className="flex gap-2 items-start animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Tên (Level, Tim...)"
                            value={stat.key}
                            onChange={e => handleStatChange(idx, "key", e.target.value)}
                            className="px-3 py-2 bg-secondary/30 border border-border rounded-lg focus:border-primary/50 outline-none transition-all text-xs font-bold uppercase"
                          />
                          <input
                            type="text"
                            placeholder="Giá Trị (100, 1M...)"
                            value={stat.value}
                            onChange={e => handleStatChange(idx, "value", e.target.value)}
                            className="px-3 py-2 bg-secondary/30 border border-border rounded-lg focus:border-primary/50 outline-none transition-all text-xs font-bold"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStat(idx)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addStat}
                    className="w-full py-2 border border-dashed border-border rounded-xl text-[10px] font-bold uppercase text-muted-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm chỉ số mới
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {productId && (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-600 uppercase">Kho hiện tại</p>
                      <p className="text-[10px] text-muted-foreground">Sản Phẩm Này Đang Có <span className="font-bold text-foreground">{initialData?.secrets?.length || 0}</span> Tài Khoản.</p>
                    </div>
                    <PackageCheck className="w-8 h-8 text-emerald-500/20" />
                  </div>
                )}

                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                  <p className="text-xs font-bold text-blue-500 uppercase mb-2">
                    {productId ? "Nhập Thêm Tài Khoản Mới" : "Hướng Dẫn Nhập Lô Random"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Nhập Mỗi Tài Khoản 1 Dòng Theo Định Dạng:</p>
                  <code className="text-[10px] font-mono bg-blue-500/10 px-1.5 py-0.5 rounded text-blue-600">Username|Password|ID</code>
                </div>
                <textarea
                  required={!productId}
                  rows={productId ? 5 : 8}
                  value={randomBulk}
                  onChange={e => setRandomBulk(e.target.value)}
                  placeholder={productId ? "Nhập Thêm Tài Khoản Mới Vào Đây (Nếu Có)..." : "user1|pass1|id1|..."}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-mono text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Media & Meta */}
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-4 bg-green-500 rounded-full" />
              Hình ảnh & Thumbnail
            </h3>

            <div className="space-y-6">
              {/* Thumbnail Upload */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Ảnh bìa (Thumbnail)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={thumbnailInputRef}
                  onChange={e => handleFileUpload(e, "thumbnail")}
                />
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  className={cn(
                    "relative aspect-video rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 overflow-hidden bg-secondary/30 group",
                    formData.thumbnail && "border-none"
                  )}
                >
                  {formData.thumbnail ? (
                    <>
                      <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 rounded-full bg-background/80 shadow-sm">
                        {uploadingField === "thumbnail" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Tải ảnh bìa</p>
                    </>
                  )}
                </div>
              </div>

              {/* Detail Images - Only for PLAY */}
              {type === "PLAY" && (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Ảnh chi tiết ({formData.images.length})</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={detailImagesInputRef}
                    onChange={e => handleFileUpload(e, "detail")}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
                        <img src={img} alt={`Detail ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      disabled={uploadingField === "detail"}
                      onClick={() => detailImagesInputRef.current?.click()}
                      className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-1 bg-secondary/30"
                    >
                      {uploadingField === "detail" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-[9px] font-bold uppercase text-muted-foreground">Thêm ảnh</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-4 bg-violet-500 rounded-full" />
              Mô tả đặc điểm
            </h3>

            <div className="space-y-2">
              {formData.description.map((desc, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={desc}
                    onChange={e => handleDescriptionChange(i, e.target.value)}
                    placeholder="Ví Dụ: Zing TTT..."
                    className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all text-xs font-bold"
                  />
                  {formData.description.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDescription(i)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDescription}
                className="w-full py-2 border border-dashed border-border rounded-xl text-[10px] font-bold uppercase text-muted-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" />
                Thêm mô tả
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar (Mobile only, at the end of form) */}
      <div className="pt-6 md:hidden">
        <button
          type="submit"
          disabled={isLoading || !!uploadingField}
          className="w-full flex items-center justify-center gap-2 py-4 bg-background border border-border text-foreground rounded-2xl font-bold text-sm hover:bg-secondary active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {submitText || "Lưu Sản Phẩm"}
        </button>
      </div>
    </form>
  )
}
