"use client"

import { useState, useEffect } from "react"
import { X, Check, Copy, CreditCard, QrCode, ArrowRight, Loader2, Wallet, History } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useLanguage } from "@/providers/LanguageProvider"

const QUICK_AMOUNTS = [10000, 50000, 100000, 200000, 500000, 1000000]

export default function DepositModal() {
  const { depositOpen, setDepositOpen, addMessage } = useUI()
  const { data: session } = useSession()
  const { t } = useLanguage()
  const [amount, setAmount] = useState<number>(0)
  const [selectedBank, setSelectedBank] = useState<any>(null)
  const [banks, setBanks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1) // 1: Amount, 2: Bank & QR

  // Fetch banks from API (we will create this)
  useEffect(() => {
    if (depositOpen) {
      const fetchBanks = async () => {
        try {
          const res = await fetch("/api/user/bank-info")
          const data = await res.json()
          setBanks(data)
          if (data.length > 0) setSelectedBank(data[0])
        } catch (error) {
          console.error("Failed to fetch banks", error)
        } finally {
          setLoading(false)
        }
      }
      fetchBanks()
    } else {
      // Reset state when closing after animation ends
      const timer = setTimeout(() => {
        setStep(1)
        setAmount(0)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [depositOpen])

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    addMessage({ type: "success", text: t.common.copy_success_label.replace("{label}", label) })
  }

  const transferSyntax = session?.user?.name
    ? `NAP ${session.user.name.split(' ')[0].toUpperCase()}${session.user.id.slice(-4).toUpperCase()}`
    : "NAP ONEPLAY"

  const qrUrl = selectedBank ? `https://qr.sepay.vn/img?acc=${selectedBank.accountNumber}&bank=${selectedBank.bankName}&amount=${amount}&des=${encodeURIComponent(transferSyntax)}` : ""

  return (
    <div className={cn(
      "fixed inset-0 z-[100] transition-transform duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] bg-background will-change-transform",
      depositOpen ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"
    )}>
      {/* Container (Full Screen) */}
      <div className="flex flex-col h-full w-full overflow-y-auto no-scrollbar">
        <div className="px-4 py-6 border-b border-border bg-secondary/30">
          <div className="max-w-xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">{t.deposit.title}</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-70">{t.deposit.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setDepositOpen(false)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="max-w-xl mx-auto w-full px-4 py-6 md:px-6 md:py-8">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{t.deposit.amount_label}</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <input
                      type="number"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder={t.deposit.amount_placeholder}
                      className="relative w-full bg-secondary/50 border border-border rounded-2xl px-6 py-4 text-lg font-bold text-foreground outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-muted-foreground opacity-50">VND</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {QUICK_AMOUNTS.map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={cn(
                        "py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all border",
                        amount === val
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                          : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/30"
                      )}
                    >
                      {new Intl.NumberFormat('vi-VN').format(val)}
                    </button>
                  ))}
                </div>

                <button
                  disabled={amount < 10000}
                  onClick={() => setStep(2)}
                  className="w-full h-14 bg-foreground text-background rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-foreground/5"
                >
                  <span>{t.common.continue}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : step === 2 ? (
              <div className="space-y-6">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-xs font-bold uppercase tracking-widest opacity-50">{t.deposit.loading_banks}</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-secondary/30 rounded-3xl p-6 border border-border space-y-6">
                      {/* Bank Header Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {selectedBank?.logo ? (
                            <div className="w-12 h-12 bg-white rounded-xl p-1.5 flex items-center justify-center border border-border shadow-sm flex-shrink-0">
                              <img src={selectedBank.logo} alt={selectedBank.bankName} className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                              <CreditCard className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-0.5">{t.deposit.beneficiary_bank}</p>
                            <h3 className="text-lg font-bold text-foreground tracking-tight truncate">{selectedBank?.bankName}</h3>
                          </div>
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          className="flex-shrink-0 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors"
                        >
                          {t.deposit.edit_amount}
                        </button>
                      </div>

                      {/* Bank Switcher */}
                      {banks.length > 1 && (
                        <div className="flex items-center justify-between p-2.5 bg-background/50 rounded-xl border border-border/50">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{t.deposit.select_other_bank}</span>
                          <div className="flex items-center space-x-1.5">
                            {banks.map((b) => (
                              <button
                                key={b.id}
                                onClick={() => setSelectedBank(b)}
                                className={cn(
                                  "w-6 h-6 rounded-lg border flex items-center justify-center p-1 transition-all bg-white",
                                  selectedBank?.id === b.id ? "border-primary ring-2 ring-primary/20" : "border-border opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                                )}
                              >
                                <img src={b.logo} alt={b.bankName} className="w-full h-full object-contain" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Transaction Details */}
                      <div className="space-y-5 pt-2">
                        <InfoItem label={t.deposit.account_number} value={selectedBank?.accountNumber} onCopy={() => handleCopy(selectedBank?.accountNumber, t.deposit.account_number.toLowerCase())} />
                        <InfoItem label={t.deposit.account_name} value={selectedBank?.accountName} />
                        <InfoItem label={t.deposit.amount} value={`${new Intl.NumberFormat('vi-VN').format(amount)} VND`} highlight />
                        <InfoItem label={t.deposit.syntax} value={transferSyntax} onCopy={() => handleCopy(transferSyntax, t.deposit.syntax.toLowerCase())} highlight />
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-[32px] border border-border shadow-inner relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />

                      {/* Decorative Border Corners */}
                      <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-primary/10 rounded-tl-lg" />
                      <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-primary/10 rounded-tr-lg" />
                      <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-primary/10 rounded-bl-lg" />
                      <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-primary/10 rounded-br-lg" />

                      <div className="relative w-48 h-48 md:w-56 md:h-56 p-3 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-10 overflow-hidden border border-primary/5">
                        <Image
                          src={qrUrl}
                          alt="QR Code"
                          fill
                          className="object-contain p-2 rounded-2xl"
                        />
                        {/* Scanning Line Animation */}
                        <div className="absolute inset-x-4 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-[scan_3s_linear_infinite] opacity-30 z-20 pointer-events-none" />
                      </div>

                      <div className="mt-6 flex items-center space-x-2 px-5 py-2.5 bg-primary/5 rounded-full z-10 border border-primary/10">
                        <QrCode className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary">{t.deposit.scan_to_pay}</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-center text-muted-foreground uppercase font-bold tracking-widest leading-relaxed px-6 opacity-40">
                      {t.deposit.warning_syntax.split("*")[1] ? (
                        <>*<span className="text-foreground">{t.deposit.warning_syntax.split("*")[1]}</span></>
                      ) : t.deposit.warning_syntax}
                    </p>

                    <button
                      onClick={() => setStep(3)}
                      className="w-full h-14 bg-foreground text-background rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-foreground/10"
                    >
                      <span>{t.deposit.i_have_transferred}</span>
                      <Check className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in zoom-in duration-700">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center border-2 border-primary/10">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold tracking-tight uppercase">{t.deposit.processing_title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[280px] mx-auto font-bold uppercase tracking-widest opacity-40">
                    {t.deposit.processing_desc}
                  </p>
                </div>

                <div className="w-full max-w-xs p-5 bg-secondary/30 rounded-3xl border border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{t.deposit.estimated_time}</span>
                    <span className="text-xs font-bold text-primary uppercase">≈ 1 - 3 PHÚT</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-[loading_10s_ease-in-out_infinite]" style={{ width: '40%' }} />
                  </div>
                </div>

                <button
                  onClick={() => setDepositOpen(false)}
                  className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl text-[9px] font-bold uppercase tracking-widest text-foreground transition-all active:scale-95"
                >
                  {t.common.back_home}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value, onCopy, highlight }: { label: string, value: string, onCopy?: () => void, highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between group h-6">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{label}</span>
      <div className="flex items-center space-x-2 min-w-0">
        <span className={cn(
          "text-sm font-bold tracking-tight leading-none truncate",
          highlight ? "text-accent" : "text-foreground"
        )}>
          {value}
        </span>
        {onCopy && (
          <button
            onClick={onCopy}
            className="flex-shrink-0 p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-all opacity-40 hover:opacity-100 -mr-1.5 active:scale-90"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}
