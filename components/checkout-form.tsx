"use client"

import { useCart } from "@/hooks/use-cart"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const SWISS_CANTONS = [
  "Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft",
  "Basel-Stadt", "Bern", "Fribourg", "Geneva", "Glarus", "Graubunden",
  "Jura", "Lucerne", "Neuchatel", "Nidwalden", "Obwalden", "Schaffhausen",
  "Schwyz", "Solothurn", "St. Gallen", "Thurgau", "Ticino", "Uri",
  "Valais", "Vaud", "Zug", "Zurich",
]

export function CheckoutForm() {
  const { items, count, total, updateQuantity, removeFromCart, clearCart } = useCart()
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")
  const [canton, setCanton] = useState("")
  const [submitting, setSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !street || !city || !zip || !canton) {
      toast.error("Please fill in all required fields")
      return
    }
    // Validate phone if provided
    if (phone && !/^\+41\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(phone.replace(/\s/g, "").replace(/^\+41/, "+41"))) {
      if (!/^\+41/.test(phone)) {
        toast.error("Phone number must start with +41 (Swiss number)")
        return
      }
    }

    setSubmitting(true)
    try {
      const address = `${street}, ${zip} ${city}, ${canton}, Switzerland`
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          customer_address: address,
          items: items.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            shipping_time: item.shipping_time,
          })),
          total,
        }),
      })

      if (!res.ok) throw new Error("Order submission failed")

      const data = await res.json()
      clearCart()
      toast.success(`Order #${data.order_number} placed successfully!`)
      // Redirect to My Orders with order number pre-filled
      router.push(`/my-orders?order=${data.order_number}`)
    } catch {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-5">
      {/* Cart items */}
      <div className="lg:col-span-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {"Cart ("}
          {count}
          {count === 1 ? " item)" : " items)"}
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
                <p className="text-sm text-muted-foreground">
                  {"CHF "}
                  {Number(item.price).toFixed(2)}
                  {" each"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {"Shipping: "}
                  {item.shipping_time}
                  {item.shipping_cost > 0 ? ` (+CHF ${Number(item.shipping_cost).toFixed(2)})` : " (Free)"}
                </p>
                <div className="mt-auto flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(`${item.id}-${item.color || idx}`, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-muted"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(`${item.id}-${item.color || idx}`, item.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-muted"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => removeFromCart(`${item.id}-${item.color || idx}`)}
                    className="ml-auto text-destructive transition-colors hover:text-destructive/80"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold text-card-foreground">
                {"CHF "}
                {(Number(item.price) * item.quantity + Number(item.shipping_cost)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-muted px-4 py-3">
          <span className="font-heading text-lg font-bold text-foreground">Total</span>
          <span className="font-heading text-xl font-bold text-primary">
            {"CHF "}
            {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Order form */}
      <div className="lg:col-span-2">
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <h2 className="font-heading text-base font-semibold text-card-foreground sm:text-lg">Shipping Details</h2>
          <p className="mt-1 text-xs text-muted-foreground">Shipping to Switzerland only</p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:mt-5 sm:gap-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-card-foreground">
                Full Name
              </label>
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
              <p className="mt-1 text-xs text-muted-foreground">Recommended for order tracking and updates</p>
            </div>
            <div>
              <label htmlFor="street" className="mb-1.5 block text-sm font-medium text-card-foreground">
                Street Address
              </label>
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
                <label htmlFor="zip" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  ZIP Code
                </label>
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
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  City
                </label>
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
              <label htmlFor="canton" className="mb-1.5 block text-sm font-medium text-card-foreground">
                Canton
              </label>
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
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Placing Order...</span>
                </>
              ) : (
                `Buy - CHF ${total.toFixed(2)}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
