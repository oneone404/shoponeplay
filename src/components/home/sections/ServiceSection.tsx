"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"

export function ServiceSection({ services = [] }: { services?: any[] }) {
  const { t } = useLanguage();

  if (services.length === 0) return null;

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
        {services.map((srv, idx) => (
          <Link key={idx} href={`/services/${srv.slug}`} className="group bg-card border border-border rounded-xl overflow-hidden shadow-md transition-all duration-500 active:scale-[0.97]">
            <div className="p-1.5 md:p-3 pb-0">
              <div className="aspect-[16/9] relative overflow-hidden rounded-2xl border-2 md:border-4 border-background shadow-sm">
                <Image
                  src={srv.thumbnail}
                  alt={srv.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            <div className="p-4 md:p-6">
              <div className="mb-4 text-center">
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-tighter text-foreground line-clamp-1 group-hover:text-foreground transition-colors mb-1">
                  {srv.name}
                </h3>
              </div>

              <div className="flex items-center justify-center gap-1.5 py-1.5 bg-background/50 border border-border rounded-full shadow-sm md:py-2">
                <span className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{t.common.status}:</span>
                <span className="text-[9px] md:text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Sẵn sàng</span>
              </div>

              <div className="mt-5">
                <div className="w-full py-2.5 bg-secondary/50 border border-border text-foreground rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary active:scale-95 transition-all shadow-sm flex items-center justify-center group/btn">
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
