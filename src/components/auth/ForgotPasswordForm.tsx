"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, Loader2, ArrowRight, CheckCircle2, Lock, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useLanguage } from "@/providers/LanguageProvider"

export function ForgotPasswordForm() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!email) return

    try {
      setLoading(true)
      setMessage(null)
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      if (data.success) {
        setIsCodeSent(true)
        setCountdown(60)
        setMessage({ type: "success", text: t.common.success })
      } else {
        setMessage({ type: "error", text: data.error || t.auth.try_again })
      }
    } catch (error) {
      setMessage({ type: "error", text: t.auth.try_again })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || !newPassword) return

    try {
      setLoading(true)
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        body: JSON.stringify({ email, code: otp, password: newPassword }),
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
      } else {
        setMessage({ type: "error", text: data.error || t.auth.try_again })
      }
    } catch (error) {
      setMessage({ type: "error", text: t.auth.try_again })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl shadow-primary/10">
      {success ? (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight">{t.common.success}!</h2>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            {t.settings.security.change_password} {t.common.success.toLowerCase()}
          </p>
          <Link
            href="/signin"
            className="w-full h-[52px] flex items-center justify-center bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {t.auth.signin_now}
          </Link>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-tighter mb-2">{t.auth.forgot_password}</h1>
            <p className="text-muted-foreground text-sm">
              {!isCodeSent
                ? t.common.enter_otp
                : t.settings.security.new_password
              }
            </p>
          </div>

          {message && (
            <div className={cn(
              "mb-6 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-center flex items-center justify-center",
              message.type === "success" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            )}>
              {message.text}
            </div>
          )}

          {!isCodeSent ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t.settings.profile.email_address}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-foreground"
                    placeholder={t.auth.email_placeholder}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full h-[52px] flex items-center justify-center space-x-2 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none mt-6"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>{t.common.send_otp}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex justify-center">{t.common.enter_otp}</label>
                <div className="relative group">
                  <div className="flex justify-center">
                    <div className="flex justify-between gap-2 w-full max-w-[320px]">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-full aspect-square flex items-center justify-center border-2 rounded-xl text-xl font-bold transition-all duration-300",
                            otp.length === i
                              ? "border-accent bg-accent/5 ring-4 ring-accent/10 scale-105 shadow-xl shadow-accent/10"
                              : otp[i]
                                ? "border-accent/40 bg-accent/[0.02] text-accent"
                                : "border-border bg-secondary/30"
                          )}
                        >
                          {otp[i] || ""}
                          {otp.length === i && (
                            <motion.div
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-0.5 h-[40%] bg-accent rounded-full"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-foreground"
                    placeholder={t.settings.security.new_password}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6 || !newPassword}
                  className="w-full h-[52px] flex items-center justify-center space-x-2 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <span>{t.settings.security.change_password}</span>
                      <CheckCircle2 className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCodeSent(false)}
                  className="w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex items-center justify-center opacity-70"
                >
                  <ArrowLeft className="w-3 h-3 mr-2" /> {t.common.back_home}
                </button>
              </div>
            </form>
          )}

          {!isCodeSent && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              {t.auth.has_account}{" "}
              <Link href="/signin" className="font-bold text-primary hover:text-accent transition-colors">
                {t.auth.signin_now}
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  )
}
