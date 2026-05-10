"use client"

import { useState, useRef, useEffect } from "react"
import { Image as ImageIcon, Upload, Loader2, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useUI } from "@/providers/UIProvider"

export default function BrandingSettings() {
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [isUploadingFooterLogo, setIsUploadingFooterLogo] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const footerLogoInputRef = useRef<HTMLInputElement>(null)
  const { addMessage } = useUI()

  const [branding, setBranding] = useState({
    siteLogo: "",
    siteFavicon: "",
    siteBanner: "",
    siteFooterLogo: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const [logoHash, setLogoHash] = useState(Date.now())

  const DEFAULT_PLACEHOLDER = "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image"

  useEffect(() => {
    fetch("/api/admin/settings/general")
      .then(res => res.json())
      .then(data => {
        setBranding({
          siteLogo: data.siteLogo || "",
          siteFavicon: data.siteFavicon || "",
          siteBanner: data.siteBanner || "",
          siteFooterLogo: data.siteFooterLogo || ""
        })
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon' | 'banner' | 'footer-logo') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      addMessage({ type: "error", text: "Vui lòng chọn một file hình ảnh hợp lệ" })
      return
    }

    const setUploading = type === 'logo' ? setIsUploadingLogo : 
                         type === 'favicon' ? setIsUploadingFavicon : 
                         type === 'banner' ? setIsUploadingBanner : 
                         setIsUploadingFooterLogo
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const res = await fetch("/api/admin/settings/upload-branding", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        addMessage({ type: "success", text: `Đã cập nhật ${type.toUpperCase()} thành công!` })
        
        // Update specific field in state
        const configKey = type === 'logo' ? 'siteLogo' : 
                          type === 'favicon' ? 'siteFavicon' : 
                          type === 'banner' ? 'siteBanner' : 
                          'siteFooterLogo'
        setBranding(prev => ({ ...prev, [configKey]: data.url }))
        
        // Force image refresh
        setLogoHash(Date.now())
      } else {
        addMessage({ type: "error", text: data.error || "Có lỗi xảy ra khi tải ảnh lên" })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  if (isLoading) {
    return (
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
      <div className="space-y-8">
        {/* Main Logo Setting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-widest text-foreground/70">Logo chính</h3>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-col items-start gap-4">
              <div className="w-48 h-24 bg-secondary border border-border rounded-xl flex items-center justify-center overflow-hidden relative group">
                <div className="absolute inset-0 bg-[url('/images/pattern/grid.svg')] opacity-20"></div>
                <Image 
                  src={branding.siteLogo ? `${branding.siteLogo}?v=${logoHash}` : DEFAULT_PLACEHOLDER}
                  alt="Current Logo"
                  width={200}
                  height={100}
                  unoptimized={true}
                  className="object-contain w-full h-full p-4 relative z-10"
                />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                  ref={logoInputRef}
                  onChange={(e) => handleFileUpload(e, 'logo')}
                />
                <button 
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-white text-muted-foreground border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/50 transition-all disabled:opacity-50 w-fit"
                >
                  {isUploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isUploadingLogo ? "ĐANG TẢI..." : "TẢI LOGO MỚI"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Footer Logo Setting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-widest text-foreground/70">Logo Chân Trang</h3>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-col items-start gap-4">
              <div className="w-48 h-24 bg-secondary border border-border rounded-xl flex items-center justify-center overflow-hidden relative group">
                <div className="absolute inset-0 bg-[url('/images/pattern/grid.svg')] opacity-20"></div>
                <Image 
                  src={branding.siteFooterLogo ? `${branding.siteFooterLogo}?v=${logoHash}` : DEFAULT_PLACEHOLDER}
                  alt="Current Footer Logo"
                  width={200}
                  height={100}
                  unoptimized={true}
                  className="object-contain w-full h-full p-4 relative z-10"
                />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                  ref={footerLogoInputRef}
                  onChange={(e) => handleFileUpload(e, 'footer-logo')}
                />
                <button 
                  onClick={() => footerLogoInputRef.current?.click()}
                  disabled={isUploadingFooterLogo}
                  className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-white text-muted-foreground border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/50 transition-all disabled:opacity-50 w-fit"
                >
                  {isUploadingFooterLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isUploadingFooterLogo ? "ĐANG TẢI..." : "TẢI LOGO CHÂN TRANG"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Favicon Setting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-widest text-foreground/70">Favicon</h3>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-col items-start gap-4">
              <div className="w-16 h-16 bg-secondary border border-border rounded-xl flex items-center justify-center overflow-hidden relative">
                <Image 
                  src={branding.siteFavicon ? `${branding.siteFavicon}?v=${logoHash}` : DEFAULT_PLACEHOLDER}
                  alt="Current Favicon"
                  width={64}
                  height={64}
                  unoptimized={true}
                  className="object-contain w-full h-full p-2"
                />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <input 
                  type="file" 
                  accept="image/x-icon, image/png, image/jpeg" 
                  className="hidden" 
                  ref={faviconInputRef}
                  onChange={(e) => handleFileUpload(e, 'favicon')}
                />
                <button 
                  onClick={() => faviconInputRef.current?.click()}
                  disabled={isUploadingFavicon}
                  className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-white text-muted-foreground border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/50 transition-all disabled:opacity-50 w-fit"
                >
                  {isUploadingFavicon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isUploadingFavicon ? "ĐANG TẢI..." : "TẢI FAVICON MỚI"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-border" />

        {/* Banner Setting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-widest text-foreground/70">Banner chính</h3>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-col gap-4">
              <div className="w-full aspect-[2/1] md:aspect-[3/1] bg-secondary border border-border rounded-xl flex items-center justify-center overflow-hidden relative group">
                <Image 
                  src={branding.siteBanner ? `${branding.siteBanner}?v=${logoHash}` : DEFAULT_PLACEHOLDER}
                  alt="Current Banner"
                  fill
                  unoptimized={true}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <p className="text-white text-xs font-bold uppercase tracking-widest">Xem trước Banner</p>
                </div>
              </div>
              <div>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                  ref={bannerInputRef}
                  onChange={(e) => handleFileUpload(e, 'banner')}
                />
                <button 
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={isUploadingBanner}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white text-muted-foreground border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/50 transition-all disabled:opacity-50"
                >
                  {isUploadingBanner ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isUploadingBanner ? "ĐANG TẢI..." : "THAY ĐỔI BANNER"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
