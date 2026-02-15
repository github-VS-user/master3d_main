"use client"

import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { Menu } from "lucide-react"
import Image from "next/image"

export function AdminLayoutClient({
  userEmail,
  children,
}: {
  userEmail: string
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <AdminSidebar 
        userEmail={userEmail} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <main className="flex-1 overflow-auto bg-muted">
        {/* Mobile header with hamburger */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src="/images/master3d_logo.jpg"
              alt="Master 3D"
              width={80}
              height={32}
              className="h-7 w-auto rounded"
            />
            <span className="text-xs font-semibold text-primary">Admin</span>
          </div>
        </div>
        
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  )
}
