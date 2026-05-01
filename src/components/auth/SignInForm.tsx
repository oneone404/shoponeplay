"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react"
import { useLanguage } from "@/providers/LanguageProvider"

export function SignInForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        setError(t.auth.invalid_credentials)
        setLoading(false)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError(t.auth.try_again)
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setGoogleLoading(true)
    signIn("google", { callbackUrl: "/" })
  }

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl shadow-primary/10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tighter mb-2">{t.auth.signin_title}</h1>
        <p className="text-muted-foreground text-sm">{t.auth.welcome_back} <span className="text-accent font-bold">ShopOnePlay.Com</span></p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
              placeholder={t.auth.email_placeholder}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between ml-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.common.password}</label>
            <Link href="/forgot-password" className="text-[10px] uppercase font-bold tracking-widest text-primary hover:text-accent transition-colors">
              {t.auth.forgot_password}
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-foreground"
              placeholder={t.auth.password_placeholder}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[52px] flex items-center justify-center space-x-2 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none mt-6"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              <span>{t.auth.signin_title}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-1 h-px bg-border"></div>
        <span className="px-4 text-xs font-bold text-muted-foreground">{t.common.or}</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center space-x-3 bg-secondary hover:bg-secondary/80 border border-border rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none text-foreground"
      >
        {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        <span>{t.auth.signin_with_google}</span>
      </button>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t.auth.no_account}{" "}
        <Link href="/signup" className="font-bold text-primary hover:text-accent transition-colors">
          {t.auth.signup_now}
        </Link>
      </p>
    </div>
  )
}
