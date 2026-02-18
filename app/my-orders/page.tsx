import type { Metadata } from "next"
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
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">My Orders</h1>
            <p className="mt-2 text-muted-foreground">Track your orders and view order details</p>
          </div>
          <MyOrdersClient />
        </div>
      </main>
      <Footer />
    </div>
  )
}
