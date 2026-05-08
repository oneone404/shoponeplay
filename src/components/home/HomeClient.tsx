"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { ShoppingCart, Zap } from "lucide-react"
import { useLanguage } from "@/providers/LanguageProvider"

export default function HomeClient({ 
  notifications: initialNotifications,
  bannerUrl,
  heroTitle,
  heroSub,
  heroTopText,
  heroBottomText
}: { 
  notifications: string[],
  bannerUrl?: string,
  heroTitle?: string,
  heroSub?: string,
  heroTopText?: string,
  heroBottomText?: string
}) {
  const { t } = useLanguage();
  const DEFAULT_BANNER = "https://placehold.co/1920x800/e2e8f0/1e293b?text=No+Image";

  // Map notifications to translations if they match patterns, or use defaults from t.home.notif
  const displayNotifications = [
    t.home.notif.deposit_success.replace("{user}", "*******123").replace("{amount}", "100.000"),
    t.home.notif.buy_success.replace("{user}", "*******789").replace("{product}", "Tài khoản PlayTogether [PLAY TOGETHER VNG]"),
    t.home.notif.atm_success.replace("{user}", "*******456").replace("{amount}", "500.000"),
    t.home.notif.new_trade.replace("{product}", "Tài khoản Random Kim Cương"),
  ];

  return (
    <>
      {/* 1. Modular Interactive Banner */}
      <section className="pt-20 px-4 max-w-7xl mx-auto">
        <div className="relative h-[180px] md:h-[400px] w-full rounded-2xl md:rounded-[40px] overflow-hidden group bg-secondary/20 border border-border">

          {/* BACKGROUND LAYER */}
          <div className="absolute inset-0">
            <Image
              src={bannerUrl ? `${bannerUrl}?v=1` : DEFAULT_BANNER}
              alt="Background"
              fill
              unoptimized={true}
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/5 z-10" />
          </div>

          {/* CONTENT LAYER */}
          <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-20 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-3 md:mb-8 flex flex-col items-start w-full md:w-auto overflow-visible"
            >
              <div className="relative flex flex-col items-start">
                <span
                  className="text-3xl md:text-8xl text-yellow-400 tracking-tighter drop-shadow-[0_4px_0_rgba(184,87,3,1)] md:drop-shadow-[0_8px_0_rgba(184,87,3,1)]"
                  style={{ fontFamily: 'var(--font-luckiest-guy)', WebkitTextStroke: '1px #fff' }}
                >
                  {heroTopText || "PLAY"}
                </span>
                <div
                  className="mt-[-10px] md:mt-[-30px] ml-1 md:ml-4 text-xl md:text-6xl text-white tracking-widest drop-shadow-[0_2px_0_rgba(180,0,0,1)] md:drop-shadow-[0_4px_0_rgba(180,0,0,1)] px-3 py-1 bg-accent rounded-lg md:rounded-2xl shrink-0"
                  style={{ fontFamily: 'var(--font-luckiest-guy)' }}
                >
                  {heroBottomText || "TOGETHER!"}
                </div>
              </div>
            </motion.div>

            <div className="max-w-3xl flex flex-col items-start animate-banner-container">
              <div className="relative p-1.5 md:p-8 bg-black/40 border border-white/10 rounded-lg md:rounded-3xl overflow-hidden group">
                <div className="flex flex-col items-start select-none relative z-10">
                  <h1
                    className="text-lg md:text-5xl font-bold tracking-tight leading-none pr-2 animate-banner-title"
                    style={{
                      color: '#fff',
                      textShadow: '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 2px 4px rgba(0,0,0,.3)'
                    }}
                  >
                    <span className="bg-gradient-to-b from-white via-white to-primary/80 bg-clip-text text-transparent">
                      {heroTitle || "SHOPONEPLAY.COM"}
                    </span>
                  </h1>

                  <div className="mt-2 md:mt-6 bg-accent/90 px-3 py-1.5 md:px-6 md:py-2.5 -skew-x-6 rounded-full shadow-lg shadow-accent/30 flex items-center justify-center animate-banner-sub">
                    <span className="text-[7.5px] md:text-xl font-bold tracking-widest text-white italic leading-none">
                      {heroSub || t.home.banner_sub}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Enhanced Notification Marquee */}
      <section className="px-4 max-w-7xl mx-auto mt-6">
        <div className="relative bg-card/40 backdrop-blur-md border border-primary/1 pr-4 flex items-center h-9 md:h-11 overflow-hidden rounded-xl md:rounded-[18px] group shadow-sm">

          {/* Static Shopping Cart Icon Label */}
          <div className="relative z-20 flex items-center h-full pl-5 pr-4 md:pl-7 md:pr-5 bg-gradient-to-r from-accent to-rose-600 text-white skew-x-[-12deg] -ml-1 mr-5 md:mr-7 shadow-lg">
            <div className="skew-x-[12deg] flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5 md:w-5 md:h-5 text-white/90" />
            </div>
            {/* Animated Glow behind the label */}
            <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay" />
          </div>

          {/* Marquee Content with Mask Fade */}
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              animate={{ x: [0, -2000] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
              className="flex items-center space-x-12 whitespace-nowrap py-1"
            >
              {Array(15).fill(displayNotifications).flat().map((note, i) => (
                <div key={i} className="flex items-center space-x-3 text-[11px] md:text-[13px] font-bold text-foreground/70 uppercase tracking-wide group/note cursor-default">
                  <Zap className="w-3.5 h-3.5 md:w-3.5 md:h-3.5 text-accent/80 group-hover:note:scale-125 transition-transform" />
                  <span>{note}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Decoration */}
          <div className="hidden md:flex items-center opacity-20 group-hover:opacity-100 transition-opacity pl-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          </div>
        </div>
      </section>
    </>
  )
}
