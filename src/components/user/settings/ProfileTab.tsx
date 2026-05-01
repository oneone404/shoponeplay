"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Camera, CheckCircle2, ShieldAlert, 
  Info, Mail, X, Shield, Pencil, Star, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { getMembershipTier } from "@/lib/membership";
import { useUI } from "@/providers/UIProvider";
import { useLanguage } from "@/providers/LanguageProvider";

interface ProfileTabProps {
  session: Session | null;
  update: () => Promise<any>;
}

export default function ProfileTab({ session, update }: ProfileTabProps) {
  const { addMessage } = useUI();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"success" | "error" | null>(null);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerifyCode = async (code: string) => {
    try {
      setLoading(true);
      const endpoint = isVerifyingEmail ? "/api/user/verify-email" : "/api/user/change-email";
      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email: newEmail, code }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        await update();
        addMessage({
          type: "success",
          text: t.common.success
        });
        setVerificationStatus("success");
        setTimeout(() => {
          setIsChangingEmail(false);
          setIsVerifyingEmail(false);
          setVerificationStatus(null);
          setVerificationCode("");
          setIsCodeSent(false);
        }, 2000);
      } else {
        addMessage({ type: "error", text: data.error || t.common.error });
        setVerificationStatus("error");
      }
    } catch (error) {
      addMessage({ type: "error", text: t.common.error });
      setVerificationStatus("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verificationCode.length === 6 && isCodeSent && !loading) {
      handleVerifyCode(verificationCode);
    }
  }, [verificationCode, isCodeSent]);

  const stats = [
    {
      label: t.settings.profile.balance,
      value: (session?.user as any)?.balance
        ? `${new Intl.NumberFormat('vi-VN').format((session?.user as any).balance)}`
        : "0",
      unit: "VND",
      color: "text-primary"
    },
    {
      label: t.settings.profile.total_deposited,
      value: session?.user?.totalDeposited
        ? `${new Intl.NumberFormat('vi-VN').format(session.user.totalDeposited)}`
        : "0",
      unit: "VND",
      color: "text-primary"
    },
    { 
      label: t.settings.profile.membership, 
      value: getMembershipTier(session?.user?.totalDeposited || 0).name, 
      unit: "Tier",
      color: getMembershipTier(session?.user?.totalDeposited || 0).color 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center space-x-2 text-primary">
          <User className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{t.settings.profile.title}</h3>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">#{t.common.account}-{session?.user?.id?.slice(-4).toUpperCase()}</span>
      </div>

      <div className="bg-card/40 border border-border rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="relative group cursor-pointer">
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl md:rounded-3xl border border-primary/20 p-1 bg-background overflow-hidden transition-all group-hover:border-primary/50">
              <img
                src={session?.user?.image || "/images/avatars/one-bot.png"}
                alt="Avatar"
                className="w-full h-full object-cover rounded-xl md:rounded-2xl transition-transform group-hover:scale-110"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-card scale-90 md:scale-100 group-hover:scale-110 transition-transform">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{session?.user?.name || "Member"}</h3>
                <div className={cn(
                  "px-2 py-0.5 text-[9px] font-bold uppercase rounded-lg border flex items-center gap-1.5",
                  getMembershipTier(session?.user?.totalDeposited || 0).bg,
                  getMembershipTier(session?.user?.totalDeposited || 0).color,
                  "border-current/10"
                )}>
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {getMembershipTier(session?.user?.totalDeposited || 0).name}
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium opacity-60">{session?.user?.email}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              <div className={cn(
                "px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg border flex items-center",
                session?.user?.emailVerified
                  ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
                  : "bg-amber-500/5 text-amber-500 border-amber-500/10"
              )}>
                {session?.user?.emailVerified ? (
                  <><CheckCircle2 className="w-3 h-3 mr-1.5" /> {t.common.verified}</>
                ) : (
                  <><ShieldAlert className="w-3 h-3 mr-1.5" /> {t.common.unverified}</>
                )}
              </div>
              <span className="px-2.5 py-1 bg-secondary/50 border border-border text-muted-foreground text-[9px] font-bold uppercase rounded-lg">ID: {session?.user?.id?.slice(-6).toUpperCase() || "......"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="px-5 py-4 bg-secondary/20 border border-border/50 rounded-2xl flex flex-col items-center md:items-start group hover:bg-secondary/40 transition-all cursor-default">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</span>
            <div className="flex items-baseline gap-1.5">
              <span className={cn("text-xl font-bold", stat.color)}>{stat.value}</span>
              <span className="text-[10px] font-bold text-muted-foreground opacity-50">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{t.settings.profile.display_name}</label>
          <input
            type="text"
            defaultValue={session?.user?.name || ""}
            className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary/40 transition-all font-bold text-sm"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{t.settings.profile.email_address}</label>
          <div className="relative group">
            <input
              type="email"
              disabled={!isChangingEmail}
              defaultValue={session?.user?.email || ""}
              onChange={(e) => setNewEmail(e.target.value)}
              className={cn(
                "w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none font-bold text-sm transition-all",
                isChangingEmail ? "focus:border-primary/40 border-primary/30 ring-2 ring-primary/5" : "opacity-60 cursor-not-allowed"
              )}
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              {!isChangingEmail && !isVerifyingEmail ? (
                session?.user?.emailVerified ? (
                  <button
                    onClick={() => {
                      setIsChangingEmail(true);
                      setNewEmail(session?.user?.email || "");
                    }}
                    className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsVerifyingEmail(true);
                      setNewEmail(session?.user?.email || "");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-amber-500/20 transition-all"
                  >
                    <ShieldAlert className="w-3 h-3" />
                    {t.common.verify_now}
                  </button>
                )
              ) : (
                <button
                  onClick={() => {
                    setIsChangingEmail(false);
                    setIsVerifyingEmail(false);
                    setVerificationCode("");
                    setIsCodeSent(false);
                  }}
                  className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OTP Section */}
      <AnimatePresence>
        {(isChangingEmail || isVerifyingEmail) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest">
                    {isVerifyingEmail ? t.common.verify_now : t.settings.profile.email_address}
                  </h4>
                  <p className="text-[9px] text-muted-foreground font-medium opacity-60">OTP: {newEmail}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="123456"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary/40 text-center font-bold tracking-[0.5em] text-sm"
              />
              
              <button
                disabled={(isCodeSent && countdown > 0) || !newEmail || loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    const res = await fetch("/api/user/send-otp", {
                      method: "POST",
                      body: JSON.stringify({
                        email: newEmail,
                        type: isVerifyingEmail ? "verify" : "change"
                      }),
                      headers: { "Content-Type": "application/json" }
                    });
                    const data = await res.json();
                    if (data.success) {
                      setIsCodeSent(true);
                      setCountdown(60);
                      addMessage({ type: "success", text: t.common.success });
                    } else {
                      addMessage({ type: "error", text: data.error || t.common.error });
                    }
                  } catch (error) {
                    addMessage({ type: "error", text: t.common.error });
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full sm:w-auto px-6 h-[42px] bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : isCodeSent && countdown > 0 ? (
                  `${t.common.resend} (${countdown}s)`
                ) : (
                  t.common.send_otp
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end pt-4">
        <button className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all border border-primary/20">
          {t.common.save}
        </button>
      </div>
    </div>
  );
}
