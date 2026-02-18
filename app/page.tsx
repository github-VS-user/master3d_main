import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FeaturedProducts } from "@/components/featured-products"
import { Footer } from "@/components/footer"
import { Printer, Zap, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: Printer,
    title: "Precision Printing",
    description: "High-quality FDM and resin printing with layer accuracy down to 0.1mm.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Quick turnaround with shipping across all of Switzerland.",
  },
  {
    icon: ShieldCheck,
    title: "Swiss Quality",
    description: "Every product is inspected to meet Swiss quality standards before shipping.",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Features strip */}
        <section className="border-b border-border bg-muted">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:gap-8 sm:py-12 lg:px-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">{feature.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  )
}
