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
    <aside className="lg:col-span-4 space-y-4">
      <div className="px-1 mb-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.common.account}</p>
      </div>

      <div className="space-y-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-200 group relative border-2",
              activeTab === tab.id
                ? "bg-blue-50 border-blue-600 text-blue-700 scale-[1.02]"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <div className={cn(
              "transition-colors",
              activeTab === tab.id ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"
            )}>
              {tab.icon}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
        <div className="px-1 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.common.support}</p>
          <div className="flex items-center space-x-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">{t.common.online}</span>
          </div>
        </div>

        <button
          onClick={() => setChatOpen(true)}
          className="w-full flex items-center space-x-4 px-5 py-4 bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded-2xl transition-all group"
        >
          <Headset className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span className="text-[11px] font-bold uppercase tracking-widest">{t.settings.sidebar.support_chat}</span>
        </button>
      </div>
    </aside>
  );
}
