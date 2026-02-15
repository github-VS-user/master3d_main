import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"

export async function FeaturedProducts() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6)

  if (!products || products.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Featured Products</h2>
          <p className="text-muted-foreground">No featured products yet. Check back soon!</p>
          <Link
            href="/catalog"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Full Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Featured Products</h2>
          <p className="mt-1 text-muted-foreground">Our most popular 3D printed products</p>
        </div>
        <Link
          href="/catalog"
          className="hidden items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80 md:flex"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 flex justify-center md:hidden">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View Full Catalog
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
