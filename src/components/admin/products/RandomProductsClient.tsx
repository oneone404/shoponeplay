"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Edit,
  ExternalLink,
  Plus,
  Search,
  Trash2,
  Dices,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EyeOff,
  Filter,
  ChevronDown
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useUI } from "@/providers/UIProvider"
import ConfirmModal from "@/components/utils/ConfirmModal"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { cn } from "@/lib/utils"
import QuickViewAccountsModal from "./QuickViewAccountsModal"

interface Product {
  id: string
  title: string
  price: number
  oldPrice?: number | null
  thumbnail?: string | null
  sold: boolean
  isHidden: boolean
  stock: number
  type: "PLAY" | "RANDOM" | "SERVICE"
  category: {
    name: string
    slug: string
  }
  uploader: {
    name: string | null
    role: string
  }
}

interface RandomProductsClientProps {
  initialProducts: Product[]
  categories: { id: string; name: string; slug: string }[]
}

export default function RandomProductsClient({
  initialProducts,
  categories
}: RandomProductsClientProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [isToggling, setIsToggling] = useState<string | null>(null)

  const { addMessage } = useUI()
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null)

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return initialProducts.filter((product) => {
      const matchesSearch = !keyword || 
        product.id.toLowerCase().includes(keyword) || 
        product.category.name.toLowerCase().includes(keyword)

      const matchesCategory = selectedCategory === "all" || product.category.slug === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [initialProducts, search, selectedCategory])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedCategory])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!categoryDropdownRef.current?.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const handleDelete = async () => {
    if (!deletingProduct) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${deletingProduct.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Xóa thất bại')
      addMessage({ type: "success", text: "Đã xóa sản phẩm thành công" })
      window.location.reload()
    } catch (err) {
      addMessage({ type: "error", text: "Có lỗi xảy ra khi xóa" })
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setDeletingProduct(null)
    }
  }

  const toggleProductVisibility = async (id: string, currentHidden: boolean) => {
    if (isToggling) return
    setIsToggling(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHidden: !currentHidden })
      })
      if (!res.ok) throw new Error('Cập nhật thất bại')
      addMessage({
        type: "success",
        text: currentHidden ? "Đã mở hiển thị sản phẩm" : "Đã ẩn sản phẩm khỏi shop"
      })
      window.location.reload()
    } catch (err) {
      addMessage({ type: "error", text: "Có lỗi xảy ra" })
    } finally {
      setIsToggling(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl overflow-visible shadow-sm">
        <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
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

            {/* Category Filter - Styled like SellerProductsClient */}
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
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-full md:w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
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
                </div>
              )}
            </div>
          </div>
          <div className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap px-2">
            Tổng: {filteredProducts.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Sản phẩm</th>
                <th className="px-6 py-4 font-bold">Giá bán</th>
                <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-center">Tồn kho</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentProducts.length > 0 ? currentProducts.map((product) => (
                <tr key={product.id} className={cn("hover:bg-secondary/20 transition-colors group", product.isHidden && "opacity-60 bg-secondary/10")}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 aspect-video rounded-lg overflow-hidden border border-border bg-secondary shrink-0 group/img">
                        <Image src={product.thumbnail || "/images/product.png"} alt="" fill className="object-cover group-hover/img:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate max-w-[300px]">{product.category.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase">ID: {product.id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">{product.price.toLocaleString("vi-VN")} VND</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={isToggling === product.id}
                          onClick={() => toggleProductVisibility(product.id, product.isHidden)}
                          className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none", !product.isHidden ? "bg-green-500" : "bg-zinc-600")}
                        >
                          <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200", !product.isHidden ? "translate-x-6" : "translate-x-1")} />
                          <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
                              {!product.isHidden ? <Eye className="w-3 h-3 text-white ml-0.5" /> : <EyeOff className="w-3 h-3 text-white ml-auto mr-0.5" />}
                          </div>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-bold text-foreground">{(product.stock || 0).toLocaleString("vi-VN")}</div>
                    <div className="text-[9px] text-muted-foreground uppercase font-bold">Nick còn lại</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all" onClick={() => setQuickViewProduct(product)}><ExternalLink className="w-4 h-4" /></button>
                      <Link href={ADMIN_ROUTES.PRODUCTS_RANDOM_EDIT(product.id).path} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><Edit className="w-4 h-4" /></Link>
                      <button className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all" onClick={() => { setDeletingProduct(product); setIsDeleteModalOpen(true); }}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <Search className="w-8 h-8 text-muted-foreground opacity-20" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Không tìm thấy sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/30">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trang {currentPage} / {totalPages}</div>
            <div className="flex items-center space-x-2">
              <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all"><ChevronsLeft className="w-4 h-4" /></button>
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-4 text-xs font-black text-primary">{currentPage}</div>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all"><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="p-2 bg-card border border-border rounded-lg disabled:opacity-20 hover:text-primary transition-all"><ChevronsRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickViewAccountsModal product={{ id: quickViewProduct.id, title: quickViewProduct.category.name }} onClose={() => setQuickViewProduct(null)} />
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Xác nhận xóa"
        message="Dữ liệu liên quan sẽ bị xóa vĩnh viễn."
        confirmText="Xóa sản phẩm"
        type="danger"
      />
    </div>
  )
}
