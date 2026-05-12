"use client"

import React from "react"
import PageHeader from "./PageHeader"

interface UserPageHeaderProps {
  title: string
  highlightTitle?: string
  subtitle?: string
  showBackButton?: boolean
  className?: string
  children?: React.ReactNode
}

export default function UserPageHeader({
  title,
  highlightTitle,
  subtitle,
  showBackButton,
  className,
  children
}: UserPageHeaderProps) {
  return (
    <div className="relative pt-20 pb-6 overflow-hidden border-b border-border bg-card/30">
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <PageHeader
          title={title}
          highlightTitle={highlightTitle}
          subtitle={subtitle || ""}
          showBackButton={showBackButton}
          centered={true}
          className={className || "mb-0 px-0 max-w-none"}
        >
          {children}
        </PageHeader>
      </div>
    </div>
  )
}
