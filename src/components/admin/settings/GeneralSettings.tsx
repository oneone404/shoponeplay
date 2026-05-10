"use client"

import { useState, useEffect } from "react"
import { Globe, Save, Loader2, Plus, Trash2, Link, Image, Upload } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { PremiumLoader } from "@/components/utils/PremiumLoader"

export default function GeneralSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { addMessage } = useUI()

  const [formData, setFormData] = useState({
    siteName: "",
    siteTitle: "",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    facebookUrl: "",
    zaloUrl: "",
    bannerTitle: "",
    bannerDesc: "",
    heroTitle: "",
    heroSub: "",
    introLinks: "[]"
  })

  const [links, setLinks] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/admin/settings/general")
      .then(res => res.json())
      .then(data => {
        setFormData({
          siteName: data.siteName || "",
          siteTitle: data.siteTitle || "",
          siteDescription: data.siteDescription || "",
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          facebookUrl: data.facebookUrl || "",
          zaloUrl: data.zaloUrl || "",
          bannerTitle: data.bannerTitle || "",
          bannerDesc: data.bannerDesc || "",
          heroTitle: data.heroTitle || "",
          heroSub: data.heroSub || "",
          introLinks: data.introLinks || "[]"
        })

        try {
          setLinks(JSON.parse(data.introLinks || "[]"))
        } catch (e) {
          setLinks([])
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLinkChange = (index: number, field: string, value: string) => {
    const newLinks = [...links]
    const updatedLink = { ...newLinks[index], [field]: value }
    if (field === 'type' && (value === 'zalo' || value === 'facebook')) {
      updatedLink.icon = ""
    }
    newLinks[index] = updatedLink
    setLinks(newLinks)
  }

  const handleAddLink = () => {
    setLinks([...links, { label: "", url: "", type: "zalo", icon: "" }])
  }

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_: any, i: number) => i !== index))
  }

  const handleUploadIcon = async (index: number, file: File) => {
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)
    formDataUpload.append("type", "link-icon")

    try {
      const res = await fetch("/api/admin/settings/upload-branding", {
        method: "POST",
        body: formDataUpload
      })
      const data = await res.json()
      if (data.url) {
        handleLinkChange(index, 'icon', data.url)
        addMessage({ type: "success", text: "Đã tải icon lên thành công" })
      }
    } catch (err) {
      addMessage({ type: "error", text: "Lỗi khi tải ảnh" })
    }
  }

  const handleSaveSection = async (sectionData: any, sectionName: string) => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionData)
      })

      if (res.ok) {
        addMessage({ type: "success", text: `Đã lưu ${sectionName} thành công!` })
      } else {
        const errorData = await res.json()
        addMessage({ type: "error", text: errorData.error || "Có lỗi xảy ra" })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <PremiumLoader />
  }

  return (
    <div className="space-y-6 w-full">
      
      {/* SECTION 1: WEBSITE & CONTACTS */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Nội Dung Website & Liên Hệ</h3>
          </div>
          <button
            onClick={() => handleSaveSection({
              siteName: formData.siteName,
              siteTitle: formData.siteTitle,
              siteDescription: formData.siteDescription,
              contactEmail: formData.contactEmail,
              contactPhone: formData.contactPhone,
              facebookUrl: formData.facebookUrl,
              zaloUrl: formData.zaloUrl
            }, "thông tin chung")}
            disabled={isSaving}
            title="Lưu thông tin chung"
            className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Tên Website</label>
            <input type="text" name="siteName" value={formData.siteName} onChange={handleChange} className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm font-bold uppercase" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Tiêu đề SEO</label>
            <input type="text" name="siteTitle" value={formData.siteTitle} onChange={handleChange} className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Mô tả SEO</label>
            <textarea name="siteDescription" value={formData.siteDescription} onChange={handleChange} rows={3} className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm no-scrollbar resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Email liên hệ</label>
            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Số điện thoại</label>
            <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Facebook URL</label>
            <input type="url" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Zalo URL</label>
            <input type="url" name="zaloUrl" value={formData.zaloUrl} onChange={handleChange} className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm" />
          </div>
        </div>
      </div>

      {/* SECTION 2: BANNER CONTENT */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Cấu Hình Chữ Trên Banner</h3>
          </div>
          <button
            onClick={() => handleSaveSection({
              bannerTitle: formData.bannerTitle,
              bannerDesc: formData.bannerDesc
            }, "banner")}
            disabled={isSaving}
            title="Lưu banner"
            className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Tiêu đề Banner (HTML)</label>
            <input type="text" name="bannerTitle" value={formData.bannerTitle} onChange={handleChange} className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Mô tả Banner (HTML)</label>
            <textarea name="bannerDesc" value={formData.bannerDesc} onChange={handleChange} rows={4} className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm font-mono no-scrollbar resize-none" />
          </div>
        </div>
      </div>

      {/* SECTION 3: INTRO CONTENT */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Cấu Hình Nội Dung Giới Thiệu</h3>
          </div>
          <button
            onClick={() => handleSaveSection({
              heroTitle: formData.heroTitle,
              heroSub: formData.heroSub
            }, "nội dung giới thiệu")}
            disabled={isSaving}
            title="Lưu nội dung giới thiệu"
            className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Tiêu đề Giới thiệu (HTML)</label>
            <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full p-4 rounded-xl bg-background border border-border focus:border-primary outline-none font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Nội dung Giới thiệu (HTML)</label>
            <input type="text" name="heroSub" value={formData.heroSub} onChange={handleChange} className="w-full p-4 rounded-xl bg-background border border-border focus:border-primary outline-none font-mono text-sm" />
          </div>
        </div>
      </div>

      {/* SECTION 4: CONTACT LINKS */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Danh Sách Nút Liên Hệ</h3>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleAddLink}
              title="Thêm nút liên kết"
              className="px-3 py-1.5 bg-white text-muted-foreground border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/50 transition-all flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm nút
            </button>
            <button
              onClick={() => handleSaveSection({
                introLinks: JSON.stringify(links)
              }, "danh sách liên kết")}
              disabled={isSaving}
              title="Lưu danh sách liên kết"
              className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {links.map((link: any, index) => (
            <div key={index} className="p-4 rounded-2xl border border-border bg-background/50 space-y-4 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden shrink-0">
                    {link.icon ? (
                      <img src={link.icon} alt="Icon" className="w-full h-full object-contain" />
                    ) : link.type === 'zalo' ? (
                      <img src="/images/brand/zalo.svg" alt="Zalo" className="w-7 h-7 object-contain" />
                    ) : link.type === 'facebook' ? (
                      <div className="text-[#1877f2]">
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                      </div>
                    ) : (
                      <div className="text-muted-foreground/30"><Image className="w-5 h-5" /></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Nút #{index + 1}</span>
                    <span className="text-xs font-bold truncate max-w-[150px] uppercase tracking-wider">{link.label || "CHƯA ĐẶT TÊN"}</span>
                  </div>
                </div>
                <button type="button" onClick={() => handleRemoveLink(index)} className="p-2 text-muted-foreground hover:text-red-500 rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Tên nút" value={link.label} onChange={(e) => handleLinkChange(index, 'label', e.target.value)} className="w-full p-2 rounded-lg bg-background border border-border text-[10px] font-bold uppercase" />
                <input type="text" placeholder="URL" value={link.url} onChange={(e) => handleLinkChange(index, 'url', e.target.value)} className="w-full p-2 rounded-lg bg-background border border-border text-[10px]" />
              </div>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start items-center">
                {['zalo', 'facebook', 'custom'].map((t) => (
                  <button key={t} type="button" onClick={() => handleLinkChange(index, 'type', t)} className={`px-2 py-1 rounded-md text-[8px] font-bold uppercase border transition-all ${link.type === t ? 'bg-primary text-white border-primary' : 'bg-background border-border text-muted-foreground'}`}>
                    {t}
                  </button>
                ))}
                {link.type === 'custom' && (
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-1 px-2 py-1 bg-background border border-border rounded-md text-[8px] font-bold uppercase cursor-pointer">
                      <Upload className="w-2 h-2" />
                      <span>{link.icon ? 'Đổi Icon' : 'Tải Icon'}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadIcon(index, f) }} />
                    </label>
                    {link.icon && (
                      <button type="button" onClick={() => handleLinkChange(index, 'icon', '')} className="p-1 text-red-500 hover:bg-red-500/10 rounded-md">
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
