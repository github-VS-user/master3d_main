import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Master 3D",
  description: "Privacy policy for Master 3D",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="mb-8 font-heading text-4xl font-bold text-foreground">Privacy Policy</h1>

          <div className="space-y-8 rounded-lg border border-border bg-card p-6 text-foreground lg:p-8">
            <section>
              <h2 className="mb-4 text-2xl font-semibold">1. Information We Collect</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                We collect information necessary to fulfill your orders and provide our services:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Name and shipping address</li>
                <li>Phone number (optional, for order updates & tracking)</li>
                <li>Order details and design files</li>
                <li>Payment information (processed securely through TWINT or bank transfer)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">2. How We Use Your Information</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                Your information is used exclusively for:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Processing and fulfilling your orders</li>
                <li>Communicating about order status and updates</li>
                <li>Shipping your products</li>
                <li>Improving our services</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">3. Data Storage and Security</h2>
              <p className="leading-relaxed text-muted-foreground">
                We store your data securely using industry-standard encryption and security measures. Your payment information is never stored on our servers. Design files are kept confidential and deleted after order completion unless otherwise agreed.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">4. Data Sharing</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                We do not sell or share your personal information with third parties except:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Shipping carriers (to deliver your orders)</li>
                <li>Payment processors (for transaction processing)</li>
                <li>When required by law or legal process</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">5. Cookies</h2>
              <p className="leading-relaxed text-muted-foreground">
                Our website uses essential cookies to maintain your shopping cart and language preferences. We do not use tracking or advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">6. Your Rights</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                Under Swiss data protection law, you have the right to:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">7. Data Retention</h2>
              <p className="leading-relaxed text-muted-foreground">
                We retain your order information for 10 years as required by Swiss tax and commercial law. Design files are retained only as long as necessary to complete your order, unless you request longer storage.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">8. Children's Privacy</h2>
              <p className="leading-relaxed text-muted-foreground">
                Our services are not directed directly to individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">9. Changes to Privacy Policy</h2>
              <p className="leading-relaxed text-muted-foreground">
                We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">10. Contact Us</h2>
              <p className="leading-relaxed text-muted-foreground">
                For questions about this privacy policy or to exercise your data rights, contact us at contact.master3d@gmail.com.
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
