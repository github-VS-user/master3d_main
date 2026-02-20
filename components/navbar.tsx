"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X, Languages } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useLanguage } from "@/lib/language-context"
import { useState } from "react"

export function Navbar() {
  const { count } = useCart()
  const { language, setLanguage, t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en")
  }

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
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            {t("nav.home")}
          </Link>
          <Link href="/catalog" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            {t("nav.catalog")}
          </Link>
          <Link href="/my-orders" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            {t("nav.myOrders")}
          </Link>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            title={language === "en" ? "Switch to French" : "Passer à l'anglais"}
          >
            <Languages className="h-4 w-4" />
            <span className="uppercase">{language}</span>
          </button>
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
              {t("nav.home")}
            </Link>
            <Link
              href="/catalog"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {t("nav.catalog")}
            </Link>
            <Link
              href="/my-orders"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {t("nav.myOrders")}
            </Link>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Languages className="h-4 w-4" />
              <span>{language === "en" ? "English" : "Français"}</span>
              <span className="ml-auto text-xs text-muted-foreground">→ {language === "en" ? "FR" : "EN"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
