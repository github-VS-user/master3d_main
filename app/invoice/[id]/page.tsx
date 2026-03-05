import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Invoice | Master 3D",
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !order) notFound()

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)

  const subtotal = (items ?? []).reduce(
    (sum: number, i: { price: number; quantity: number }) => sum + Number(i.price) * i.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-background py-12 print:py-0">
      <div className="mx-auto max-w-2xl px-4">
        {/* Print button — hidden when printing */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to store
          </Link>
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Print / Save as PDF
          </button>
        </div>

        {/* Invoice card */}
        <div className="rounded-xl border border-border bg-card shadow-sm print:shadow-none print:border-none">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border px-8 py-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-card-foreground">Master 3D</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">Switzerland</p>
              <p className="mt-0.5 text-sm text-muted-foreground">contact@master3d.net</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Invoice</p>
              <p className="mt-1 font-heading text-2xl font-bold text-primary">#{order.order_number}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("de-CH", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Billing info */}
          <div className="grid gap-6 px-8 py-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Billed to</p>
              <p className="mt-2 font-medium text-card-foreground">{order.customer_name}</p>
              {order.customer_email && (
                <p className="text-sm text-muted-foreground">{order.customer_email}</p>
              )}
              {order.customer_phone && (
                <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">{order.customer_address}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Payment</p>
              <p className="mt-2 text-sm font-medium text-card-foreground capitalize">
                {order.payment_method === "iban"
                  ? "Bank Transfer (IBAN)"
                  : order.payment_method === "twint"
                  ? "TWINT"
                  : "Cash on Delivery"}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${order.is_paid ? "bg-green-500" : "bg-amber-400"}`}
                />
                <span className={order.is_paid ? "text-green-700" : "text-amber-700"}>
                  {order.is_paid ? "Paid" : "Payment pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="px-8">
            <table className="w-full">
              <thead>
                <tr className="border-y border-border">
                  <th className="py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Item
                  </th>
                  <th className="py-3 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Qty
                  </th>
                  <th className="py-3 text-right text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Unit Price
                  </th>
                  <th className="py-3 text-right text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {(items ?? []).map(
                  (item: {
                    id: string
                    product_name: string
                    quantity: number
                    price: number
                  }) => (
                    <tr key={item.id} className="border-b border-border last:border-0">
                      <td className="py-3 text-sm text-card-foreground">{item.product_name}</td>
                      <td className="py-3 text-center text-sm text-muted-foreground">{item.quantity}</td>
                      <td className="py-3 text-right text-sm text-muted-foreground">
                        CHF {Number(item.price).toFixed(2)}
                      </td>
                      <td className="py-3 text-right text-sm font-medium text-card-foreground">
                        CHF {(Number(item.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-border px-8 py-6">
            <div className="ml-auto max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-card-foreground">CHF {subtotal.toFixed(2)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount{order.promo_code ? ` (${order.promo_code})` : ""}
                  </span>
                  <span className="text-primary">-CHF {Number(order.discount_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-heading font-bold text-card-foreground">Total</span>
                <span className="font-heading text-lg font-bold text-primary">
                  CHF {Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="rounded-b-xl border-t border-border bg-muted/50 px-8 py-5 text-center">
            <p className="text-xs text-muted-foreground">
              Thank you for your order. Questions? Contact us at{" "}
              <a href="mailto:contact@master3d.net" className="text-primary">
                contact@master3d.net
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
