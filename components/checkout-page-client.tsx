"use client"

import { CheckoutForm } from "@/components/checkout-form"
import { useLanguage } from "@/lib/language-context"

export function CheckoutPageClient() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">{t("checkout.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("checkout.subtitle")}</p>
      <CheckoutForm />
    </div>
  )
}
