"use client"

import Link from "next/link"
import Image from "next/image"
import { APP_VERSION } from "@/lib/version"
import { useLanguage } from "@/providers/LanguageProvider"
import { usePathname } from "next/navigation"

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.259 0-3.668.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const MasterCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35" cy="30" r="25" fill="#EB001B" fillOpacity="0.8" />
    <circle cx="65" cy="30" r="25" fill="#F79E1B" fillOpacity="0.8" />
    <path d="M50 10.3a25 25 0 0 0 0 39.4 25 25 0 0 0 0-39.4z" fill="#FF5F00" />
  </svg>
)

export default function Footer({ logoUrl }: { logoUrl?: string }) {
  const { t } = useLanguage();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/seller')) return null;

  return (
    <footer className="bg-card border-t border-border pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="md:col-span-1">
          {logoUrl ? (
            <div className="relative h-12 w-auto mb-6">
              <Image 
                src={logoUrl} 
                alt="Footer Logo" 
                height={48} 
                width={160} 
                unoptimized={true}
                className="h-12 w-auto object-contain"
              />
            </div>
          ) : (
            <div className="relative h-12 w-auto mb-6">
              <Image 
                src="https://placehold.co/400x120/e2e8f0/1e293b?text=No+Image" 
                alt="No Footer Logo" 
                height={48} 
                width={160} 
                unoptimized={true}
                className="h-12 w-auto object-contain grayscale opacity-50"
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-6 uppercase tracking-widest">{t.footer.desc}</p>
          <div className="flex items-center space-x-3">
            <Link href="#" className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground hover:bg-[#1877F2] hover:text-white transition-all duration-300">
              <FacebookIcon className="w-5 h-5" />
            </Link>
            <Link href="#" className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground hover:bg-[#FF0000] hover:text-white transition-all duration-300">
              <YoutubeIcon className="w-5 h-5" />
            </Link>
            <Link href="#" className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:text-white transition-all duration-300">
              <InstagramIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div>
          <h5 className="font-bold uppercase tracking-widest text-[10px] mb-6 text-foreground">{t.footer.about_us}</h5>
          <ul className="space-y-3 text-xs font-bold text-muted-foreground uppercase tracking-tighter">
            <li><Link href="#" className="hover:text-primary">{t.footer.terms}</Link></li>
            <li><Link href="#" className="hover:text-primary">{t.footer.privacy}</Link></li>
            <li><Link href="#" className="hover:text-primary">{t.footer.faq}</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold uppercase tracking-widest text-[10px] mb-6 text-foreground">{t.footer.customer_support}</h5>
          <ul className="space-y-3 text-xs font-bold text-muted-foreground uppercase tracking-tighter">
            <li><Link href="#" className="hover:text-primary">{t.footer.topup_guide}</Link></li>
            <li><Link href="#" className="hover:text-primary">{t.footer.buying_guide}</Link></li>
            <li><Link href="#" className="hover:text-primary">{t.footer.contact_support}</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold uppercase tracking-widest text-[10px] mb-6 text-foreground">{t.footer.contact}</h5>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t.footer.support_247}:</p>
          <p className="text-xl font-bold text-primary tracking-tighter mb-4">099 888 8888</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Facebook Page:</p>
          <p className="text-xs font-bold text-foreground uppercase tracking-widest">/shoponeplay.official</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="h-8 w-auto px-3 py-1 bg-white rounded-md flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer">
              <Image src="/images/brand/momo.svg" alt="MoMo" width={32} height={32} className="h-6 w-auto object-contain" />
            </div>
            <div className="h-8 w-auto px-3 py-1 bg-white rounded-md flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer">
              <Image src="/images/brand/visa.svg" alt="Visa" width={32} height={20} className="h-6 w-auto object-contain" />
            </div>
            <div className="h-8 w-auto px-3 py-1 bg-white rounded-md flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer">
              <MasterCardIcon className="h-full w-auto" />
            </div>
            <div className="h-8 w-auto px-3 py-1 bg-white rounded-md flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer">
              <Image src="/images/brand/zalopay.svg" alt="ZaloPay" width={32} height={32} className="h-6 w-auto object-contain" />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">© 2026 SHOPONEPLAY. {t.common.all_rights}</p>
          <div className="hidden md:block h-3 w-[1px] bg-border/50" />
          <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Version {APP_VERSION}</p>
        </div>
      </div>
    </footer>
  )
}
