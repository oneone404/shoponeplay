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
          <Link key={idx} href={`/services/${srv.slug}`} className="group bg-card border-[3px] border-border rounded-xl overflow-hidden transition-all duration-500 active:scale-[0.97]">
            <div className="aspect-[16/9] relative overflow-hidden bg-secondary shrink-0">
                <Image
                  src={srv.thumbnail}
                  alt={srv.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

            <div className="p-4 md:p-6 flex flex-col items-center">
              <div className="mb-4 text-center">
                <h3 className="text-xs md:text-lg font-bold uppercase tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1">
                  {srv.name}
                </h3>
              </div>

              <div className="flex items-center justify-center gap-2 md:gap-3 mb-1 w-full">
                <div className="px-2 py-0.5 md:px-3 md:py-0.5 border md:border-2 border-border rounded-full flex items-center gap-1 md:gap-1.5 bg-background">
                  <span className="text-[8px] md:text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase whitespace-nowrap leading-none">{t.common.status}</span>
                  <div className="h-3 md:h-5 w-[1px] bg-border" />
                  <span className="text-[8px] md:text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Sẵn sàng</span>
                </div>
              </div>

              <div className="mt-0 w-full max-w-[200px] active:scale-95 transition-all">
                <img src="/images/buttons/xemtatca.png" alt="Xem Chi Tiết" className="w-full h-auto object-contain mx-auto" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
