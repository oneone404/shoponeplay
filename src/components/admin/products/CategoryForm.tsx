"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, AlertCircle, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CategoryGroup {
  id: string
  name: string
}

interface CategoryFormProps {
  groups: CategoryGroup[]
  backPath: string
  title: string
  subtitle?: string
  submitText?: string
  categoryId?: string
  initialData?: any
}

export default function CategoryForm({
  groups,
  backPath,
  title,
  subtitle,
  submitText,
  categoryId,
  initialData
}: CategoryFormProps) {
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [isSlugManual, setIsSlugManual] = useState(!!initialData?.slug)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    groupId: initialData?.groupId || groups[0]?.id || "",
    image: initialData?.image || "",
  })

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: isSlugManual ? prev.slug : generateSlug(name)
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)
      formDataUpload.append("type", "category")

      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formDataUpload,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Lỗi khi tải ảnh")

      setFormData(prev => ({ ...prev, image: data.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi khi upload")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch(categoryId ? `/api/admin/categories/${categoryId}` : "/api/admin/categories", {
        method: categoryId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra")

      router.push(backPath)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href={backPath}
            className="mt-1 p-2 rounded-xl border border-border bg-card hover:bg-secondary transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto md:ml-auto">
          <button
            type="submit"
            disabled={isLoading || uploading}
            className="hidden md:inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border text-foreground rounded-xl font-bold text-xs md:text-sm hover:bg-secondary active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {submitText || "Lưu Danh Mục"}
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
        {/* Left: Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              Thông tin danh mục
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Tên danh mục</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Đường dẫn (Slug)</label>
                  <input
                    required
                    type="text"
                    value={formData.slug}
                    onChange={e => {
                      setFormData({ ...formData, slug: e.target.value })
                      setIsSlugManual(true)
                    }}
                    placeholder="tai-khoan-play-together-vip"
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Nhóm danh mục</label>
                  <select
                    required
                    value={formData.groupId}
                    onChange={e => setFormData({ ...formData, groupId: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary/50 outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Media */}
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-4 bg-green-500 rounded-full" />
              Hình ảnh đại diện
            </h3>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={imageInputRef}
                onChange={handleFileUpload}
              />
              <div
                onClick={() => imageInputRef.current?.click()}
                className={cn(
                  "relative aspect-video rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 overflow-hidden bg-secondary/30 group",
                  formData.image && "border-none"
                )}
              >
                {formData.image ? (
                  <>
                    <Image src={formData.image} alt="Category image" fill className="object-cover" unoptimized={formData.image.toLowerCase().endsWith(".gif")} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-background/80 shadow-sm">
                      {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground text-center px-4">Tải ảnh đại diện</p>
                  </>
                )}
              </div>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                  className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-3.5 h-3.5" />
                  Gỡ ảnh
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar (Mobile only, at the end of form) */}
      <div className="pt-6 md:hidden">
        <button
          type="submit"
          disabled={isLoading || uploading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-background border border-border text-foreground rounded-2xl font-bold text-sm hover:bg-secondary active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {submitText || "Lưu Danh Mục"}
        </button>
      </div>
    </form>
  )
}