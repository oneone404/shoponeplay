"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Gamepad2, Package, ChevronRight, Zap, ShieldCheck, Clock, ArrowRightLeft } from "lucide-react"
import UserPageHeader from "@/components/shared/UserPageHeader"
import { ROUTES } from "@/lib/routes"

export default function ToolsLandingPage() {
  const tools = [
    {
      title: "Nạp Gói Game",
      description: "Nạp gói Play Together VNG chính hãng, an toàn, hỗ trợ ID người dùng.",
      icon: <Gamepad2 className="w-8 h-8" />,
      href: ROUTES.NAPGAME,
      color: "bg-primary/10 text-primary",
      badge: "Mới"
    },
    {
      title: "Công Cụ Hỗ Trợ (Hacks)",
      description: "Danh sách các bản hack, mod và công cụ hỗ trợ chơi game đỉnh cao.",
      icon: <Package className="w-8 h-8" />,
      href: ROUTES.HACKS,
      color: "bg-accent/10 text-accent",
    }
  ]
  return (
    <div className="min-h-screen bg-background">
      <UserPageHeader 
        title="Trung Tâm Công Cụ" 
        subtitle="Tổng hợp các tiện ích hỗ trợ chơi game và dịch vụ nạp game chuyên nghiệp"
      />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, idx) => (
          <Link 
            key={idx} 
            href={tool.href}
            className="group relative bg-card border-2 border-border rounded-[32px] p-8 hover:border-primary transition-all duration-300 overflow-hidden"
          >
            {/* Background Decoration */}
            <div className={cn(
              "absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:opacity-20",
              tool.color.split(' ')[0]
            )} />

            <div className="relative z-10 flex flex-col h-full space-y-6">
              <div className="flex items-start justify-between">
                <div className={cn("p-4 rounded-2xl", tool.color)}>
                  {tool.icon}
                </div>
                {tool.badge && (
                  <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase rounded-lg shadow-lg animate-pulse">
                    {tool.badge}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="pt-4 flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                <span>Trải nghiệm ngay</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-border">
        <FeatureItem 
          icon={<ShieldCheck className="w-6 h-6" />}
          title="An Toàn Tuyệt Đối"
          desc="Cam kết nạp đúng ID, bảo mật thông tin tài khoản."
        />
        <FeatureItem 
          icon={<Clock className="w-6 h-6" />}
          title="Xử Lý Siêu Tốc"
          desc="Hệ thống tự động, gói nạp về tài khoản sau 1-5 phút."
        />
        <FeatureItem 
          icon={<ArrowRightLeft className="w-6 h-6" />}
          title="Hỗ Trợ 24/7"
          desc="Đội ngũ kỹ thuật hỗ trợ giải đáp mọi thắc mắc."
        />
      </div>
      </div>
    </div>
  )
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <div className="p-3 bg-secondary rounded-xl text-primary">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold uppercase tracking-tight">{title}</h4>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
