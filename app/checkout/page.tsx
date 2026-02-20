import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckoutPageClient } from "@/components/checkout-page-client"

export const metadata: Metadata = {
  title: "Checkout | Master 3D",
  description: "Complete your order for 3D printed products. Shipping to Switzerland only.",
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <CheckoutPageClient />
      </main>
      <Footer />
    </div>
  )
}
