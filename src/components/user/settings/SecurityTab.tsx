"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ConfirmModal from "@/components/utils/ConfirmModal";
import {
  Lock, Shield, ShieldCheck, ShieldAlert,
  Smartphone, Key, Copy, RefreshCw, X
} from "lucide-react";
import { cn } from "@/lib/utils"
import { Session } from "next-auth";
import { useUI } from "@/providers/UIProvider";
import { useLanguage } from "@/providers/LanguageProvider";

interface SecurityTabProps {
  session: Session | null;
  update: () => Promise<any>;
}

export default function SecurityTab({ session, update }: SecurityTabProps) {
  const { addMessage } = useUI();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });

  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [showConfirmDisable2FA, setShowConfirmDisable2FA] = useState(false);

  const handleChangePassword = async () => {
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      addMessage({ type: "error", text: t.auth.try_again });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      addMessage({ type: "error", text: t.settings.security.confirm_password });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword: passwords.old, newPassword: passwords.new }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        addMessage({ type: "success", text: t.common.success });
        setPasswords({ old: "", new: "", confirm: "" });
      } else {
        addMessage({ type: "error", text: data.error || t.common.error });
      }
    } catch (error) {
      addMessage({ type: "error", text: t.common.error });
    } finally {
      setLoading(false);
    }
  };

  const handleStart2FASetup = async () => {
    try {
      setIs2FALoading(true);
      const res = await fetch("/api/user/2fa/generate");
      const data = await res.json();
      if (data.success) {
        setTwoFactorSecret(data.secret);
        setIsSettingUp2FA(true);
      }
    } catch (error) {
      addMessage({ type: "error", text: t.common.error });
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (twoFactorCode.length !== 6) return;
    try {
      setIs2FALoading(true);
      const res = await fetch("/api/user/2fa/verify", {
        method: "POST",
        body: JSON.stringify({ code: twoFactorCode, secret: twoFactorSecret }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        await update();
        addMessage({ type: "success", text: t.common.success });
        setIsSettingUp2FA(false);
        setTwoFactorCode("");
        setTwoFactorSecret("");
      } else {
        addMessage({ type: "error", text: data.error || t.common.error });
      }
    } catch (error) {
      addMessage({ type: "error", text: t.common.error });
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setShowConfirmDisable2FA(false);
    try {
      setLoading(true);
      const res = await fetch("/api/user/2fa/disable", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await update();
        addMessage({ type: "success", text: t.common.success });
      }
    } catch (error) {
      addMessage({ type: "error", text: t.common.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmModal 
        isOpen={showConfirmDisable2FA}
        onClose={() => setShowConfirmDisable2FA(false)}
        onConfirm={handleDisable2FA}
        title="Tắt Bảo Mật 2 Lớp"
        message="Bạn Có Chắc Chắn Muốn Tắt Bảo Mật 2 Lớp? Tài Khoản Của Bạn Sẽ Kém An Toàn Hơn."
        confirmText="Tắt Ngay"
        cancelText="Để Sau"
        type="warning"
        isLoading={loading}
      />
      {/* Change Password Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center space-x-2 text-primary">
            <Lock className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{t.settings.security.title}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{t.settings.security.current_password}</label>
            <input
              type="password"
              value={passwords.old}
              onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-secondary/20 border border-border/50 rounded-xl px-4 py-2.5 outline-none focus:border-primary/40 transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{t.settings.security.new_password}</label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-secondary/20 border border-border/50 rounded-xl px-4 py-2.5 outline-none focus:border-primary/40 transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{t.settings.security.confirm_password}</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-secondary/20 border border-border/50 rounded-xl px-4 py-2.5 outline-none focus:border-primary/40 transition-all font-medium text-sm"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 border border-primary/20"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : t.settings.security.change_password}
          </button>
        </div>
      </section>

      {/* 2FA Section */}
      <section className="space-y-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center space-x-2 text-primary">
            <Shield className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{t.settings.security.two_factor}</h3>
          </div>
        </div>

        {!isSettingUp2FA ? (
          <div className="bg-secondary/20 p-5 rounded-2xl border border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                session?.user?.twoFactorEnabled ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
              )}>
                {session?.user?.twoFactorEnabled ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest">{t.settings.security.two_factor}</p>
                  <span className={cn(
                    "text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase",
                    session?.user?.twoFactorEnabled ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  )}>
                    {session?.user?.twoFactorEnabled ? t.settings.security.active : t.settings.security.disabled}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium opacity-60">
                  {session?.user?.twoFactorEnabled
                    ? t.settings.security.active
                    : t.settings.security.two_factor_desc}
                </p>
              </div>
            </div>
            
            <button
              onClick={session?.user?.twoFactorEnabled ? () => setShowConfirmDisable2FA(true) : handleStart2FASetup}
              disabled={is2FALoading || loading}
              className={cn(
                "px-6 py-2 bg-secondary border border-border/50 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/80 transition-all active:scale-95",
                session?.user?.twoFactorEnabled ? "text-red-500 hover:bg-red-500/5" : "text-primary hover:bg-primary/5"
              )}
            >
              {is2FALoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : (
                session?.user?.twoFactorEnabled ? t.settings.security.disabled : t.settings.security.active
              )}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/40 border border-border rounded-3xl p-6 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest">{t.settings.security.setup_2fa}</h4>
                  <p className="text-[9px] text-muted-foreground font-medium opacity-60 italic">{t.settings.security.scan_qr}</p>
                </div>
              </div>
              <button onClick={() => setIsSettingUp2FA(false)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/30 p-3.5 rounded-xl border border-border/50 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.settings.security.secret_key}</p>
                  <p className="text-xs font-bold tracking-widest text-primary uppercase truncate pr-4">{twoFactorSecret}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(twoFactorSecret);
                    addMessage({ type: "success", text: t.common.copy_success });
                  }}
                  className="shrink-0 p-2 bg-background border border-border rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="123456"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary/40 transition-all text-center text-sm font-bold tracking-[0.3em]"
                  />
                </div>
                <button
                  onClick={handleVerify2FA}
                  disabled={twoFactorCode.length !== 6 || is2FALoading}
                  className="px-6 h-[42px] bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {is2FALoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : t.common.verified}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
