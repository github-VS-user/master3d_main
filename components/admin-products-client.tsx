"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Star, Upload, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  shipping_time: string
  shipping_cost: number
  featured: boolean
  colors: string[] | null
  created_at: string
}

interface FormState {
  name: string
  description: string
  price: string
  image_url: string
  images: string[]
  shipping_time: string
  shipping_cost: string
  featured: boolean
  colors: string[]
}

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  images: [],
  shipping_time: "3-5 business days",
  shipping_cost: "0",
  featured: false,
  colors: [],
}

const PRESET_COLORS = [
  { name: "Orange", hex: "#FF6B00" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#10B981" },
  { name: "Yellow", hex: "#F59E0B" },
  { name: "Purple", hex: "#8B5CF6" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Gray", hex: "#6B7280" },
  { name: "Surprise Me!", hex: "#FF1493" },
]

export function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [customColor, setCustomColor] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const openAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      image_url: product.image_url || "",
      images: product.images || [],
      shipping_time: product.shipping_time,
      shipping_cost: String(product.shipping_cost),
      featured: product.featured,
      colors: product.colors || [],
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      // Add to images array
      setForm({ ...form, images: [...form.images, data.url], image_url: form.images.length === 0 ? data.url : form.image_url })
      toast.success('Image uploaded')
    } catch (error) {
      toast.error('Failed to upload image')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = form.images.filter((_, i) => i !== index)
    setForm({ 
      ...form, 
      images: newImages,
      image_url: newImages.length > 0 ? newImages[0] : ""
    })
    toast.success('Image removed')
  }

  const toggleColor = (colorName: string) => {
    if (form.colors.includes(colorName)) {
      setForm({ ...form, colors: form.colors.filter(c => c !== colorName) })
    } else {
      setForm({ ...form, colors: [...form.colors, colorName] })
    }
  }

  const addCustomColor = () => {
    if (!customColor.trim()) {
      toast.error("Please enter a color name")
      return
    }
    if (form.colors.includes(customColor.trim())) {
      toast.error("Color already added")
      return
    }
    setForm({ ...form, colors: [...form.colors, customColor.trim()] })
    setCustomColor("")
    toast.success(`Added ${customColor.trim()}`)
  }

  const removeCustomColor = (colorName: string) => {
    setForm({ ...form, colors: form.colors.filter(c => c !== colorName) })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) {
      toast.error("Name and price are required")
      return
    }
    if (form.colors.length === 0) {
      toast.error("Please select at least one color")
      return
    }
    setSaving(true)
    const supabase = createClient()

    const payload = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      image_url: form.images.length > 0 ? form.images[0] : null,
      images: form.images.length > 0 ? form.images : null,
      shipping_time: form.shipping_time,
      shipping_cost: Number(form.shipping_cost),
      featured: form.featured,
      colors: form.colors,
    }

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId)
      if (error) {
        toast.error("Failed to update product")
        setSaving(false)
        return
      }
      setProducts(products.map((p) => (p.id === editingId ? { ...p, ...payload } : p)))
      toast.success("Product updated")
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select().single()
      if (error) {
        toast.error("Failed to add product")
        setSaving(false)
        return
      }
      setProducts([data, ...products])
      toast.success("Product added")
    }

    setShowForm(false)
    setEditingId(null)
    setSaving(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    const supabase = createClient()
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete product")
      return
    }
    setProducts(products.filter((p) => p.id !== id))
    toast.success("Product deleted")
    router.refresh()
  }

  const handlePrintCatalog = () => {
    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) {
      toast.error('Please allow popups to print catalog')
      return
    }

    const catalogHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Master 3D Product Catalog</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 1200px; margin: 0 auto; }
            h1 { text-align: center; color: #FF6B00; margin-bottom: 10px; font-size: 32px; }
            .subtitle { text-align: center; color: #666; margin-bottom: 40px; font-size: 16px; }
            .product { page-break-inside: avoid; margin-bottom: 40px; border: 2px solid #e5e5e5; border-radius: 12px; padding: 20px; background: white; }
            .product-header { display: flex; gap: 20px; margin-bottom: 15px; }
            .product-images { flex-shrink: 0; }
            .main-image { width: 200px; height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; }
            .thumbnail-container { display: flex; gap: 8px; margin-top: 8px; }
            .thumbnail { width: 45px; height: 45px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }
            .product-info { flex: 1; }
            .product-name { font-size: 24px; font-weight: bold; color: #111; margin-bottom: 8px; }
            .product-description { color: #666; margin-bottom: 12px; line-height: 1.5; }
            .product-price { font-size: 28px; font-weight: bold; color: #FF6B00; margin-bottom: 12px; }
            .product-details { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; font-size: 14px; }
            .detail-label { font-weight: bold; color: #333; }
            .detail-value { color: #666; }
            .colors { display: flex; gap: 8px; flex-wrap: wrap; }
            .color-badge { display: inline-block; padding: 4px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; }
            .footer { text-align: center; margin-top: 60px; padding-top: 20px; border-top: 2px solid #FF6B00; }
            .website { font-size: 24px; font-weight: bold; color: #FF6B00; }
            @media print {
              body { padding: 20px; }
              .product { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>MASTER 3D</h1>
          <div class="subtitle">Product Catalog - Swiss 3D Printing Excellence</div>
          
          ${products.map(product => `
            <div class="product">
              <div class="product-header">
                <div class="product-images">
                  ${product.images && product.images.length > 0 ? `
                    <img src="${product.images[0]}" alt="${product.name}" class="main-image" />
                    ${product.images.length > 1 ? `
                      <div class="thumbnail-container">
                        ${product.images.slice(1, 5).map(img => `
                          <img src="${img}" alt="${product.name}" class="thumbnail" />
                        `).join('')}
                      </div>
                    ` : ''}
                  ` : product.image_url ? `
                    <img src="${product.image_url}" alt="${product.name}" class="main-image" />
                  ` : ''}
                </div>
                <div class="product-info">
                  <div class="product-name">${product.name}</div>
                  ${product.description ? `<div class="product-description">${product.description}</div>` : ''}
                  <div class="product-price">CHF ${Number(product.price).toFixed(2)}</div>
                  <div class="product-details">
                    <span class="detail-label">Shipping Time:</span>
                    <span class="detail-value">${product.shipping_time}</span>
                    <span class="detail-label">Shipping Cost:</span>
                    <span class="detail-value">CHF ${Number(product.shipping_cost).toFixed(2)}</span>
                    ${product.colors && product.colors.length > 0 ? `
                      <span class="detail-label">Available Colors:</span>
                      <div class="colors">
                        ${product.colors.map(color => `<span class="color-badge">${color}</span>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            </div>
          `).join('')}

          <div class="footer">
            <div class="website">master3d.net</div>
            <div style="margin-top: 8px; color: #666; font-size: 14px;">Contact us for custom orders and inquiries</div>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(catalogHTML)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground sm:text-2xl">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length}
            {products.length === 1 ? " product" : " products"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrintCatalog}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Print Catalog</span>
          </button>
          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product form */}
      {showForm && (
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-card-foreground">
            {editingId ? "Edit Product" : "New Product"}
          </h2>
          <form onSubmit={handleSave} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">{"Price (CHF)"}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Product Images
                <span className="ml-1 text-xs text-muted-foreground">({form.images.length} uploaded)</span>
              </label>
              <div className="flex flex-col gap-3">
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {form.images.map((url, index) => (
                      <div key={index} className="relative h-32 w-32 overflow-hidden rounded-lg border border-border">
                        <Image src={url} alt={`Product ${index + 1}`} fill className="object-cover" sizes="128px" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground shadow-md hover:bg-destructive/90"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 rounded bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? "Uploading..." : form.images.length > 0 ? "Add Another Image" : "Upload First Image"}
                  </button>
                  <p className="mt-1.5 text-xs text-muted-foreground">Maximum 5MB per image. First image will be the main product image.</p>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-card-foreground">
                Available Colors
                <span className="ml-1 text-xs text-muted-foreground">({form.colors.length} selected)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => toggleColor(color.name)}
                    className={`group relative flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      form.colors.includes(color.name)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    <div
                      className="h-5 w-5 rounded-full border-2 border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                    {form.colors.includes(color.name) && (
                      <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Custom Colors */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-card-foreground">Add Custom Color</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
                    placeholder="e.g., Neon Green, Metallic Silver"
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={addCustomColor}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
                
                {/* Display custom colors */}
                {form.colors.filter(c => !PRESET_COLORS.some(p => p.name === c)).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.colors.filter(c => !PRESET_COLORS.some(p => p.name === c)).map((color) => (
                      <div
                        key={color}
                        className="inline-flex items-center gap-2 rounded-md border border-primary bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                      >
                        <span>{color}</span>
                        <button
                          type="button"
                          onClick={() => removeCustomColor(color)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Shipping Time</label>
              <input
                type="text"
                required
                value={form.shipping_time}
                onChange={(e) => setForm({ ...form, shipping_time: e.target.value })}
                placeholder="3-5 business days"
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">{"Shipping Cost (CHF)"}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.shipping_cost}
                onChange={(e) => setForm({ ...form, shipping_cost: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <label htmlFor="featured" className="text-sm font-medium text-card-foreground">
                Featured product (shown on homepage)
              </label>
            </div>
            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null) }}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product list */}
      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-3 py-3 text-left text-xs font-medium uppercase text-muted-foreground lg:px-4">Product</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase text-muted-foreground lg:px-4">Price</th>
                <th className="hidden px-3 py-3 text-left text-xs font-medium uppercase text-muted-foreground md:table-cell lg:px-4">Colors</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase text-muted-foreground lg:px-4">Featured</th>
                <th className="px-3 py-3 text-right text-xs font-medium uppercase text-muted-foreground lg:px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 lg:px-4">
                    <div className="flex items-center gap-2 lg:gap-3">
                      {product.image_url && (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                          <Image src={product.image_url} alt="" fill className="object-cover" sizes="40px" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-card-foreground">{product.name}</p>
                        {product.description && (
                          <p className="line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-card-foreground lg:px-4">
                    {"CHF "}
                    {Number(product.price).toFixed(2)}
                  </td>
                  <td className="hidden px-3 py-3 md:table-cell lg:px-4">
                    <div className="flex gap-1">
                      {product.colors?.slice(0, 3).map((colorName) => {
                        const color = PRESET_COLORS.find(c => c.name === colorName)
                        return color ? (
                          <div
                            key={colorName}
                            className="h-5 w-5 rounded-full border border-border"
                            style={{ backgroundColor: color.hex }}
                            title={colorName}
                          />
                        ) : null
                      })}
                      {(product.colors?.length || 0) > 3 && (
                        <span className="text-xs text-muted-foreground">+{(product.colors?.length || 0) - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 lg:px-4">
                    {product.featured && <Star className="h-4 w-4 fill-primary text-primary" />}
                  </td>
                  <td className="px-3 py-3 lg:px-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(product)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No products yet. Click &quot;Add Product&quot; to get started.
          </div>
        )}
      </div>
    </div>
  )
}
