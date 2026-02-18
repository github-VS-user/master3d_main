"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useState } from "react"

export function Navbar() {
  const { count } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/master3d_logo.jpg"
            alt="Master 3D logo"
            width={120}
            height={48}
            className="h-10 w-auto rounded"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/catalog" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            Catalog
          </Link>
          <Link href="/my-orders" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            My Orders
          </Link>
          <Link href="/checkout" className="relative flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/checkout" className="relative">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/catalog"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Catalog
            </Link>
            <Link
              href="/my-orders"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              My Orders
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
