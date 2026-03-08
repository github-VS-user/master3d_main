import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FeaturedProducts } from "@/components/featured-products"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Master 3D | Swiss 3D Printing - Premium 3D Printed Products",
  description: "Discover premium 3D printed products made in Switzerland. Shop gadgets, home decor, custom prints and more with fast delivery across Switzerland.",
  openGraph: {
    title: "Master 3D | Swiss 3D Printing",
    description: "Premium 3D printed products made in Switzerland. Fast Swiss delivery.",
  },
}

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturesSection />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  )
}
