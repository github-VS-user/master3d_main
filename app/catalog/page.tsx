import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CatalogClient } from "@/components/catalog-client"
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
          <CatalogClient products={products} />
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
