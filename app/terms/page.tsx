import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms & Conditions | Master 3D",
  description: "Terms and conditions for Master 3D services",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="mb-8 font-heading text-4xl font-bold text-foreground">Terms & Conditions</h1>

          <div className="space-y-8 rounded-lg border border-border bg-card p-6 text-foreground lg:p-8">
            <section>
              <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p className="leading-relaxed text-muted-foreground">
                By accessing and using Master 3D's services, you accept and agree to be bound by the terms and provisions of this agreement.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">2. Services</h2>
              <p className="leading-relaxed text-muted-foreground">
                Master 3D provides custom 3D printing services for individuals and businesses in Switzerland. We reserve the right to refuse service to anyone for any reason at any time.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">3. Orders and Payment</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                All orders are subject to acceptance and availability. Payment must be completed before production begins. We accept:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>TWINT (all orders)</li>
                <li>Bank transfer (minimum CHF 10.00)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">4. Pricing</h2>
              <p className="leading-relaxed text-muted-foreground">
                All prices are listed in Swiss Francs (CHF) and include VAT where applicable. Prices are subject to change without notice. The price confirmed at the time of order placement will be honored.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">5. Production and Delivery</h2>
              <p className="leading-relaxed text-muted-foreground">
                Production times are estimates and may vary. We will notify you of any significant delays. Delivery is available throughout Switzerland. Risk of loss and title for items pass to you upon delivery to the carrier (Swiss Post).
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">6. Quality Standards</h2>
              <p className="leading-relaxed text-muted-foreground">
                All products are inspected to meet Swiss quality standards before shipping. Minor variations in color, texture, or finish are inherent to 3D printing and do not constitute defects.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">7. Intellectual Property</h2>
              <p className="leading-relaxed text-muted-foreground">
                Customers retain all rights to their original designs. By submitting designs for printing, you represent that you have the right to use and reproduce the designs. Master 3D will not reproduce customer designs without explicit permission.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">8. Limitation of Liability</h2>
              <p className="leading-relaxed text-muted-foreground">
                Master 3D shall not be liable for any indirect, incidental, special, or consequential damages arising out of the use or inability to use our services.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">9. Governing Law</h2>
              <p className="leading-relaxed text-muted-foreground">
                These terms shall be governed by and construed in accordance with the laws of Switzerland. Any disputes shall be subject to the exclusive jurisdiction of the courts of Geneva, Switzerland.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">10. Changes to Terms</h2>
              <p className="leading-relaxed text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Contact Information</h2>
              <p className="leading-relaxed text-muted-foreground">
                For questions about these terms, please contact us at contact.master3d@gmail.com.
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
