import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Return Policy | Master 3D",
  description: "Return and refund policy for Master 3D products",
}

export default function ReturnPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="mb-8 font-heading text-4xl font-bold text-foreground">Return Policy</h1>

          <div className="space-y-8 rounded-lg border border-border bg-card p-6 text-foreground lg:p-8">
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Custom-Made Products</h2>
              <p className="leading-relaxed text-muted-foreground">
                As all our products are custom 3D printed to order based on your specifications, we generally cannot accept returns or offer refunds for change of mind. Each item is uniquely manufactured for you.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Defective or Damaged Products</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                If you receive a product that is defective, damaged during shipping, or does not match the agreed specifications, we will:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>Replace the product at no additional cost, or</li>
                <li>Provide a full refund including shipping costs</li>
              </ul>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                You must notify us within 7 days of receiving the product with photos showing the defect or damage.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Quality Guarantee</h2>
              <p className="leading-relaxed text-muted-foreground">
                All products are carefully inspected before shipping to ensure they meet our Swiss quality standards. We guarantee that your product will be printed according to the agreed specifications and will be structurally sound.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">What Is Not Covered</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                The following are not considered defects and are not covered by our return policy:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Minor variations in color, texture, or finish inherent to 3D printing</li>
                <li>Visible layer lines (a characteristic of FDM printing)</li>
                <li>Small support marks or minor imperfections that don't affect functionality</li>
                <li>Changes in dimensions due to natural material shrinkage (within ±0.5mm tolerance)</li>
                <li>Damage caused by misuse, modification, or improper handling after delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Order Cancellation</h2>
              <p className="leading-relaxed text-muted-foreground">
                You may cancel your order for a full refund if production has not yet begun. Once production starts, cancellation is not possible, as materials and time have been committed to your custom order.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Return Process</h2>
              <p className="mb-3 leading-relaxed text-muted-foreground">
                To initiate a return for a defective product:
              </p>
              <ol className="ml-6 list-decimal space-y-2 text-muted-foreground">
                <li>Contact us at contact.master3d@gmail.com within 7 days of delivery</li>
                <li>Provide your order number and clear photos of the issue</li>
                <li>Wait for return authorization before sending anything back</li>
                <li>Ship the item back in its original packaging (if approved)</li>
                <li>We will inspect the returned item and process your replacement or refund within 7 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Refund Method</h2>
              <p className="leading-relaxed text-muted-foreground">
                Approved refunds will be issued using the original payment method (TWINT or bank transfer) within 7-10 business days.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Shipping Costs</h2>
              <p className="leading-relaxed text-muted-foreground">
                For defective or damaged products, we will cover all return shipping costs. For all other cases, return shipping costs are the responsibility of the customer.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Questions</h2>
              <p className="leading-relaxed text-muted-foreground">
                If you have questions about our return policy or need to report an issue with your order, please contact us at +41 78 251 47 68 or contact.master3d@gmail.com. We're committed to ensuring your satisfaction with every order.
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
