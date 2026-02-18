import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Package } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function CatalogPage() {
  try {
    const supabase = await createClient()
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
            <div className="mb-6 sm:mb-10">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Product Catalog</h1>
              <p className="mt-2 text-base text-muted-foreground sm:text-lg">Browse our full range of 3D printed products</p>
            </div>

            {products && products.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">No products yet</h2>
                <p className="max-w-md text-muted-foreground">
                  Our catalog is being set up. Check back soon for amazing 3D printed products!
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("[v0] Failed to load products:", error)
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">Catalog Temporarily Unavailable</h1>
            <p className="mt-2 text-muted-foreground">We're having trouble loading the product catalog. Please try again later.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
}
