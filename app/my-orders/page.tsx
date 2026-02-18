import type { Metadata } from "next"
import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MyOrdersClient } from "@/components/my-orders-client"

export const metadata: Metadata = {
  title: "My Orders | Master 3D",
  description: "Track your 3D printing orders",
}

export default function MyOrdersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">My Orders</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Track your orders and view order details</p>
          </div>
          <Suspense fallback={<div className="rounded-lg border border-border bg-card p-6 text-center">Loading...</div>}>
            <MyOrdersClient />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
