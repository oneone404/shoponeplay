"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User as UserIcon, Loader2, ArrowRight } from "lucide-react"
import { useLanguage } from "@/providers/LanguageProvider"

export function SignUpForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || t.auth.try_again)
        setLoading(false)
      } else {
        router.push("/signin")
      }
    } catch (err) {
      setError(t.auth.try_again)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl shadow-primary/10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tighter mb-2">{t.auth.signup_title}</h1>
        <p className="text-muted-foreground text-sm">{t.auth.welcome_new} <span className="text-accent font-bold">ShopOnePlay.Com</span></p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t.common.username}</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-foreground"
              placeholder={t.auth.name_placeholder}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
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

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t.common.password}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              required
              minLength={6}
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
              <span>{t.auth.signup_now}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t.auth.has_account}{" "}
        <Link href="/signin" className="font-bold text-accent hover:opacity-80 transition-colors">
          {t.auth.signin_title}
        </Link>
      </p>
    </div>
  )
}
