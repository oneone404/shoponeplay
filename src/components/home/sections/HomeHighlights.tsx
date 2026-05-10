"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/providers/LanguageProvider"

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

export function HomeHighlights({ 
  title, 
  description,
  introLinks 
}: { 
  title?: string, 
  description?: string,
  introLinks?: string
}) {
  const { t } = useLanguage();
  
  const links = React.useMemo(() => {
    try {
      return JSON.parse(introLinks || "[]");
    } catch (e) {
      return [];
    }
  }, [introLinks]);

  return (
    <section className="py-6 max-w-7xl mx-auto px-4">
      <div className="bg-card border-2 border-border rounded-2xl md:rounded-[24px] p-5 md:p-7 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full -ml-16 -mb-16 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
          
          {/* LEFT COLUMN: TITLE & DESCRIPTION */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter mb-6 leading-none">
              <span 
                className="text-primary"
                dangerouslySetInnerHTML={{ __html: title || t.home.intro_title }}
              />
            </h2>
            <div className="space-y-6 text-muted-foreground font-medium leading-relaxed">
              {description ? (
                <div 
                  className="prose prose-invert max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <>
                  <p>
                    {t.home.intro_desc_1.split("Play Together")[0]}
                    <span className="text-foreground font-bold">Play Together</span>
                    {t.home.intro_desc_1.split("Play Together")[1]}
                  </p>
                  <p>
                    {t.home.intro_desc_2}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: DYNAMIC CONTACT LINKS */}
          <div className="md:col-span-1">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {links.map((link: any, idx: number) => {
                const isZalo = link.type === 'zalo';
                const isFB = link.type === 'facebook';
                
                const textColor = isZalo ? 'text-[#0068ff]' : isFB ? 'text-[#1877f2]' : 'text-accent';
                const bgColor = isZalo ? 'bg-[#0068ff]/10 hover:bg-[#0068ff]/20 border-[#0068ff]/20' : 
                                isFB ? 'bg-[#1877f2]/10 hover:bg-[#1877f2]/20 border-[#1877f2]/20' : 
                                'bg-accent/10 hover:bg-accent/20 border-accent/20';

                return (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center space-x-2 ${bgColor} px-2.5 py-2 md:py-2.5 rounded-xl border transition-all group active:scale-95`}
                  >
                    <div className="w-6 h-6 md:w-7 h-7 bg-white rounded-lg p-0.5 md:p-1 border-2 border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <div className="w-full h-full relative flex items-center justify-center">
                        {link.icon ? (
                          <img src={link.icon} alt={link.label} className="w-full h-full object-contain" />
                        ) : isZalo ? (
                          <img src="/images/brand/zalo.svg" alt="Zalo" className="w-full h-full object-contain" />
                        ) : isFB ? (
                          <FacebookIcon className={`w-full h-full ${textColor}`} />
                        ) : (
                          <svg className={`w-full h-full ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-start leading-none overflow-hidden">
                      <span className={`text-[9px] md:text-[10px] font-bold uppercase truncate w-full ${textColor}`}>
                        {link.label}
                      </span>
                    </div>
                  </a>
                );
              })}

              {links.length === 0 && (
                <div className="p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Chưa có liên kết liên hệ</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
