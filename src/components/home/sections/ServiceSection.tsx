"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"

export function ServiceSection() {
  const { t } = useLanguage();

  const SERVICES = [
    { title: t.home.service_list.leveling, sub: t.home.service_list.leveling_sub, img: "/images/categories/cat_service.png", color: "emerald" },
    { title: t.home.service_list.diamond, sub: t.home.service_list.diamond_sub, img: "/images/categories/cat_service.png", color: "blue" },
    { title: t.home.service_list.insurance, sub: t.home.service_list.insurance_sub, img: "/images/categories/cat_service.png", color: "secondary" },
    { title: t.home.service_list.giftbox, sub: t.home.service_list.giftbox_sub, img: "/images/categories/cat_service.png", color: "amber" }
  ]

  return (
    <section>
      <div className="flex flex-col items-center justify-center mb-10 px-2 text-center">
        <div className="flex flex-col items-center">
          <h2 className="text-xl md:text-2xl font-bold tracking-tighter uppercase leading-tight">
            {t.home.services_title} <span className="text-foreground">{t.home.services_highlight}</span>
          </h2>
          <div className="h-1 w-20 mt-3 rounded-full bg-foreground" />
        </div>
      </div>


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-6">
        {SERVICES.map((srv, idx) => (
          <Link key={idx} href={ROUTES.SHOP} className="group bg-card border border-border/60 rounded-xl overflow-hidden shadow-md transition-all duration-500 active:scale-[0.97]">
            <div className="aspect-[16/9] relative overflow-hidden">
              <Image
                src={srv.img}
                alt={srv.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                className="object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
            </div>

            <div className="p-4 md:p-6">
              <div className="mb-4">
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-tighter text-foreground line-clamp-1 group-hover:text-foreground transition-colors mb-1">
                  {srv.title}
                </h3>

              </div>

              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.common.status}</span>
                  <span className="text-[9px] md:text-xs font-bold text-emerald-600 uppercase tracking-widest">Sẵn sàng</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="w-full py-2.5 md:py-3.5 bg-secondary/20 border border-border/80 text-muted-foreground rounded-xl text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.95] flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground group-hover:text-background">
                  <span>{t.common.view_more.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
