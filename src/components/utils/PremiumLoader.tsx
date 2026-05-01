"use client"

import { motion } from "framer-motion"

export function PremiumLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-colors duration-500">
      {/* Subtle Central Glow - Adaptive */}
      <div className="absolute w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-40 dark:opacity-10" />

      <div className="relative flex flex-col items-center">
        {/* Minimalist Core */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer Thin Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <motion.circle
              cx="48"
              cy="48"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-foreground/5"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="280"
              animate={{ strokeDashoffset: [280, -280] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-primary"
            />
          </svg>

          {/* Inner Pulsing Dot */}
          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-4 bg-primary rounded-full blur-[2px]"
          />
        </div>

        {/* Brand Text */}
        <div className="mt-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1"
          >
            <span className="text-2xl font-bold tracking-tighter text-foreground uppercase">[SHOP</span>
            <div className="h-7 w-[2px] bg-foreground/20" />
            <span className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent uppercase">ONEPLAY]</span>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent mt-4"
          />

          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.5em] mt-3">
            Loading Experience
          </span>
        </div>
      </div>
    </div>
  )
}
