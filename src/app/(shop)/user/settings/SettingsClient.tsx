"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/layouts/Navbar"
import { useSession } from "next-auth/react"
import { useUI } from "@/providers/UIProvider"

// Tab Components
import Sidebar from "@/components/user/settings/Sidebar"
import ProfileTab from "@/components/user/settings/ProfileTab"
import GeneralTab from "@/components/user/settings/GeneralTab"
import SecurityTab from "@/components/user/settings/SecurityTab"
import BillingTab from "@/components/user/settings/BillingTab"

export default function SettingsClient() {
  const { data: session, update } = useSession()
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />

      <div className="pt-24 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content Area */}
          <div className="lg:col-span-8 relative">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-[32px] p-6 md:p-10 shadow-sm min-h-[600px]"
            >
              {activeTab === "profile" && (
                <ProfileTab 
                  session={session} 
                  update={update} 
                />
              )}
              {activeTab === "settings" && <GeneralTab />}
              {activeTab === "security" && (
                <SecurityTab 
                  session={session} 
                  update={update} 
                />
              )}
              {activeTab === "billing" && <BillingTab session={session} />}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
