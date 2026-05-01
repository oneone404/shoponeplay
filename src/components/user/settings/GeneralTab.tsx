"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Moon, Sun,
  Monitor, Globe, Bell,
  CheckCircle2, ChevronRight, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useLanguage } from "@/providers/LanguageProvider";

export default function GeneralTab() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [activeModal, setActiveModal] = useState<"theme" | "language" | null>(null);

  const themeOptions = [
    { id: "light", label: t.settings.system.light, icon: <Sun className="w-4 h-4" />, desc: t.settings.system.light_desc },
    { id: "dark", label: t.settings.system.dark, icon: <Moon className="w-4 h-4" />, desc: t.settings.system.dark_desc },
    { id: "system", label: t.settings.system.system, icon: <Monitor className="w-4 h-4" />, desc: t.settings.system.system_desc },
  ];

  const languageOptions = [
    { id: "vi", label: "Tiếng Việt", icon: "/images/languege/vi.svg", full: "Vietnam" },
    { id: "en", label: "English", icon: "/images/languege/en.svg", full: "United States" },
  ];

  const currentTheme = themeOptions.find(t => t.id === theme) || themeOptions[2];
  const currentLang = languageOptions.find(l => l.id === language) || languageOptions[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center space-x-2 text-primary">
          <Settings className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{t.settings.system.title}</h3>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 opacity-50">{t.settings.system.ui_lang}</h4>

        <div className="grid grid-cols-1 gap-2">
          {/* Theme Selector */}
          <button
            onClick={() => setActiveModal("theme")}
            className="flex items-center justify-between px-4 py-3 bg-secondary/20 border border-border/50 rounded-2xl hover:bg-secondary/40 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                {currentTheme.icon}
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t.settings.system.theme_mode}</p>
                <p className="text-[10px] text-primary font-bold uppercase">{currentTheme.label}</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Language Selector */}
          <button
            onClick={() => setActiveModal("language")}
            className="flex items-center justify-between px-4 py-3 bg-secondary/20 border border-border/50 rounded-2xl hover:bg-secondary/40 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                <img src={currentLang.icon} alt={currentLang.label} className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t.settings.system.language}</p>
                <p className="text-[10px] text-primary font-bold uppercase">{currentLang.label}</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="space-y-3 pt-2">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 opacity-50">{t.settings.system.notifications}</h4>
        
        <div className="flex items-center justify-between px-4 py-3 bg-secondary/20 border border-border/50 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider">{t.settings.system.push_notif}</p>
              <p className="text-[9px] text-muted-foreground font-medium opacity-50">{t.settings.system.notif_desc}</p>
            </div>
          </div>
          
          <button className="relative w-10 h-5 bg-primary rounded-full transition-colors focus:outline-none">
            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-card border border-border rounded-[32px] p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {activeModal === "theme" ? t.settings.system.select_theme : t.settings.system.select_lang}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {activeModal === "theme" ? (
                  themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { setTheme(opt.id as any); setActiveModal(null); }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-2xl border transition-all group",
                        theme === opt.id ? "border-primary bg-primary/5" : "border-transparent bg-secondary/40 hover:border-primary/20"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                          theme === opt.id ? "bg-primary text-white" : "bg-background text-muted-foreground"
                        )}>
                          {opt.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-[11px] font-bold uppercase tracking-wider">{opt.label}</p>
                          <p className="text-[9px] text-muted-foreground font-medium opacity-50">{opt.desc}</p>
                        </div>
                      </div>
                      {theme === opt.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </button>
                  ))
                ) : (
                  languageOptions.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => { setLanguage(lang.id as any); setActiveModal(null); }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-2xl border transition-all group",
                        language === lang.id ? "border-primary bg-primary/5" : "border-transparent bg-secondary/40 hover:border-primary/20"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                          <img src={lang.icon} alt={lang.label} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                          <p className="text-[11px] font-bold uppercase tracking-wider">{lang.label}</p>
                          <p className="text-[9px] text-muted-foreground font-medium opacity-50">{lang.full}</p>
                        </div>
                      </div>
                      {language === lang.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
