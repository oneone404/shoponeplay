"use client"

import { motion } from "framer-motion"
import { Shield, Download, ArrowRight, Gamepad2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { USER_ROUTES } from "@/lib/config/user-routes"
import { cn } from "@/lib/utils"
import UserPageHeader from "@/components/shared/UserPageHeader"

interface HackTool {
  id: string
  name: string
  slug: string
  version: string
  thumbnail: string | null
  status: string
  totalDownload: number
}

export default function HacksList({ hacks }: { hacks: HackTool[] }) {
  return (
    <div className="bg-background min-h-screen">
      <UserPageHeader
        subtitle="Danh Sách Công Cụ Hỗ Trợ Các Loại Game"
        title="CÔNG CỤ"
        highlightTitle="HỖ TRỢ"
      />

      <div className="px-4 max-w-7xl mx-auto py-12">

      {hacks.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-sm font-bold uppercase tracking-widest">Chưa có phần mềm nào</p>
          <p className="text-xs mt-1 text-muted-foreground">Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hacks.map((hack, idx) => (
            <motion.div
              key={hack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                href={USER_ROUTES.HACK_DETAIL(hack.slug, hack.name).path}
                className="group block border-2 border-border rounded-2xl overflow-hidden bg-card hover:border-primary transition-all duration-300 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/9] bg-secondary overflow-hidden">
                  {hack.thumbnail ? (
                    <Image
                      src={hack.thumbnail}
                      alt={hack.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <Gamepad2 className="w-16 h-16" />
                    </div>
                  )}
                  {/* Overlay Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">v{hack.version}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {hack.name}
                    </h2>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 rounded-full">
                      <Download className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-bold text-primary">{(hack.totalDownload + 8540).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Hoạt Động</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary group-hover:gap-2 transition-all">
                      Xem Chi Tiết
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
