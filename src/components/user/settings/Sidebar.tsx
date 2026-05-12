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
    <aside className="lg:col-span-4 space-y-6">
      <div>
        <div className="px-1 mb-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.common.account}</p>
        </div>

        {/* Unified Account Card */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center space-x-4 px-6 py-4 transition-all duration-200 group relative",
                activeTab === tab.id
                  ? "bg-slate-50 text-slate-900"
                  : "bg-white text-slate-500 hover:bg-slate-50/50",
                idx !== tabs.length - 1 && "border-b border-slate-100"
              )}
            >
              {/* Active Indicator Bar */}
              {activeTab === tab.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900" />
              )}
              
              <div className={cn(
                "transition-colors",
                activeTab === tab.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
              )}>
                {tab.icon}
              </div>
              <span className={cn(
                "text-[11px] uppercase tracking-widest transition-all",
                activeTab === tab.id ? "font-black" : "font-bold"
              )}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <div className="px-1 mb-3 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.common.support}</p>
          <div className="flex items-center space-x-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">{t.common.online}</span>
          </div>
        </div>

        {/* Separate Support Card */}
        <button
          onClick={() => setChatOpen(true)}
          className="w-full flex items-center space-x-4 px-6 py-4 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-500 hover:text-slate-900 rounded-2xl transition-all group"
        >
          <Headset className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span className="text-[11px] font-bold uppercase tracking-widest">{t.settings.sidebar.support_chat}</span>
        </button>
      </div>
    </aside>
  );
}
