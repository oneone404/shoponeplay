"use client";

import { motion } from "framer-motion";
import { CreditCard, Plus, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import Image from "next/image";

import { useUI } from "@/providers/UIProvider";
import { useLanguage } from "@/providers/LanguageProvider";

interface BillingTabProps {
  session: Session | null;
}

export default function BillingTab({ session }: BillingTabProps) {
  const { setDepositOpen } = useUI();
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center space-x-2 text-emerald-500">
          <Wallet className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{t.settings.billing.title}</h3>
        </div>
      </div>

      <div className="space-y-4">
        {/* Wallet Balance Card */}
        <div className="bg-secondary/20 border border-border/50 rounded-2xl p-5 flex items-center justify-between group">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{t.settings.billing.balance}</p>
              <div className="flex items-baseline gap-1.5">
                <h4 className="text-xl font-bold text-foreground">
                  {session?.user?.balance
                    ? `${new Intl.NumberFormat('vi-VN').format(session.user.balance)}`
                    : "0"}
                </h4>
                <span className="text-[10px] font-bold text-muted-foreground opacity-50 uppercase">VND</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setDepositOpen(true)}
            className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 border border-emerald-400/20 shadow-none"
          >
            {t.settings.billing.deposit}
          </button>
        </div>

        {/* Payment Methods Section */}
        <div className="space-y-3 pt-2">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-50 ml-1">{t.settings.billing.saved_methods}</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Ví MoMo', icon: "/images/brand/momo.svg", color: 'text-[#A50064]', bg: 'bg-[#A50064]/5', linked: false },
              { name: 'Visa/Master', icon: "/images/brand/visa.svg", color: 'text-blue-600', bg: 'bg-blue-600/5', linked: false },
            ].map((method) => (
              <div key={method.name} className="flex items-center space-x-3 p-3 bg-secondary/10 border border-border/30 rounded-xl opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden p-2 bg-background border border-border", method.bg)}>
                  <Image src={method.icon} alt={method.name} width={32} height={32} className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">{method.name}</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter italic">{t.common.not_linked}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-3 border border-dashed border-border/60 rounded-xl flex items-center justify-center space-x-2 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all group">
            <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.settings.billing.link_new}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
