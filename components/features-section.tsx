"use client"

import { Printer, Zap, ShieldCheck } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Printer,
      title: t("features.precisionTitle"),
      description: t("features.precisionDesc"),
    },
    {
      icon: Zap,
      title: t("features.fastTitle"),
      description: t("features.fastDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("features.qualityTitle"),
      description: t("features.qualityDesc"),
    },
  ]

  return (
    <section className="border-b border-border bg-muted">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:gap-8 sm:py-12 lg:px-8">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">{feature.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
