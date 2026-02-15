import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata: Metadata = {
  title: "Checkout | Master 3D",
  description: "Complete your order for 3D printed products. Shipping to Switzerland only.",
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Checkout</h1>
          <p className="mt-2 text-muted-foreground">Review your cart and complete your order</p>
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
