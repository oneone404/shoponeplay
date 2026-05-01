"use client";

import {
  User, Settings, Lock, CreditCard,
  Headset
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUI } from "@/providers/UIProvider";
import { useLanguage } from "@/providers/LanguageProvider";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { setChatOpen } = useUI();
  const { t } = useLanguage();

  const tabs = [
    { id: "profile", label: t.settings.sidebar.profile, icon: <User className="w-4 h-4" /> },
    { id: "settings", label: t.settings.sidebar.system, icon: <Settings className="w-4 h-4" /> },
    { id: "security", label: t.settings.sidebar.security, icon: <Lock className="w-4 h-4" /> },
    { id: "billing", label: t.settings.sidebar.billing, icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <aside className="lg:col-span-4 space-y-1.5">
      <div className="px-3 mb-4">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-50">{t.common.account}</p>
      </div>

      <div className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden border",
              activeTab === tab.id
                ? "bg-primary/5 border-primary/20 text-primary"
                : "bg-transparent border-border/50 hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Active Indicator Line */}
            {activeTab === tab.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
            )}
            
            <div className={cn(
              "transition-colors",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}>
              {tab.icon}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="pt-8 mt-8 border-t border-border/50 space-y-4">
        <div className="px-4 flex items-center justify-between">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">{t.common.support}</p>
          <div className="flex items-center space-x-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">{t.common.online}</span>
          </div>
        </div>

        <button
          onClick={() => setChatOpen(true)}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-secondary/50 hover:bg-primary/10 hover:text-primary border border-border/50 rounded-xl transition-all group"
        >
          <Headset className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span className="text-[11px] font-bold uppercase tracking-widest">{t.settings.sidebar.support_chat}</span>
        </button>
      </div>
    </aside>
  );
}
