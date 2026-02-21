import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Shipping Policy | Master 3D",
  description: "Shipping information and policy for Master 3D",
}

export default function ShippingPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="mb-8 font-heading text-4xl font-bold text-foreground">Shipping Policy</h1>

          <div className="space-y-8 rounded-lg border border-border bg-card p-6 text-foreground lg:p-8">
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Shipping Coverage</h2>
              <p className="leading-relaxed text-muted-foreground">
                Master 3D currently ships exclusively within Switzerland. We deliver to all cantons including remote areas. International shipping is not available at this time.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Production Time</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                Production times vary based on product complexity and current order volume:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Standard items: 2-5 business days</li>
                <li>Complex or large items: 5-10 business days</li>
                <li>Custom designs: Timeline provided at order confirmation</li>
              </ul>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Production begins ONLY after payment is confirmed.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Shipping Methods</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                We use Swiss Post for all deliveries, ensuring reliable shipping:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li><strong>Priority Mail:</strong> 1-3 business days delivery after shipping</li>
                <li><strong>Standard Mail:</strong> 2-4 business days delivery after shipping</li>
              </ul>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                All shipments include tracking information after max. 24 hours.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Shipping Costs</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                Shipping costs are calculated based on package size and weight:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Small items: CHF 1.00 - 2.00</li>
                <li>Medium items: CHF 4.00 - 12.00</li>
                <li>Large items: CHF 12.00 - Indefinite</li>
              </ul>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Exact shipping cost is displayed at checkout. Some products qualify for free shipping.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Order Tracking</h2>
              <p className="leading-relaxed text-muted-foreground">
                You can track your package at <a href="https://track.master3d.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">track.master3d.net</a> . Order will appear after 1 minute.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Delivery</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                Delivery options depend on your address:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Home/business address delivery</li>
                <li>Signature may be required for valuable items</li>
                <li>If you're not home, Swiss Post will leave a pickup notice</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Packaging</h2>
              <p className="leading-relaxed text-muted-foreground">
                All products are carefully packaged to prevent damage during shipping. We use protective materials appropriate for each item's fragility and size. Packaging is recyclable wherever possible.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Lost or Delayed Packages</h2>
              <p className="leading-relaxed text-muted-foreground">
                If your package is significantly delayed or appears to be lost, contact us immediately at +41 78 251 47 68 or
                contact.master3d@gmail.com. We will work with Swiss Post to locate your package or arrange a replacement if necessary.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Damaged in Transit</h2>
              <p className="leading-relaxed text-muted-foreground">
                If your package arrives damaged, please take photos of both the package and the product before opening completely. Contact us within 48 hours at +41 78 251 47 68 or
                contact.master3d@gmail.com to report the damage. We will arrange a replacement or refund.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Incorrect Address</h2>
              <p className="leading-relaxed text-muted-foreground">
                Please ensure your shipping address is correct when placing your order. If you need to change the address after ordering, contact us immediately. Once shipped, we cannot guarantee address changes. Additional shipping fees may apply for redelivery.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Holidays and Special Circumstances</h2>
              <p className="leading-relaxed text-muted-foreground">
                Shipping times may be extended during Swiss public holidays or special circumstances. We will notify you of any expected delays that may affect your order via an in-site notification.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
              <p className="leading-relaxed text-muted-foreground">
                For questions about shipping or to track your order, contact us at +41 78 251 47 68 or visit <a href="https://track.master3d.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">track.master3d.net</a>.
              </p>
            </section>

            <p className="mt-8 text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
