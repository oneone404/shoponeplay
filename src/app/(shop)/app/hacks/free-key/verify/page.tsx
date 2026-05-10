"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ShieldCheck, Loader2, Key, Copy, Check, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useUI } from "@/providers/UIProvider"
import Navbar from "@/components/layouts/Navbar"

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Đang Xác Thực Và Lấy Key Free Cho Bạn...")
  const [key, setKey] = useState("")
  const [logo, setLogo] = useState("")
  const [copied, setCopied] = useState(false)
  const { addMessage } = useUI()
  const router = useRouter()

  useEffect(() => {
    // Fetch site config for logo
    fetch("/api/config?keys=siteLogo")
      .then(res => res.json())
      .then(data => setLogo(data.siteLogo || ""))
      .catch(() => { })

    if (!token) {
      setStatus("error")
      setMessage("Mã xác thực không hợp lệ hoặc đã hết hạn.")
      return
    }

    const claimKey = async () => {
      try {
        const res = await fetch("/api/hacks/free-key/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        })

        const data = await res.json()

        if (res.ok) {
          setKey(data.key)
          setStatus("success")
          setMessage(data.message || "Nhận key thành công!")
        } else {
          setStatus("error")
          setMessage(data.error || "Đã có lỗi xảy ra.")
          if (data.isTooFast) {
            addMessage({ type: "warning", text: `Vui lòng chờ thêm ${data.remaining} giây.` })
          }
        }
      } catch (err) {
        setStatus("error")
        setMessage("Lỗi kết nối máy chủ.")
      }
    }

    claimKey()
  }, [token, addMessage])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(key)
    setCopied(true)
    addMessage({ type: "success", text: "Đã sao chép mã key!" })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar logoUrl={logo} />

      <div className="min-h-[80vh] flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md bg-card border-2 border-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group">
          <div className="p-8 text-center space-y-6">
            {status === "loading" && (
              <>
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-xl font-bold uppercase tracking-tight">Đang Xử Lý</h1>
                  <p className="text-sm text-muted-foreground">{message}</p>
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-xl font-bold uppercase tracking-tight">Thành Công!</h1>
                  <p className="text-sm text-muted-foreground">Key Free Của Bạn Là</p>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex items-center gap-3 p-4 bg-background border-2 border-border rounded-2xl">
                    <Key className="w-5 h-5 text-primary" />
                    <code className="flex-1 text-sm font-black text-foreground font-mono tracking-wider">{key}</code>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-secondary hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/hacks"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Quay lại danh sách hack
                  </Link>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10 text-destructive" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-xl font-bold uppercase tracking-tight text-destructive">Thất Bại</h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                  >
                    Thử lại ngay
                  </button>
                  <Link
                    href="/hacks"
                    className="w-full py-4 bg-secondary text-foreground rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-border transition-all"
                  >
                    Quay lại
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FreeKeyVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
