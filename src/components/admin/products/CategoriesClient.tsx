"use client"

import { useMemo, useState } from "react"
import {
  Edit,
  FolderTree,
  Hash,
  ImageIcon,
  Layers,
  Search,
  ShoppingBag,
  Trash2,
  ZoomIn,
  Plus,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ImageLightbox from "./ImageLightbox"

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
  group: {
    name: string
    slug: string
  }
  _count: {
    products: number
  }
}

interface CategoriesClientProps {
  initialCategories: Category[]
  groups: { id: string; name: string; slug: string }[]
}

export default function CategoriesClient({ initialCategories, groups }: CategoriesClientProps) {
  const [search, setSearch] = useState("")
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return initialCategories

    return initialCategories.filter((category) =>
      category.name.toLowerCase().includes(keyword) ||
      category.slug.toLowerCase().includes(keyword) ||
      category.group.name.toLowerCase().includes(keyword) ||
      category.group.slug.toLowerCase().includes(keyword)
    )
  }, [initialCategories, search])

  const totalProducts = initialCategories.reduce(
    (total, category) => total + category._count.products,
    0
  )

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"? Thao tác này không thể hoàn tác.`)) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Lỗi khi xóa danh mục")

      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Có lỗi xảy ra")
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          label="Nhóm danh mục"
          value={groups.length.toLocaleString("vi-VN")}
          icon={<Layers className="w-5 h-5" />}
          color="text-primary"
        />
        <SummaryCard
          label="Danh mục con"
          value={initialCategories.length.toLocaleString("vi-VN")}
          icon={<FolderTree className="w-5 h-5" />}
          color="text-amber-500"
        />
        <SummaryCard
          label="Sản phẩm đã gắn"
          value={totalProducts.toLocaleString("vi-VN")}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="text-green-500"
        />
      </div>

      <div className="flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center justify-between gap-3 bg-secondary/30">
          <div className="relative w-full max-w-sm min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm Kiếm Danh Mục, Slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl w-full outline-none focus:border-primary/50 text-sm font-bold"
            />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              Tổng: {filteredCategories.length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Danh mục</th>
                <th className="px-6 py-4 font-bold">Nhóm mẹ</th>
                <th className="px-6 py-4 font-bold">Slug</th>
                <th className="px-6 py-4 font-bold">Sản phẩm</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCategories.length > 0 ? filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        disabled={!category.image}
                        onClick={() => category.image && setPreviewImage({ src: category.image, alt: category.name })}
                        className={`relative w-20 aspect-video rounded-lg overflow-hidden border border-border bg-secondary flex items-center justify-center shrink-0 ${category.image ? 'group/img hover:border-primary/50 transition-colors cursor-zoom-in' : ''}`}
                      >
                        {category.image ? (
                          <>
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover group-hover/img:scale-110 transition-transform duration-300"
                              unoptimized={category.image.toLowerCase().endsWith(".gif")}
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="w-4 h-4 text-white" />
                            </div>
                          </>
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate max-w-[220px]">
                          {category.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[220px]">
                          ID: {category.id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-primary/10 text-primary border border-primary/10 uppercase">
                      <FolderTree className="w-3 h-3" />
                      {category.group.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary text-[11px] font-mono text-muted-foreground">
                      <Hash className="w-3 h-3" />
                      {category.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-foreground">
                      {category._count.products.toLocaleString("vi-VN")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Sửa danh mục"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Xóa danh mục"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                        <FolderTree className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-bold">Không tìm thấy danh mục nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {previewImage && (
        <ImageLightbox
          src={previewImage.src}
          alt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {label}
          </p>
          <p className="text-2xl font-bold mt-2 text-foreground">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl bg-secondary flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
