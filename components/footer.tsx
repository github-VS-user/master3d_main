"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-foreground text-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 md:flex-row md:justify-between lg:px-8">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <Image
            src="/images/master3d_logo.jpg"
            alt="Master 3D"
            width={100}
            height={40}
            className="h-10 w-auto rounded"
          />
          <span className="text-sm text-card/60">{t("footer.tagline")}</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-card/60">
          <Link href="/" className="transition-colors hover:text-card">{t("nav.home")}</Link>
          <Link href="/catalog" className="transition-colors hover:text-card">{t("nav.catalog")}</Link>
          <a href="https://track.master3d.net" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-card">{t("footer.trackOrder")}</a>
        </div>
        <p className="text-xs text-card/40">
          {new Date().getFullYear()} Master 3D. {t("footer.rights")}
        </p>
      </div>
    </footer>
  )
}
