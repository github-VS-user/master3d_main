import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FeaturedProducts } from "@/components/featured-products"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

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
