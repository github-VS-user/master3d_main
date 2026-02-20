"use client"

import { ProductCard } from "@/components/product-card"
import { Package } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  images: string[] | null
  shipping_time: string
  shipping_cost: number
  colors: string[] | null
  featured: boolean
}

export function CatalogClient({ products }: { products: Product[] | null }) {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
      <div className="mb-6 sm:mb-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("catalog.title")}
        </h1>
        <p className="mt-2 text-base text-muted-foreground sm:text-lg">{t("catalog.subtitle")}</p>
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
          <h2 className="text-xl font-semibold text-foreground">{t("catalog.noProducts")}</h2>
          <p className="max-w-md text-muted-foreground">{t("catalog.noProductsDesc")}</p>
        </div>
      )}
    </div>
  )
}
