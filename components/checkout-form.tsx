"use client"

import { useCart } from "@/hooks/use-cart"
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Check } from "lucide-react"
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
  const { items, count, total, updateQuantity, removeFromCart, clearCart } = useCart()
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
  const [paymentMethod, setPaymentMethod] = useState<"iban" | "twint" | "cash" | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [checkingPromo, setCheckingPromo] = useState(false)

  const discount = appliedPromo 
    ? appliedPromo.discount_type === "percentage"
      ? (total * appliedPromo.discount_value) / 100
      : appliedPromo.discount_value
    : 0

  const finalTotal = Math.max(0, total - discount)
  const canUseCash = appliedPromo?.code === "FRIENDS123"

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
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .single()

      if (error || !data) {
        toast.error("Invalid promo code")
        setAppliedPromo(null)
        return
      }

      setAppliedPromo(data)
      toast.success(`Promo code applied: ${data.discount_type === "percentage" ? `${data.discount_value}%` : `CHF ${data.discount_value}`} off`)
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
    toast.info("Promo code removed")
  }

  const handleNext = () => {
    if (!name || !email || !street || !city || !zip || !canton) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
      clearCart()
      
      // Send confirmation email
      try {
        await fetch('/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'order-confirmation',
            orderNumber: data.order_number,
            total: finalTotal,
            email: email,
          }),
        })
      } catch (error) {
        console.error('[v0] Failed to send confirmation email:', error)
      }
      
      router.push(`/order-success?id=${data.order_number}`)
    } catch {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${step === "details" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {step === "payment" && <Check className="h-4 w-4" />}
          <span className="text-sm font-medium">1. Shipping Details</span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          <span className="text-sm font-medium">2. Payment Method</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Cart items */}
        <div className="lg:col-span-3">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Cart ({count} {count === 1 ? "item" : "items"})
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {items.map((item, idx) => (
              <div
                key={`${item.id}-${item.color || idx}`}
                className="flex gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="font-semibold text-card-foreground">
                    {item.name}
                    {item.color && <span className="ml-2 text-sm font-normal text-muted-foreground">({item.color})</span>}
                  </h3>
                  <p className="text-sm text-muted-foreground">CHF {Number(item.price).toFixed(2)} each</p>
                  <p className="text-xs text-muted-foreground">
                    Shipping: {item.shipping_time}
                    {item.shipping_cost > 0 ? ` (+CHF ${Number(item.shipping_cost).toFixed(2)})` : " (Free)"}
                  </p>
                  <div className="mt-auto flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(`${item.id}-${item.color || idx}`, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-muted"
                      disabled={step === "payment"}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(`${item.id}-${item.color || idx}`, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-muted"
                      disabled={step === "payment"}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeFromCart(`${item.id}-${item.color || idx}`)}
                      className="ml-auto text-destructive transition-colors hover:text-destructive/80"
                      disabled={step === "payment"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right font-semibold text-card-foreground">
                  CHF {(Number(item.price) * item.quantity + Number(item.shipping_cost)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Promo Code */}
          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <label className="block text-sm font-medium text-card-foreground mb-2">Promo Code</label>
            {appliedPromo ? (
              <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3">
                <div>
                  <p className="font-mono font-semibold text-primary">{appliedPromo.code}</p>
                  <p className="text-sm text-muted-foreground">
                    {appliedPromo.discount_type === "percentage"
                      ? `${appliedPromo.discount_value}% discount`
                      : `CHF ${appliedPromo.discount_value.toFixed(2)} discount`}
                  </p>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-sm font-medium text-destructive hover:text-destructive/80"
                  disabled={step === "payment"}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={step === "payment"}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={checkingPromo || !promoCode.trim() || step === "payment"}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {checkingPromo ? "Checking..." : "Apply"}
                </button>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="mt-4 rounded-lg bg-muted px-4 py-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">CHF {total.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-primary">-CHF {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="font-heading text-lg font-bold text-foreground">Total</span>
              <span className="font-heading text-xl font-bold text-primary">CHF {finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
            {step === "details" ? (
              <>
                <h2 className="font-heading text-base font-semibold text-card-foreground sm:text-lg">Shipping Details</h2>
                <p className="mt-1 text-xs text-muted-foreground">Shipping to Switzerland only</p>
                <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:gap-4">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-card-foreground">Full Name</label>
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
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-card-foreground">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="max@example.com"
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-card-foreground">
                      Phone Number <span className="text-xs text-muted-foreground">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+41 XX XXX XX XX"
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="street" className="mb-1.5 block text-sm font-medium text-card-foreground">Street Address</label>
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
                      <label htmlFor="zip" className="mb-1.5 block text-sm font-medium text-card-foreground">ZIP Code</label>
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
                      <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-card-foreground">City</label>
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
                    <label htmlFor="canton" className="mb-1.5 block text-sm font-medium text-card-foreground">Canton</label>
                    <select
                      id="canton"
                      required
                      value={canton}
                      onChange={(e) => setCanton(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select canton</option>
                      {SWISS_CANTONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleNext}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-heading text-base font-semibold text-card-foreground sm:text-lg">Payment Method</h2>
                <p className="mt-1 text-xs text-muted-foreground">Choose how you want to pay</p>
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
                      <p className="font-medium text-card-foreground">Bank Transfer (IBAN)</p>
                      <p className="text-xs text-muted-foreground">Pay via bank transfer</p>
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
                      <p className="font-medium text-card-foreground">TWINT</p>
                      <p className="text-xs text-muted-foreground">Pay with TWINT mobile app</p>
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
                        <p className="font-medium text-card-foreground">Cash Payment</p>
                        <p className="text-xs text-muted-foreground">Pay in cash on delivery</p>
                        <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Available with FRIENDS123
                        </span>
                      </div>
                    </label>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setStep("details")}
                    className="flex-1 rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !paymentMethod}
                    className="flex-1 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Processing..." : "Place Order"}
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
