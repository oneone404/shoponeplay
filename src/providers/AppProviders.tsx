"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "./ThemeProvider"
import { UIProvider } from "./UIProvider"
import { CartProvider } from "./CartProvider"
import { LanguageProvider } from "./LanguageProvider"
import ToastContainer from "@/components/utils/ToastContainer"
import DepositModal from "@/components/modals/DepositModal"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          <UIProvider>
            <CartProvider>
              {children}
              <ToastContainer />
              <DepositModal />
            </CartProvider>
          </UIProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
