"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-foreground text-card">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Image
              src="/images/master3d_logo.jpg"
              alt="Master 3D"
              width={100}
              height={40}
              className="h-10 w-auto rounded"
            />
            <span className="text-sm text-card/60">{t("footer.tagline")}</span>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-card">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm text-card/60">
              <li><Link href="/" className="transition-colors hover:text-card">{t("nav.home")}</Link></li>
              <li><Link href="/catalog" className="transition-colors hover:text-card">{t("nav.catalog")}</Link></li>
              <li><Link href="/my-orders" className="transition-colors hover:text-card">{t("nav.myOrders")}</Link></li>
              <li><a href="https://track.master3d.net" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-card">{t("footer.trackOrder")}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-card">{t("footer.legal")}</h3>
            <ul className="space-y-2 text-sm text-card/60">
              <li><Link href="/terms" className="transition-colors hover:text-card">{t("footer.terms")}</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-card">{t("footer.privacy")}</Link></li>
              <li><Link href="/return-policy" className="transition-colors hover:text-card">{t("footer.returnPolicy")}</Link></li>
              <li><Link href="/shipping-policy" className="transition-colors hover:text-card">{t("footer.shippingPolicy")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-card">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-sm text-card/60">
              <li>Master 3D</li>
              <li>Geneva, Switzerland</li>
              <li>
                <a href="tel:+41782514768" className="transition-colors hover:text-card">
                  contact.master3d@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-card/10 pt-6 text-center text-xs text-card/40">
          {new Date().getFullYear()} Master 3D. {t("footer.rights")}
        </div>
      </div>
    </footer>
  )
}
