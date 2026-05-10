"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import Navbar from "@/components/layouts/Navbar"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, ChevronDown, LayoutGrid, List,
  ArrowUpDown, CheckCircle2, ShieldCheck, Zap,
  Tag, Info, ShoppingCart, X, Minus, Plus, Eye, ZoomIn
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useCart } from "@/providers/CartProvider"
import ConfirmBuyModal from "@/components/modals/ConfirmBuyModal"
import PageHeader from "@/components/shared/PageHeader"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"
import ImageLightbox from "@/components/admin/products/ImageLightbox"

export default function ShopContent({
  initialProducts = [],
  categories = [],
  initialSlug
}: {
  initialProducts: any[],
  categories: any[],
  initialSlug?: string
}) {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div>{t.common.loading}</div>}>
      <ShopInner initialProducts={initialProducts} categories={categories} initialSlug={initialSlug} />
    </Suspense>
  )
}

function ShopInner({
  initialProducts,
  categories,
  initialSlug
}: {
  initialProducts: any[],
  categories: any[],
  initialSlug?: string
}) {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { t } = useLanguage();

  // Logic lựa chọn slug: Nếu có initialSlug (trang cụ thể) thì ưu tiên, không thì lấy từ ?acc= hoặc mặc định là all
  const urlSlug = params?.slug as string
  const querySlug = searchParams.get('acc')
  const currentSlug = urlSlug || initialSlug || querySlug || "all"

  const [activeCategory, setActiveCategory] = useState(currentSlug)
  const [products, setProducts] = useState(initialProducts)
  const [sortBy, setSortBy] = useState("newest") // 'newest' | 'price-asc' | 'price-desc'
  const [isSortOpen, setIsSortOpen] = useState(false)

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)

  // Sync state with URL changes
  useEffect(() => {
    const slug = (params?.slug as string) || initialSlug || searchParams.get('acc') || "all"
    setActiveCategory(slug)
  }, [params, searchParams, initialSlug])

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug)
    const urlParams = new URLSearchParams(searchParams.toString())
    if (slug === "all") {
      urlParams.delete('acc')
    } else {
      urlParams.set('acc', slug)
    }
    router.push(`/shop?${urlParams.toString()}`, { scroll: false })
  }

  const getCategoryCount = (slug: string) => {
    const items = products.filter(p => p.type !== 'SERVICE' && (slug === "all" || p.categorySlug === slug || p.groupSlug === slug));

    // Nếu là danh mục Random (hoặc chứa sản phẩm Random), đếm tổng stock (số lượng acc)
    const hasRandom = items.some(p => p.type === 'RANDOM');
    if (hasRandom && slug !== "all") {
      return items.reduce((acc, p) => acc + (p.stock || 0), 0);
    }

    // Mặc định đếm số lượng sản phẩm (như PLAY)
    return items.length;
  }

  // Master Filter Logic
  const filteredProducts = products
    .filter(p => {
      // 1. Ẩn sản phẩm đã đánh dấu ẩn hoặc đã bán
      if (p.isHidden || p.sold) return false

      // 2. Tạm thời bỏ qua các sản phẩm là Dịch vụ
      if (p.type === 'SERVICE') return false

      // 3. Category Filter
      const matchCategory = activeCategory === "all" || p.categorySlug === activeCategory || p.groupSlug === activeCategory

      // 4. Search Filter
      const matchSearch = (p.categoryName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.id || "").toLowerCase().includes(searchQuery.toLowerCase())

      // 5. Price Filter
      const priceValue = p.price
      const matchMinPrice = minPrice === "" || priceValue >= parseFloat(minPrice)
      const matchMaxPrice = maxPrice === "" || priceValue <= parseFloat(maxPrice)

      // 6. Type Filter
      const matchType = !selectedType || p.type === selectedType

      return matchCategory && matchSearch && matchMinPrice && matchMaxPrice && matchType
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const activeCategoryData = categories.find(c => c.slug === activeCategory) || categories[0]

  const sortOptions = [
    { label: t.shop.sort_newest, value: "newest" },
    { label: t.shop.sort_price_asc, value: "price-asc" },
    { label: t.shop.sort_price_desc, value: "price-desc" },
  ]

  const resetFilters = () => {
    setSearchQuery("")
    setMinPrice("")
    setMaxPrice("")
    setSelectedType(null)
  }

  return (
    <main className="min-h-screen bg-background pb-20" onClick={() => {
      setIsSortOpen(false)
    }}>
      <Navbar />

      {/* Filter Sidebar (Pure CSS Version) */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsFilterOpen(false)}
      />
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-[400px] bg-card border-l border-border z-[101] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tighter">{t.shop.filter_title}</h2>
          <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-secondary rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Search in Sidebar */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.shop.cat_label}</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.shop.id_placeholder}
                className="w-full pl-12 pr-4 py-3.5 bg-secondary border border-border rounded-2xl outline-none focus:border-primary transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.shop.price_range}</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder={t.shop.from}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="p-3 bg-secondary border border-border rounded-xl outline-none focus:border-primary text-xs font-bold"
              />
              <input
                type="number"
                placeholder={t.shop.to}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="p-3 bg-secondary border border-border rounded-xl outline-none focus:border-primary text-xs font-bold"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.shop.cat_label}</label>
            <div className="flex flex-wrap gap-2">
              {categories
                .filter(cat => !cat.name.toLowerCase().includes("dịch vụ"))
                .map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-tighter transition-all",
                      activeCategory === cat.slug
                        ? "bg-primary text-white border-primary"
                        : "bg-background border-border text-foreground hover:border-primary/50 hover:bg-secondary/20"
                    )}
                  >
                    <div className="flex items-center justify-center space-x-1.5">
                      <span>{cat.name}</span>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-md text-[9px] font-bold",
                        activeCategory === cat.slug
                          ? "bg-white/20 text-white"
                          : "bg-secondary text-muted-foreground"
                      )}>
                        {getCategoryCount(cat.slug)}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Account Type */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.shop.type_label}</label>
            <div className="grid grid-cols-1 gap-2">
              {['PLAY', 'RANDOM'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-xs font-bold uppercase tracking-widest text-left flex items-center justify-between transition-all",
                    selectedType === type
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <span>{type === 'PLAY' ? 'PLAY' : 'RANDOM'}</span>
                  {selectedType === type && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-secondary/30 grid grid-cols-2 gap-4">
          <button
            onClick={resetFilters}
            className="py-4 bg-card border border-border text-muted-foreground rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-sm"
          >
            {t.shop.reset}
          </button>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="py-4 bg-primary text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:scale-[1.02] transition-all"
          >
            {t.shop.apply}
          </button>
        </div>
      </div>

      <section className="pt-24 bg-gradient-to-b from-secondary/30 to-background border-b border-border">
        <PageHeader
          subtitle={t.shop.title}
          title={t.shop.categories}
          highlightTitle={activeCategoryData?.name || t.shop.all_products}
          showBackButton={true}
        >
          {/* View & Search Controls */}
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-card border border-border rounded-2xl text-xs font-bold uppercase tracking-tighter text-muted-foreground hover:text-primary transition-all"
              >
                <Filter className="w-4 h-4" />
                <span>{t.shop.filter_btn}</span>
              </button>

              {/* Sorting Dropdown */}
              <div className="relative flex-1 md:flex-none" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={cn(
                    "w-full md:w-[200px] flex items-center justify-between space-x-2 px-6 py-3 bg-card border border-border rounded-2xl text-xs font-bold uppercase tracking-tighter transition-all",
                    isSortOpen ? "border-primary text-primary shadow-sm" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <ArrowUpDown className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap truncate">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                  </div>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isSortOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-full md:w-[240px] bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-2 flex flex-col">
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSortBy(opt.value)
                              setIsSortOpen(false)
                            }}
                            className={cn(
                              "flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-tighter transition-all",
                              sortBy === opt.value
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-secondary text-muted-foreground"
                            )}
                          >
                            <span>{opt.label}</span>
                            {sortBy === opt.value && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={t.shop.search_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3.5 bg-card border border-border rounded-2xl w-full md:w-[320px] outline-none focus:border-primary/50 transition-all font-medium text-sm"
              />
            </div>
          </div>
        </PageHeader>
      </section>

      {/* Categories Bar (Sticky) */}
      {!initialSlug && !params?.slug && (
        <section className="sticky top-16 z-30 bg-card border-y border-border shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center h-[72px]">
            <div className="w-full overflow-x-auto no-scrollbar py-4">
              <div className="inline-flex items-center space-x-4 px-4 md:px-6">
                {categories
                  .filter(cat => !cat.name.toLowerCase().includes("dịch vụ"))
                  .map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={cn(
                        "px-6 py-2 rounded-xl border text-xs font-bold uppercase transition-all whitespace-nowrap",
                        activeCategory === cat.slug
                          ? "bg-primary text-white border-primary"
                          : "bg-background border-border text-foreground hover:border-primary/50 hover:bg-secondary/20"
                      )}
                    >
                      <div className="flex items-center justify-center space-x-1.5">
                        <span>{cat.name}</span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-md text-[9px] font-bold",
                          activeCategory === cat.slug
                            ? "bg-white/20 text-white"
                            : "bg-secondary text-muted-foreground"
                        )}>
                          {getCategoryCount(cat.slug)}
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-10 px-4 max-w-7xl mx-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPreview={(src, alt) => setPreviewImage({ src, alt })}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
              <Info className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">{t.common.no_products}</h3>
            <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest opacity-70">{t.common.not_found_desc}</p>
          </div>
        )}
      </section>

      {previewImage && (
        <ImageLightbox
          src={previewImage.src}
          alt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </main>
  )
}

function ProductCard({ product, onPreview }: { product: any; onPreview: (src: string, alt: string) => void }) {
  const [qty, setQty] = useState<string | number>(1)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const { addToCart } = useCart()
  const { t } = useLanguage();

  const formatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const handleMinus = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const currentQty = typeof qty === 'number' ? qty : 1
    if (currentQty > 1) setQty(currentQty - 1)
  }

  const handlePlus = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const currentQty = typeof qty === 'number' ? qty : 1
    const maxStock = product.stock || 999
    if (currentQty < maxStock) setQty(currentQty + 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === "") {
      setQty("")
      return
    }

    let num = parseInt(val)
    if (isNaN(num)) return

    const maxStock = product.stock || 999
    if (num > maxStock) num = maxStock
    setQty(num)
  }

  const handleBlur = () => {
    if (qty === "" || (typeof qty === "number" && qty < 1)) {
      setQty(1)
    }
  }

  return (
    <div className="group flex flex-col bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-primary transition-all duration-300">
      {/* Thumbnail Area */}
      <div className="aspect-[16/9] relative overflow-hidden bg-secondary shrink-0">
        <Image
          src={product.thumbnail || product.images?.[0] || "/images/product.png"}
          alt={product.categoryName}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          className="object-cover"
          unoptimized={(product.thumbnail || product.images?.[0] || "").toLowerCase().endsWith(".gif")}
        />

        {/* Account ID Badge (MS) */}
        <div className="absolute top-0 left-0 z-20 px-3 py-1.5 bg-rose-500 text-white text-[11px] font-bold rounded-br-2xl shadow-lg border-r border-b border-white/20 uppercase tracking-wider">
          MS: {product.id.slice(-6)}
        </div>

        {/* Discount Badge - Moved down if MS badge exists */}
        {product.oldPrice && product.oldPrice > product.price && (
          <div className={cn(
            "absolute z-10 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg shadow-lg",
            "top-10 left-2" // Positioned below MS badge
          )}>
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </div>
        )}

        {/* Quick Add to Cart Button */}
        {!product.sold && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, Number(qty));
            }}
            className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 active:scale-95 border border-white/20"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}

        {/* Overlay Action - Click anywhere to zoom */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPreview(product.thumbnail || product.images?.[0] || "/images/product.png", product.categoryName);
          }}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 cursor-zoom-in"
        >
          <Eye className="w-10 h-10 text-white/90 drop-shadow-xl" />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">

        {/* Short Descriptions Section */}
        <div className="flex-1 space-y-1.5 mb-4">
          {product.description && product.description.length > 0 ? (
            product.description.map((desc: string, i: number) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <span className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-tight line-clamp-1">{desc}</span>
              </div>
            ))
          ) : (
            <p className="text-[11px] text-muted-foreground/60 italic uppercase font-medium">{t.common.updating_desc}</p>
          )}
        </div>

        {/* Price & Action Area */}
        <div className="pt-4 border-t border-border mt-auto">
          {/* Stock Progress Bar at Bottom */}
          {product.type === "RANDOM" && !product.sold && (
            <div className="w-full space-y-1 mb-3">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                <span className="text-muted-foreground/60">{t.common.stock}</span>
                <span className="text-accent">{product.stock || 0} {t.common.account}</span>
              </div>
              <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/10 shadow-inner relative">
                <div
                  style={{ width: `${Math.min(((product.stock || 0) / 100) * 100, 100)}%` }}
                  className="h-full bg-accent rounded-full transition-all duration-1000 origin-left"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="text-accent font-bold text-lg tracking-tighter">
                {formatCurrency(product.price)} <span className="text-[10px] opacity-70">VNĐ</span>
              </div>
              {product.oldPrice && (
                <span className="text-[11px] text-muted-foreground line-through font-bold opacity-60">
                  {formatCurrency(product.oldPrice)} <span className="text-[9px]">VND</span>
                </span>
              )}
            </div>

            {/* Quantity Selector for RANDOM on Card */}
            {product.type === "RANDOM" && !product.sold && (
              <div className="flex items-center bg-secondary/50 rounded-lg border border-border/40 p-0.5">
                <button
                  onClick={handleMinus}
                  disabled={Number(qty) <= 1}
                  className="p-1 hover:bg-background rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="w-10 bg-transparent text-center text-[10px] font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:text-primary transition-colors"
                />
                <button
                  onClick={handlePlus}
                  disabled={Number(qty) >= (product.stock || 999)}
                  className="p-1 hover:bg-background rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 items-stretch mt-4">
            {product.type === "RANDOM" ? (
              <button
                onClick={() => setShowBuyModal(true)}
                className="flex-1 py-2.5 bg-background text-primary border border-primary/60 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-1.5 hover:bg-primary hover:text-white transition-all shadow-none group/buy"
              >
                <Zap className="w-3 h-3 fill-current" />
                {t.common.buy_now}
              </button>
            ) : (
              <Link
                href={ROUTES.PRODUCT_DETAIL(product.id)}
                className="flex-1 py-2.5 bg-background text-foreground border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-1.5 hover:bg-secondary active:scale-95 transition-all shadow-sm group/btn"
              >
                <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                {t.common.view_detail}
              </Link>
            )}
            <button
              onClick={() => addToCart(product, Number(qty))}
              className="w-11 bg-background text-primary border border-primary/60 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-none shrink-0"
              title="Thêm vào giỏ"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmBuyModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        product={product}
        quantity={Number(qty)}
      />
    </div>
  )
}
