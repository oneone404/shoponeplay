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
  Plus,
  Gamepad2,
  Dices
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useUI } from "@/providers/UIProvider"
import ConfirmModal from "@/components/utils/ConfirmModal"
import AdminHeader from "../../admin/AdminHeader"
import { SELLER_ROUTES } from "@/lib/config/seller-routes"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  title: string
  price: number
  oldPrice?: number | null
  thumbnail?: string | null
  sold: boolean
  stock: number
  type: "PLAY" | "RANDOM" | "SERVICE"
  category: {
    name: string
    slug: string
  }
  _count?: {
    secrets: number
  }
}

interface SellerProductsClientProps {
  initialProducts: Product[]
  categories: { id: string; name: string; slug: string }[]
  title?: string
  subtitle?: string
  addPath?: string
  addLabel?: string
  showAddButton?: boolean
  showTypeFilter?: boolean
  showCategoryFilter?: boolean
}

export default function SellerProductsClient({
  initialProducts,
  categories,
  title = "Sản Phẩm",
  subtitle = "Quản lý danh sách sản phẩm và kho tài khoản",
  addPath = SELLER_ROUTES.ADD_PRODUCT.path,
  addLabel = "Thêm Sản Phẩm",
  showAddButton = true,
  showTypeFilter = false,
  showCategoryFilter = true
}: SellerProductsClientProps) {
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState<"ALL" | "PLAY" | "RANDOM">("ALL")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { addMessage } = useUI()
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null)
  const typeDropdownRef = useRef<HTMLDivElement | null>(null)

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return initialProducts.filter((product) => {
      const matchesSearch = !keyword ||
        product.id.toLowerCase().includes(keyword) ||
        product.category.name.toLowerCase().includes(keyword)

      const matchesType = selectedType === "ALL" || product.type === selectedType
      const matchesCategory = selectedCategory === "all" || product.category.slug === selectedCategory

      return matchesSearch && matchesType && matchesCategory
    })
  }, [initialProducts, search, selectedType, selectedCategory])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!categoryDropdownRef.current?.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
      if (!typeDropdownRef.current?.contains(event.target as Node)) {
        setIsTypeOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const handleDelete = async () => {
    if (!deletingProduct) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/seller/products/${deletingProduct.id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Xóa thất bại')
      addMessage({
        type: "success",
        text: "Đã xóa sản phẩm thành công"
      })
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

  const stats = {
    total: initialProducts.length,
    active: initialProducts.filter(p => !p.sold).length,
    stock: initialProducts.reduce((acc, p) => acc + (p._count?.secrets || 0), 0)
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={title}
        subtitle={subtitle}
        rightElement={showAddButton ? (
          <Link
            href={addPath}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border text-foreground rounded-xl font-bold text-xs md:text-sm hover:bg-secondary active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {addLabel}
          </Link>
        ) : null}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SummaryCard label="Tổng sản phẩm" value={stats.total.toLocaleString("vi-VN")} icon={<ShoppingBag className="w-5 h-5" />} color="text-primary" />
        <SummaryCard label="Đang hiển thị" value={stats.active.toLocaleString("vi-VN")} icon={<ShieldCheck className="w-5 h-5" />} color="text-green-500" />
        <SummaryCard label="Tổng kho" value={stats.stock.toLocaleString("vi-VN")} icon={<PackageCheck className="w-5 h-5" />} color="text-amber-500" />
      </div>

      <div className="flex flex-col h-full bg-card border border-border rounded-2xl overflow-visible shadow-sm">
        {/* Filters Bar */}
        <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full max-w-2xl min-w-0">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm Kiếm ID, Danh Mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl w-full outline-none focus:border-primary/50 text-sm font-bold transition-colors"
              />
            </div>

            {/* Type Filter */}
            {showTypeFilter && (
              <div ref={typeDropdownRef} className="relative min-w-[160px]">
                <button
                  type="button"
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-background border border-border rounded-2xl text-[11px] font-bold text-foreground uppercase tracking-widest hover:bg-secondary transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-primary" />
                    {selectedType === "ALL" ? "Tất cả loại" : selectedType === "PLAY" ? "Acc Play" : "Acc Random"}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isTypeOpen && "rotate-180")} />
                </button>

                {isTypeOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {["PLAY", "RANDOM"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedType(type as any)
                          setIsTypeOpen(false)
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors",
                          selectedType === type ? "text-primary bg-primary/5" : "text-muted-foreground"
                        )}
                      >
                        {type === "PLAY" ? "Tài khoản Play" : "Tài khoản Random"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Category Filter */}
            {showCategoryFilter && (
              <div ref={categoryDropdownRef} className="relative w-full sm:w-auto sm:min-w-[190px] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2 bg-background border border-border rounded-xl text-[11px] font-bold text-foreground uppercase tracking-widest hover:bg-secondary transition-all whitespace-nowrap"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{selectedCategory === "all" ? "Tất cả danh mục" : categories.find(c => c.slug === selectedCategory)?.name || "Danh mục"}</span>
                  </span>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", isCategoryOpen && "rotate-180")} />
                </button>

                {isCategoryOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory("all")
                        setIsCategoryOpen(false)
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors",
                        selectedCategory === "all" ? "text-primary bg-primary/5" : "text-muted-foreground"
                      )}
                    >
                      Tất cả danh mục
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.slug)
                          setIsCategoryOpen(false)
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors",
                          selectedCategory === cat.slug ? "text-primary bg-primary/5" : "text-muted-foreground"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap px-2">
            Tổng: {filteredProducts.length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Sản phẩm</th>
                <th className="px-6 py-4 font-bold">Loại</th>
                <th className="px-6 py-4 font-bold">Giá bán</th>
                <th className="px-6 py-4 font-bold">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-center">Kho hàng</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 aspect-video rounded-lg overflow-hidden border border-border bg-secondary shrink-0 group/img">
                          <Image
                            src={product.thumbnail || "/images/product.png"}
                            alt={product.category.name}
                            fill
                            sizes="80px"
                            className="object-cover group-hover/img:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate max-w-[240px]">{product.category.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase">ID: {product.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.type === "PLAY" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-500 uppercase">
                          <Gamepad2 className="w-3 h-3" /> Acc Play
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-500 uppercase">
                          <Dices className="w-3 h-3" /> Acc Random
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-primary">{product.price.toLocaleString("vi-VN")} VND</p>
                      {product.oldPrice && <p className="text-[10px] text-muted-foreground line-through opacity-50">{product.oldPrice.toLocaleString("vi-VN")} VND</p>}
                    </td>
                    <td className="px-6 py-4">
                      {product.sold ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-secondary text-muted-foreground uppercase">
                          <AlertCircle className="w-3 h-3" /> Đã bán
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-green-500/10 text-green-500 uppercase">
                          <ShieldCheck className="w-3 h-3" /> Đang bán
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-foreground">{(product._count?.secrets || 0).toLocaleString("vi-VN")}</div>
                      <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Tài khoản</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={SELLER_ROUTES.EDIT_PRODUCT(product.id).path}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all inline-flex items-center justify-center"
                          title="Sửa sản phẩm"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setDeletingProduct(product)
                            setIsDeleteModalOpen(true)
                          }}
                          className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all inline-flex items-center justify-center"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
                )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground opacity-20" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Không tìm thấy sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa sản phẩm này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn.`}
        confirmText="Xóa sản phẩm"
        type="danger"
      />
    </div>
  )
}

function SummaryCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-bold mt-2 text-foreground tabular-nums tracking-tight">{value}</p>
        </div>
        <div className={cn("w-11 h-11 rounded-xl bg-secondary flex items-center justify-center transition-transform group-hover:scale-110", color)}>
          {icon}
        </div>
      </div>
    </div>
  )
}
