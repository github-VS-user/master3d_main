"use client"

import { useCart } from "@/hooks/use-cart"
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Check, Loader2, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

const SWISS_CANTONS = [
  "Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft",
  "Basel-Stadt", "Bern", "Fribourg", "Geneva", "Glarus", "Graubunden",
  "Jura", "Lucerne", "Neuchatel", "Nidwalden", "Obwalden", "Schaffhausen",
  "Schwyz", "Solothurn", "St. Gallen", "Thurgau", "Ticino", "Uri",
  "Valais", "Vaud", "Zug", "Zurich",
]

interface PromoCode {
  code: string
  discount_type: "percentage" | "fixed"
  discount_value: number
}

export function CheckoutForm() {
  const { items, count, total, subtotal, shipping, shippingBreakdown, updateQuantity, removeFromCart, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<"details" | "payment">("details")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")
  const [canton, setCanton] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [secondPromoCode, setSecondPromoCode] = useState("")
  const [appliedSecondPromo, setAppliedSecondPromo] = useState<PromoCode | null>(null)
  const [checkingSecondPromo, setCheckingSecondPromo] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"iban" | "twint" | "cash" | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [checkingPromo, setCheckingPromo] = useState(false)

  const discount = (() => {
    let d = 0
    if (appliedPromo) {
      d += appliedPromo.discount_type === "percentage"
        ? (total * appliedPromo.discount_value) / 100
        : appliedPromo.discount_value
    }
    if (appliedSecondPromo) {
      d += appliedSecondPromo.discount_type === "percentage"
        ? (total * appliedSecondPromo.discount_value) / 100
        : appliedSecondPromo.discount_value
    }
    return d
  })()

  const finalTotal = Math.max(0, total - discount)
  const canUseCash = appliedPromo?.code?.toUpperCase() === "FRIENDS123"
  const { hasFreeShipping, hasGroupedDiscount, groupedCount, groupedSaving } = shippingBreakdown

  if (count === 0) {
    return (
      <div className="mt-12 flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some products from our catalog to get started.</p>
        <Link
          href="/catalog"
          className="mt-2 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Catalog
        </Link>
      </div>
    )
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    setCheckingPromo(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*, promo_code_uses(id, device_fingerprint, ip_address, customer_name)")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .single()

      if (error || !data) {
        toast.error("Invalid or inactive promo code")
        setAppliedPromo(null)
        return
      }

      // Check global usage limit
      if (data.max_uses !== null && data.use_count >= data.max_uses) {
        toast.error("This promo code has reached its usage limit")
        setAppliedPromo(null)
        return
      }

      // Check per-user limit using device fingerprint (canvas + screen + timezone)
      if (data.max_uses_per_user !== null) {
        const fp = [
          navigator.userAgent,
          screen.width,
          screen.height,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        ].join("|")
        const fingerprint = btoa(fp).slice(0, 64)

        const uses = (data.promo_code_uses || []) as Array<{ device_fingerprint: string; customer_name: string }>
        const userUses = uses.filter(
          (u) => u.device_fingerprint === fingerprint || (name && u.customer_name === name)
        ).length

        if (userUses >= data.max_uses_per_user) {
          toast.error("You have already used this promo code the maximum number of times")
          setAppliedPromo(null)
          return
        }
      }

      setAppliedPromo(data)
      toast.success(
        `Promo code applied: ${data.discount_type === "percentage" ? `${data.discount_value}% off` : `CHF ${data.discount_value} off`}`
      )
    } catch {
      toast.error("Failed to validate promo code")
      setAppliedPromo(null)
    } finally {
      setCheckingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoCode("")
    setAppliedSecondPromo(null)
    setSecondPromoCode("")
    if (paymentMethod === "cash") setPaymentMethod(null)
    toast.info("Promo code removed")
  }

  const handleApplySecondPromo = async () => {
    if (!secondPromoCode.trim()) return
    setCheckingSecondPromo(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", secondPromoCode.toUpperCase())
        .eq("is_active", true)
        .single()

      if (error || !data) {
        toast.error("Invalid or inactive promo code")
        return
      }
      if (data.code.toUpperCase() === "FRIENDS123") {
        toast.error("Cannot apply FRIENDS123 as a second code")
        return
      }
      if (appliedPromo && data.code === appliedPromo.code) {
        toast.error("This code is already applied")
        return
      }
      if (data.max_uses !== null && data.use_count >= data.max_uses) {
        toast.error("This promo code has reached its usage limit")
        return
      }
      setAppliedSecondPromo(data as PromoCode)
      setSecondPromoCode("")
      toast.success(`Second promo "${data.code}" applied!`)
    } catch {
      toast.error("Failed to apply promo code")
    } finally {
      setCheckingSecondPromo(false)
    }
  }

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const isLargeOrder = totalItemCount >= 10

  const handleNext = () => {
    const phoneRequired = isLargeOrder && !phone.trim()
    if (!name || !street || !city || !zip || !canton || phoneRequired) {
      if (phoneRequired) {
        toast.error("Phone number is required for orders of 10 or more items")
      } else {
        toast.error("Please fill in all required fields")
      }
      return
    }

    // Validate email only if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    // Validate phone if provided
    if (phone && !/^\+41\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(phone.replace(/\s/g, ""))) {
      if (!/^\+41/.test(phone)) {
        toast.error("Phone number must start with +41 (Swiss number)")
        return
      }
    }

    setStep("payment")
  }

  const handleSubmit = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method")
      return
    }

    setSubmitting(true)
    try {
      const address = `${street}, ${zip} ${city}, ${canton}, Switzerland`
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          customer_address: address,
          payment_method: paymentMethod,
          promo_code: appliedPromo?.code || null,
          discount_amount: discount,
          items: items.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            color: item.color || null,
            shipping_time: item.shipping_time,
          })),
          total: finalTotal,
        }),
      })

      if (!res.ok) throw new Error("Order submission failed")

      const data = await res.json()
      
      // Save customer phone for easy order tracking
      if (typeof window !== 'undefined' && phone) {
        localStorage.setItem('master3d_customer_phone', phone)
      }

      // Record promo code usage for abuse prevention
      if (appliedPromo) {
        try {
          const supabase = createClient()
          const fp = [
            navigator.userAgent,
            screen.width,
            screen.height,
            Intl.DateTimeFormat().resolvedOptions().timeZone,
          ].join("|")
          const fingerprint = btoa(fp).slice(0, 64)

          await supabase.from("promo_code_uses").insert({
            promo_code_id: appliedPromo.id,
            device_fingerprint: fingerprint,
            customer_name: name,
          })

          // Increment use_count
          await supabase.rpc("increment_promo_use_count", { promo_id: appliedPromo.id })
        } catch (err) {
          console.error("[v0] Failed to record promo usage:", err)
        }
      }
      
      clearCart()
      
      // Send confirmation email to customer if email provided
      if (email) {
        try {
          await fetch('/api/confirm-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: email,
              customer_name: name,
              order_number: data.order_number,
              order_id: data.order_id,
              total: finalTotal,
              payment_method: paymentMethod,
              items,
            }),
          })
        } catch (err) {
          console.error('[v0] Failed to send confirmation email:', err)
        }
      }
      
      router.push(`/order-success?id=${data.order_number}&payment=${paymentMethod}`)
    } catch {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:gap-2 sm:px-4 sm:py-2 ${step === "details" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {step === "payment" && <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          <span className="text-xs font-medium sm:text-sm">1. Details</span>
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:gap-2 sm:px-4 sm:py-2 ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          <span className="text-xs font-medium sm:text-sm">2. Payment</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Cart items */}
        <div className="lg:col-span-3">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {t("checkout.cart")} ({count} {count === 1 ? t("checkout.item") : t("checkout.items")})
          </h2>
          <p className="mt-1 flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <span className="mt-0.5 shrink-0">&#9432;</span>
            <span>{t("checkout.colourNote")}</span>
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {items.map((item, idx) => {
              const isCheapShipping = Number(item.shipping_cost) === 1
              return (
                <div
                  key={`${item.id}-${item.color || idx}`}
                  className="flex gap-3 rounded-lg border border-border bg-card p-3 sm:gap-4 sm:p-4"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted sm:h-20 sm:w-20">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-card-foreground leading-tight">
                        {item.name}
                        {item.color && <span className="ml-1 font-normal text-muted-foreground">({item.color})</span>}
                      </h3>
                      <p className="shrink-0 text-base font-bold text-card-foreground">
                        CHF {(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      CHF {Number(item.price).toFixed(2)} each
                      {isCheapShipping && hasGroupedDiscount
                        ? <span className="ml-1 text-green-600 font-medium">• shipping grouped</span>
                        : item.shipping_cost > 0
                          ? <span> • +CHF {Number(item.shipping_cost).toFixed(2)} ship</span>
                          : <span> • free shipping</span>
                      }
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(`${item.id}-${item.color || idx}`, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                        disabled={step === "payment"}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(`${item.id}-${item.color || idx}`, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                        disabled={step === "payment"}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(`${item.id}-${item.color || idx}`)}
                        className="ml-auto text-destructive/70 transition-colors hover:text-destructive disabled:opacity-40"
                        disabled={step === "payment"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Promo Code */}
          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <label className="block text-sm font-medium text-card-foreground mb-2">{t("checkout.promoCode")}</label>
            {appliedPromo ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3">
                  <div>
                    <p className="font-mono font-semibold text-primary">{appliedPromo.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {appliedPromo.discount_type === "percentage"
                        ? `${appliedPromo.discount_value}% discount`
                        : `CHF ${appliedPromo.discount_value.toFixed(2)} discount`}
                    </p>
                  </div>
                  <button onClick={handleRemovePromo} className="text-sm font-medium text-destructive hover:text-destructive/80" disabled={step === "payment"}>
                    {t("checkout.remove")}
                  </button>
                </div>

                {/* Second promo — only for FRIENDS123 */}
                {canUseCash && (
                  appliedSecondPromo ? (
                    <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-4 py-3">
                      <div>
                        <p className="font-mono font-semibold text-green-700">{appliedSecondPromo.code}</p>
                        <p className="text-sm text-muted-foreground">
                          {appliedSecondPromo.discount_type === "percentage"
                            ? `${appliedSecondPromo.discount_value}% discount`
                            : `CHF ${appliedSecondPromo.discount_value.toFixed(2)} discount`}
                        </p>
                      </div>
                      <button onClick={() => { setAppliedSecondPromo(null); setSecondPromoCode("") }} className="text-sm font-medium text-destructive hover:text-destructive/80" disabled={step === "payment"}>
                        {t("checkout.remove")}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs text-green-700 font-medium">{t("checkout.friendsPerk")}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={secondPromoCode}
                          onChange={(e) => setSecondPromoCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplySecondPromo() } }}
                          placeholder={t("checkout.secondPromoCode")}
                          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                          disabled={step === "payment"}
                          autoComplete="off"
                        />
                        <button onClick={handleApplySecondPromo} disabled={checkingSecondPromo || !secondPromoCode.trim() || step === "payment"} className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                          {checkingSecondPromo ? t("checkout.checking") : t("checkout.apply")}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyPromo() } }}
                  placeholder={t("checkout.enterPromoCode")}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={step === "payment"}
                  autoComplete="off"
                />
                <button onClick={handleApplyPromo} disabled={checkingPromo || !promoCode.trim() || step === "payment"} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                  {checkingPromo ? t("checkout.checking") : t("checkout.apply")}
                </button>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="mt-4 rounded-lg bg-muted px-4 py-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("checkout.products")}</span>
              <span className="font-medium text-foreground">CHF {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("checkout.shipping")}</span>
              {hasFreeShipping ? (
                <span className="font-semibold text-green-600">FREE</span>
              ) : (
                <span className="font-medium text-foreground">CHF {shipping.toFixed(2)}</span>
              )}
            </div>

            {/* Free shipping banner */}
            {hasFreeShipping && (
              <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2">
                <p className="text-xs font-semibold text-green-700">{t("checkout.freeShippingNote")}</p>
              </div>
            )}

            {/* Grouped shipping discount banner */}
            {!hasFreeShipping && hasGroupedDiscount && (
              <div className="rounded-md bg-blue-50 border border-blue-200 px-3 py-2">
                <p className="text-xs font-semibold text-blue-800">
                  Shipping deal applied: {groupedCount} small items share CHF 1 shipping instead of CHF {groupedCount}.00.
                </p>
                <p className="mt-0.5 text-xs text-blue-600">You save CHF {groupedSaving.toFixed(2)} on shipping.</p>
              </div>
            )}

            {discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("checkout.promoDiscount")}</span>
                <span className="font-medium text-primary">-CHF {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="font-heading text-base font-bold text-foreground sm:text-lg">{t("common.total")}</span>
              <span className="font-heading text-lg font-bold text-primary sm:text-xl">CHF {finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4">
            {step === "details" ? (
              <>
                <h2 className="font-heading text-base font-semibold text-card-foreground">{t("checkout.shippingDetails")}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t("checkout.shippingOnly")}</p>
                <div className="mt-4 flex flex-col gap-3">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-card-foreground">{t("checkout.fullName")}</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Max Muster"
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-card-foreground">
                      {t("checkout.emailAddress")}{" "}
                      <span className="text-xs text-muted-foreground">{t("checkout.phoneOptional")}</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="max@example.com"
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {t("checkout.emailHelper")}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-card-foreground">
                      {t("checkout.phoneNumber")}{" "}
                      {isLargeOrder
                        ? <span className="text-xs font-semibold text-destructive">{t("checkout.phoneRequired")}</span>
                        : <span className="text-xs text-muted-foreground">{t("checkout.phoneOptional")}</span>
                      }
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required={isLargeOrder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+41 XX XXX XX XX"
                      className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${isLargeOrder && !phone.trim() ? "border-destructive" : "border-input"}`}
                    />
                    {isLargeOrder && (
                      <p className="mt-1.5 flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-800">
                        <span className="mt-0.5 shrink-0">&#9432;</span>
                        {t("checkout.largeOrderNote")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="street" className="mb-1.5 block text-sm font-medium text-card-foreground">{t("checkout.streetAddress")}</label>
                    <input
                      id="street"
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Bahnhofstrasse 1"
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4">
                    <div>
                      <label htmlFor="zip" className="mb-1.5 block text-sm font-medium text-card-foreground">{t("checkout.zipCode")}</label>
                      <input
                        id="zip"
                        type="text"
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="8001"
                        pattern="[0-9]{4}"
                        maxLength={4}
                        className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-card-foreground">{t("checkout.city")}</label>
                      <input
                        id="city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Zurich"
                        className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="canton" className="mb-1.5 block text-sm font-medium text-card-foreground">{t("checkout.canton")}</label>
                    <select
                      id="canton"
                      required
                      value={canton}
                      onChange={(e) => setCanton(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">{t("checkout.selectCanton")}</option>
                      {SWISS_CANTONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleNext}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {t("checkout.next")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-heading text-base font-semibold text-card-foreground sm:text-lg">{t("checkout.paymentMethod")}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t("checkout.choosePayment")}</p>
                <div className="mt-4 space-y-3">
                  <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${paymentMethod === "iban" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="iban"
                      checked={paymentMethod === "iban"}
                      onChange={(e) => setPaymentMethod(e.target.value as "iban")}
                      className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{t("checkout.bankTransfer")}</p>
                      <p className="text-xs text-muted-foreground">{t("checkout.bankTransferDesc")}</p>
                    </div>
                  </label>

                  <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${paymentMethod === "twint" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="twint"
                      checked={paymentMethod === "twint"}
                      onChange={(e) => setPaymentMethod(e.target.value as "twint")}
                      className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{t("checkout.twint")}</p>
                      <p className="text-xs text-muted-foreground">{t("checkout.twintDesc")}</p>
                    </div>
                  </label>

                  {canUseCash && (
                    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value as "cash")}
                        className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">{t("checkout.cash")}</p>
                        <p className="text-xs text-muted-foreground">{t("checkout.cashDesc")}</p>
                        <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Available with FRIENDS123
                        </span>
                      </div>
                    </label>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => setStep("details")} className="flex-1 rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                    {t("checkout.back")}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !paymentMethod}
                    className="relative flex-1 overflow-hidden rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t("checkout.placeOrder")}...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{t("checkout.placeOrder")}</span>
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
