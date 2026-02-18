import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { CheckCircle2, CreditCard, Phone, Building2, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order Confirmed | Master 3D",
  description: "Your order has been placed successfully.",
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const params = await searchParams
  const orderNumber = params.id

  if (!orderNumber) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">Order Not Found</h1>
            <p className="mt-2 text-muted-foreground">No order ID provided.</p>
            <Link href="/" className="mt-4 inline-block text-primary underline">Go home</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Fetch order details
  const supabase = await createClient()
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single()

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order?.id)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
          {/* Success header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground">
              {"Your order number is "}
              <span className="font-bold text-primary">
                {"#"}
                {orderNumber}
              </span>
            </p>
          </div>

          {/* Payment instructions */}
          <div className="mt-10 rounded-lg border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Instructions
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">TWINT</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {"Send payment to: "}
                  <span className="font-mono font-semibold text-foreground">+41 78 251 47 68</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {"Include order number #"}
                  {orderNumber}
                  {" in the payment message/description."}
                </p>
              </div>
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{"IBAN (Min. CHF 10.00)"}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {"Transfer to: "}
                  <span className="font-mono font-semibold text-foreground">CH15 0021 5215 3188 4640 F</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {"Include order number #"}
                  {orderNumber}
                  {" in the payment reference."}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping info */}
          <div className="mt-6 rounded-lg border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Shipping Information
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Orders ship after payment is confirmed. Estimated shipping times for your items:
            </p>
            {orderItems && orderItems.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {orderItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-md bg-muted px-4 py-2 text-sm">
                    <span className="text-foreground">
                      {item.product_name}
                      {" x"}
                      {item.quantity}
                    </span>
                    <span className="font-medium text-primary">{item.shipping_time}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Order tracking */}
          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
              <ExternalLink className="h-5 w-5 text-primary" />
              Track Your Order
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {"Track your order status at "}
              <a
                href="https://track.master3d.net"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline"
              >
                track.master3d.net
              </a>
              {" (updates appear within 24 hours)."}
            </p>
          </div>

          {/* Order summary */}
          {order && (
            <div className="mt-6 rounded-lg border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-semibold text-card-foreground">Order Summary</h2>
              <dl className="mt-3 flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Customer</dt>
                  <dd className="font-medium text-foreground">{order.customer_name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="font-medium text-foreground">{order.customer_phone}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Address</dt>
                  <dd className="text-right font-medium text-foreground">{order.customer_address}</dd>
                </div>
                <div className="mt-2 flex justify-between border-t border-border pt-2">
                  <dt className="font-semibold text-foreground">Total</dt>
                  <dd className="font-bold text-primary">
                    {"CHF "}
                    {Number(order.total).toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
