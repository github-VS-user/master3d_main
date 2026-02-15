"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Package, ShoppingBag, LogOut, LayoutDashboard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
]

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  console.log("[v0] AdminSidebar rendering - logo path: /images/master3d_logo.jpg")

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      {/* Logo Header */}
      <div className="relative border-b border-border bg-gradient-to-br from-primary/5 to-transparent px-5 py-6">
        <div className="flex flex-col items-center gap-3">
          <div className="relative overflow-hidden rounded-lg shadow-md">
            <Image
              src="/images/master3d_logo.jpg"
              alt="Master 3D"
              width={120}
              height={48}
              className="h-auto w-28 rounded-lg"
              priority
            />
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span className="text-xs font-semibold text-primary">Admin Panel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1.5 px-4 py-5">
        <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Management
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive && "text-primary-foreground")} />
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary-foreground/20" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-border bg-muted/30 px-4 py-4">
        <div className="mb-3 rounded-lg bg-card px-3 py-2 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Logged in as</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
