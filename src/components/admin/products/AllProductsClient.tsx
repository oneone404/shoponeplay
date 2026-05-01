"use client"

import { useMemo, useState } from "react"
import { Download, Edit, ExternalLink, PackageCheck, Search, ShoppingBag, ZoomIn } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import ExportAccountsModal from "./ExportAccountsModal"
import QuickViewAccountsModal from "./QuickViewAccountsModal"
import ImageLightbox from "./ImageLightbox"

interface Product {
  id: string
  title: string
  price: number
  type: string
  thumbnail?: string | null
  sold: boolean
  stock: number
  category: {
    name: string
  }
  _count?: {
    secrets: number
  }
}

export default function AllProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState("")
  const [exportingProduct, setExportingProduct] = useState<Product | null>(null)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return initialProducts

    return initialProducts.filter((product) =>
      product.title.toLowerCase().includes(keyword) ||
      product.id.toLowerCase().includes(keyword) ||
      product.type.toLowerCase().includes(keyword) ||
      product.category.name.toLowerCase().includes(keyword)
    )
  }, [initialProducts, search])

  const totalStock = initialProducts.reduce((total, product) => total + (product._count?.secrets || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Tổng sản phẩm" value={initialProducts.length.toLocaleString("vi-VN")} icon={<ShoppingBag className="w-5 h-5" />} color="text-primary" />
        <SummaryCard label="Tài khoản tồn kho" value={totalStock.toLocaleString("vi-VN")} icon={<PackageCheck className="w-5 h-5" />} color="text-green-500" />
        <SummaryCard label="Kết quả hiển thị" value={filteredProducts.length.toLocaleString("vi-VN")} icon={<Search className="w-5 h-5" />} color="text-amber-500" />
      </div>

      <div className="flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between gap-3 bg-secondary/30">
          <div className="relative w-full max-w-sm min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm Kiếm Sản Phẩm, Loại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl w-full outline-none focus:border-primary/50 text-sm font-bold"
            />
          </div>
          <div className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap shrink-0">
            Tổng: {filteredProducts.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Sản phẩm</th>
                <th className="px-6 py-4 font-bold">Loại</th>
                <th className="px-6 py-4 font-bold">Danh mục</th>
                <th className="px-6 py-4 font-bold">Giá bán</th>
                <th className="px-6 py-4 font-bold">Tồn kho</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => setPreviewImage({ src: product.thumbnail || "/images/product.png", alt: product.title })}
                        className="relative w-20 aspect-video rounded-lg overflow-hidden border border-border bg-secondary shrink-0 group/img hover:border-primary/50 transition-colors cursor-zoom-in"
                      >
                        <Image src={product.thumbnail || "/images/product.png"} alt={product.title} fill className="object-cover group-hover/img:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-5 h-5 text-white" />
                        </div>
                      </button>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate max-w-[240px]">{product.title}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase">ID: {product.id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border",
                      product.type === "PLAY" ? "bg-primary/10 text-primary border-primary/10" :
                      product.type === "RANDOM" ? "bg-amber-500/10 text-amber-500 border-amber-500/10" :
                      "bg-secondary text-muted-foreground border-border"
                    )}>
                      {product.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-secondary border border-border text-muted-foreground uppercase">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">{product.price.toLocaleString("vi-VN")} VND</td>
                  <td className="px-6 py-4 font-bold">{(product._count?.secrets || 0).toLocaleString("vi-VN")}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center justify-center" title="Sửa"><Edit className="w-4 h-4" /></button>
                      <button
                        className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
                        title="Xem acc nhanh"
                        disabled={(product._count?.secrets || 0) <= 0}
                        onClick={() => setQuickViewProduct(product)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
                        title="Xuất tài khoản"
                        disabled={(product._count?.secrets || 0) <= 0}
                        onClick={() => setExportingProduct(product)}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <EmptyRow colSpan={6} />
              )}
            </tbody>
          </table>
        </div>
      </div>
      {quickViewProduct && (
        <QuickViewAccountsModal
          product={{ id: quickViewProduct.id, title: quickViewProduct.title }}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
      {exportingProduct && (
        <ExportAccountsModal
          product={{
            id: exportingProduct.id,
            title: exportingProduct.title,
            available: exportingProduct._count?.secrets || 0,
          }}
          onClose={() => setExportingProduct(null)}
        />
      )}
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

function SummaryCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-bold mt-2 text-foreground">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl bg-secondary flex items-center justify-center ${color}`}>{icon}</div>
      </div>
    </div>
  )
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-16 text-center text-sm font-bold text-muted-foreground">
        KHÔNG TÌM THẤY SẢN PHẨM NÀO
      </td>
    </tr>
  )
}
