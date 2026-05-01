"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Trophy, ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
              Top #1 Gaming Marketplace
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-5xl md:text-7xl font-bold tracking-tight"
          >
            Elevate Your <span className="text-gradient">Gaming</span> Experience
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Discover premium hacks and verified accounts for PlayTogether and more. 
            Secure, fast, and 100% reliable services.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95">
              <span>Browse Products</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 glass hover:bg-white/5 text-foreground rounded-xl font-bold transition-all border border-white/10">
              Join Discord
            </button>
          </motion.div>

          {/* Stats/Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-primary" />}
              title="Secure Platform"
              description="Safe transactions with guaranteed account protection."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-accent" />}
              title="Instant Delivery"
              description="Get your accounts or hacks instantly after payment."
            />
            <FeatureCard 
              icon={<Trophy className="w-6 h-6 text-yellow-500" />}
              title="Elite Quality"
              description="Only the best hacks and highest-level accounts."
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 glass rounded-2xl border border-white/5 hover:border-primary/20 transition-colors text-left group">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
