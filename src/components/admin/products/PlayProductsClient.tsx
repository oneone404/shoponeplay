"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  ChevronDown,
  Download,
  Edit,
  ExternalLink,
  Filter,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  ZoomIn,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ExportAccountsModal from "./ExportAccountsModal"
import QuickViewAccountsModal from "./QuickViewAccountsModal"
import ImageLightbox from "./ImageLightbox"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { useUI } from "@/providers/UIProvider"
import ConfirmModal from "@/components/utils/ConfirmModal"

interface Product {
  id: string
  title: string
  price: number
  oldPrice?: number | null
  thumbnail?: string | null
  sold: boolean
  stock: number
  category: {
    name: string
    slug: string
  }
  _count?: {
    secrets: number
  }
  uploader: {
    name: string | null
    email: string | null
    id: string
  }
}

interface PlayProductsClientProps {
  initialProducts: Product[]
  categories: { id: string; name: string; slug: string }[]
}

export default function PlayProductsClient({ initialProducts, categories }: PlayProductsClientProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [exportingProduct, setExportingProduct] = useState<Product | null>(null)
  const [isBulkExportOpen, setIsBulkExportOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { addMessage } = useUI()

  const handleDelete = async () => {
    if (!deletingProduct) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${deletingProduct.id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Xóa thất bại')
      addMessage({
        type: "success",
        text: "Đã xóa sản phẩm và giải phóng bộ nhớ ảnh"
      })
      // Refresh logic or filter out
      window.location.reload()
    } catch (err) {
      addMessage({
        type: "error",
        text: "Có lỗi xảy ra khi xóa"
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setDeletingProduct(null)
    }
  }
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null)
  const selectedCategoryLabel = selectedCategory === "all"
    ? "TẤT CẢ DANH MỤC"
    : formatCategoryLabel(categories.find((category) => category.slug === selectedCategory)?.name || selectedCategory)

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return initialProducts.filter((product) => {
      const matchesSearch = !keyword ||
        product.category.name.toLowerCase().includes(keyword) ||
        product.id.toLowerCase().includes(keyword) ||
        product.category.name.toLowerCase().includes(keyword)
      const matchesCategory = selectedCategory === "all" || product.category.slug === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [initialProducts, search, selectedCategory])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!categoryDropdownRef.current?.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const totalStock = initialProducts.reduce((total, product) => total + (product._count?.secrets || 0), 0)
  const activeProducts = initialProducts.filter((product) => !product.sold).length
  const selectableProducts = filteredProducts.filter((product) => (product._count?.secrets || 0) > 0)
  const selectedProducts = initialProducts.filter((product) => selectedProductIds.includes(product.id))
  const selectedStock = selectedProducts.reduce((total, product) => total + (product._count?.secrets || 0), 0)
  const isAllVisibleSelected = selectableProducts.length > 0 && selectableProducts.every((product) => selectedProductIds.includes(product.id))

  const toggleSelectAllVisible = () => {
    setSelectedProductIds((current) => {
      if (isAllVisibleSelected) {
        return current.filter((id) => !selectableProducts.some((product) => product.id === id))
      }

      return Array.from(new Set([...current, ...selectableProducts.map((product) => product.id)]))
    })
  }

  const toggleProductSelection = (product: Product) => {
    if ((product._count?.secrets || 0) <= 0) return

    setSelectedProductIds((current) => (
      current.includes(product.id)
        ? current.filter((id) => id !== product.id)
        : [...current, product.id]
    ))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Tài khoản Play" value={initialProducts.length.toLocaleString("vi-VN")} icon={<ShoppingBag className="w-5 h-5" />} color="text-primary" />
        <SummaryCard label="Đang bán" value={activeProducts.toLocaleString("vi-VN")} icon={<ShieldCheck className="w-5 h-5" />} color="text-green-500" />
        <SummaryCard label="Tổng kho" value={totalStock.toLocaleString("vi-VN")} icon={<PackageCheck className="w-5 h-5" />} color="text-amber-500" />
      </div>

      <div className="flex flex-col h-full bg-card border border-border rounded-2xl overflow-visible shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between gap-3 bg-secondary/30">
          <div className="flex flex-wrap gap-3 w-full max-w-2xl min-w-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm Kiếm Tài Khoản Play..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl w-full outline-none focus:border-primary/50 text-sm font-bold"
              />
            </div>
            <div ref={categoryDropdownRef} className="relative w-full sm:w-[190px] shrink-0">
              <button
                type="button"
                onClick={() => setIsCategoryOpen((value) => !value)}
                className="inline-flex w-full items-center justify-between gap-2 px-3 py-2 bg-background border border-border rounded-xl text-[11px] font-bold text-foreground uppercase tracking-wide outline-none hover:bg-secondary focus:border-primary/50 transition-colors"
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{selectedCategoryLabel}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all")
                      setIsCategoryOpen(false)
                    }}
                    className="flex w-full items-center px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-foreground hover:bg-secondary transition-colors"
                  >
                    TẤT CẢ DANH MỤC
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.slug)
                        setIsCategoryOpen(false)
                      }}
                      className="flex w-full items-center px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      {formatCategoryLabel(category.name)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedProductIds.length > 0 && (
              <button
                type="button"
                onClick={() => setIsBulkExportOpen(true)}
                className="inline-flex w-full sm:hidden items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-foreground hover:bg-secondary transition-colors"
              >
                <Download className="h-4 w-4 text-amber-500" />
                Xuất đã chọn ({selectedProductIds.length})
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 sm:ml-auto">
            {selectedProductIds.length > 0 && (
              <button
                type="button"
                onClick={() => setIsBulkExportOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-foreground hover:bg-secondary transition-colors"
              >
                <Download className="h-4 w-4 text-amber-500" />
                Xuất đã chọn ({selectedProductIds.length})
              </button>
            )}
            <div className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              Tổng: {filteredProducts.length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold w-10">
                  <input
                    type="checkbox"
                    checked={isAllVisibleSelected}
                    onChange={toggleSelectAllVisible}
                    className="h-4 w-4 rounded border-border accent-primary"
                    aria-label="Chọn tất cả sản phẩm đang hiển thị"
                  />
                </th>
                <th className="px-6 py-4 font-bold">Sản phẩm</th>
                <th className="px-6 py-4 font-bold">Danh mục</th>
                <th className="px-6 py-4 font-bold">Giá bán</th>
                <th className="px-6 py-4 font-bold">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-center">Kho hàng</th>
                <th className="px-6 py-4 font-bold text-right">Seller</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(product.id)}
                      disabled={(product._count?.secrets || 0) <= 0}
                      onChange={() => toggleProductSelection(product)}
                      className="h-4 w-4 rounded border-border accent-primary disabled:opacity-40"
                      aria-label={`Chọn ${product.category.name}`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <ProductIdentity 
                      product={product} 
                      onImageClick={() => setPreviewImage({ src: product.thumbnail || "/images/product.png", alt: product.category.name })} 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-secondary border border-border text-muted-foreground uppercase">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-primary">{product.price.toLocaleString("vi-VN")} VND</p>
                    {product.oldPrice && <p className="text-[10px] text-muted-foreground line-through">{product.oldPrice.toLocaleString("vi-VN")} VND</p>}
                  </td>
                  <td className="px-6 py-4">
                    {product.sold ? (
                      <StatusBadge icon={<AlertCircle className="w-3 h-3" />} label="Đã bán" className="text-muted-foreground bg-secondary" />
                    ) : (
                      <StatusBadge icon={<ShieldCheck className="w-3 h-3" />} label="Đang bán" className="text-green-500 bg-green-500/10" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-center">
                    {(product._count?.secrets || 0).toLocaleString("vi-VN")}
                    <span className="block text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Tài khoản</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-foreground text-xs">{product.uploader.name || "N/A"}</span>
                      <span className="text-[10px] text-muted-foreground/60 font-medium lowercase truncate max-w-[120px]">
                        {product.uploader.email || product.uploader.id.slice(-8)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <RowActions 
                      product={product} 
                      onExport={setExportingProduct} 
                      onQuickView={setQuickViewProduct}
                      onDelete={(p) => {
                        setDeletingProduct(p)
                        setIsDeleteModalOpen(true)
                      }}
                    />
                  </td>
                </tr>
              )) : <EmptyRow colSpan={7} />}
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
      {quickViewProduct && (
        <QuickViewAccountsModal
          product={{ id: quickViewProduct.id, title: quickViewProduct.category.name }}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
      {isBulkExportOpen && selectedProducts.length > 0 && (
        <ExportAccountsModal
          product={{
            id: "bulk-play-export",
            ids: selectedProducts.map((product) => product.id),
            title: `XUẤT ${selectedProducts.length} SẢN PHẨM PLAY ĐÃ CHỌN`,
            available: selectedStock,
          }}
          onClose={() => setIsBulkExportOpen(false)}
        />
      )}
      {exportingProduct && (
        <ExportAccountsModal
          product={{
            id: exportingProduct.id,
            title: exportingProduct.category.name,
            available: exportingProduct._count?.secrets || 0,
          }}
          onClose={() => setExportingProduct(null)}
        />
      )}

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Xác Nhận Xóa"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${deletingProduct?.category.name}"? Hành động này sẽ xóa vĩnh viễn dữ liệu tài khoản và các ảnh liên quan trên server.`}
        confirmText="XÓA VĨNH VIỄN"
        type="danger"
      />
    </div>
  )
}

function ProductIdentity({ product, onImageClick }: { product: Product; onImageClick?: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button 
        type="button"
        onClick={onImageClick}
        className="relative w-20 aspect-video rounded-lg overflow-hidden border border-border bg-secondary shrink-0 group/img hover:border-primary/50 transition-colors cursor-zoom-in"
      >
        <Image 
          src={product.thumbnail || "/images/product.png"} 
          alt={product.category.name} 
          fill 
          sizes="80px"
          className="object-cover group-hover/img:scale-110 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>
      </button>
      <div className="min-w-0">
        <p className="font-bold text-foreground truncate max-w-[240px]">{product.category.name}</p>
        <p className="text-[10px] text-muted-foreground font-medium uppercase">ID: {product.id.slice(-8)}</p>
      </div>
    </div>
  )
}

function RowActions({ product, onExport, onQuickView, onDelete }: { product: Product; onExport: (product: Product) => void; onQuickView: (product: Product) => void; onDelete: (product: Product) => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link 
        href={ADMIN_ROUTES.PRODUCTS_PLAY_EDIT(product.id).path} 
        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center justify-center" 
        title="Sửa"
      >
        <Edit className="w-4 h-4" />
      </Link>
      <button 
        onClick={() => onDelete(product)}
        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors inline-flex items-center justify-center" 
        title="Xóa"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <button
        className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
        title="Xem acc nhanh"
        disabled={(product._count?.secrets || 0) <= 0}
        onClick={() => onQuickView(product)}
      >
        <ExternalLink className="w-4 h-4" />
      </button>
      <button
        className="p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
        title="Xuất tài khoản"
        disabled={(product._count?.secrets || 0) <= 0}
        onClick={() => onExport(product)}
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  )
}

function StatusBadge({ icon, label, className }: { icon: React.ReactNode; label: string; className: string }) {
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${className}`}>{icon}{label}</span>
}

function SummaryCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between gap-4">
        <div><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p><p className="text-2xl font-bold mt-2 text-foreground">{value}</p></div>
        <div className={`w-11 h-11 rounded-xl bg-secondary flex items-center justify-center ${color}`}>{icon}</div>
      </div>
    </div>
  )
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return <tr><td colSpan={colSpan} className="px-6 py-16 text-center text-sm font-bold text-muted-foreground">KHÔNG TÌM THẤY SẢN PHẨM NÀO</td></tr>
}

function formatCategoryLabel(value: string) {
  return value.toLocaleUpperCase("vi-VN")
}
