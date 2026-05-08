"use client"

import { useState } from "react"
import { Search, Gamepad2, ArrowRight, ShieldCheck, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface GameService {
  id: string
  name: string
  slug: string
  thumbnail: string
  description: string | null
  type: string
  _count: {
    options: number
  }
}

interface ServiceListClientProps {
  initialServices: any[]
}

export default function ServiceListClient({ initialServices }: ServiceListClientProps) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("ALL")

  const filteredServices = initialServices.filter(s => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase())
    const matchesTab = activeTab === 'ALL' || s.type === activeTab
    return matchesSearch && matchesTab
  })

  const tabs = [
    { id: 'ALL', label: 'Tất cả', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
    { id: 'LEVELING', label: 'Cày Thuê', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'TOPUP', label: 'Nạp Tiền', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="space-y-8">
      {/* Search & Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex p-1 bg-secondary rounded-2xl w-full md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                activeTab === tab.id 
                  ? "bg-background text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-secondary border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredServices.length > 0 ? filteredServices.map((service) => (
          <Link 
            key={service.id} 
            href={`/services/${service.slug}`}
            className="group flex flex-col bg-card border border-border rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.98]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image 
                src={service.thumbnail || "/images/placeholder.jpg"} 
                alt={service.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-background/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-primary border border-primary/10 shadow-sm">
                  {service.type === 'LEVELING' ? 'Cày Thuê' : 'Nạp Game'}
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight">
                {service.name}
              </h3>
              
              <p className="text-muted-foreground text-xs font-medium line-clamp-2 mt-2 leading-relaxed h-8">
                {service.description || "Dịch vụ uy tín, bảo mật cao, hoàn thành đúng tiến độ."}
              </p>

              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Lựa chọn</span>
                  <span className="text-sm font-black text-foreground">{service._count.options} gói giá tốt</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        )) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-secondary rounded-[2.5rem] flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Không tìm thấy kết quả</h3>
            <p className="text-muted-foreground text-sm font-medium mt-2">Vui lòng thử tìm kiếm với từ khóa khác.</p>
          </div>
        )}
      </div>
    </div>
  )
}
