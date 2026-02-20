"use client"

import Image from "next/image"
import { Package, Truck, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { addToCart } from "@/lib/cart-store"
import { toast } from "sonner"

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
}

const COLOR_HEX_MAP: Record<string, string> = {
  Orange: "#FF6B00",
  White: "#FFFFFF",
  Black: "#000000",
  Red: "#EF4444",
  Blue: "#3B82F6",
  Green: "#10B981",
  Yellow: "#F59E0B",
  Purple: "#8B5CF6",
  Pink: "#EC4899",
  Gray: "#6B7280",
  "Surprise Me!": "#FF1493",
}

export function ProductCard({ product }: { product: Product }) {
  const availableColors = product.colors || []
  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || "")
  const productImages = product.images && product.images.length > 0 ? product.images : (product.image_url ? [product.image_url] : [])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  const handleAdd = () => {
    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Please select a color")
      return
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      shipping_time: product.shipping_time,
      shipping_cost: product.shipping_cost,
      color: selectedColor,
    })
    toast.success(`${product.name} ${selectedColor ? `(${selectedColor})` : ""} added to cart`)
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {productImages.length > 0 ? (
          <>
            <Image
              src={productImages[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {productImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-heading text-lg font-semibold leading-tight text-card-foreground">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        )}

        {/* Color Selection */}
        {availableColors.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Color:</p>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`group/color relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-primary scale-110"
                      : "border-border hover:border-muted-foreground hover:scale-105"
                  }`}
                  title={color}
                >
                  <div
                    className="h-6 w-6 rounded-full"
                    style={{
                      backgroundColor: COLOR_HEX_MAP[color] || "#ccc",
                      ...(color === "White" && { border: "1px solid #e5e7eb" })
                    }}
                  />
                  {selectedColor === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">CHF {Number(product.price).toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            <span>{product.shipping_time}</span>
            {product.shipping_cost > 0 && (
              <span className="ml-1">
                {"(+CHF "}
                {Number(product.shipping_cost).toFixed(2)}
                {")"}
              </span>
            )}
            {product.shipping_cost === 0 && <span className="ml-1 font-medium text-primary">Free shipping</span>}
          </div>
          <button
            onClick={handleAdd}
            className="mt-1 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
