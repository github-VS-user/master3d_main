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
      setForm({ ...form, image_url: data.url })
      toast.success('Image uploaded')
    } catch (error) {
      toast.error('Failed to upload image')
      console.error(error)
    } finally {
      setUploading(false)
    }
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
      image_url: form.image_url || null,
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-muted-foreground">
            {products.length}
            {products.length === 1 ? " product" : " products"}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
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
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Product Image</label>
              <div className="flex flex-col gap-3">
                {form.image_url && (
                  <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-border">
                    <Image src={form.image_url} alt="Preview" fill className="object-cover" sizes="160px" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_url: "" })}
                      className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground shadow-md hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
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
                    {uploading ? "Uploading..." : form.image_url ? "Change Image" : "Upload Image"}
                  </button>
                  <p className="mt-1.5 text-xs text-muted-foreground">Maximum 5MB. Supported formats: JPG, PNG, WebP</p>
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Price</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground md:table-cell">Colors</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Featured</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url && (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                          <Image src={product.image_url} alt="" fill className="object-cover" sizes="40px" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{product.name}</p>
                        {product.description && (
                          <p className="line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-card-foreground">
                    {"CHF "}
                    {Number(product.price).toFixed(2)}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
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
                  <td className="px-4 py-3">
                    {product.featured && <Star className="h-4 w-4 fill-primary text-primary" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
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
        ) : (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No products yet. Click &quot;Add Product&quot; to get started.
          </div>
        )}
      </div>
    </div>
  )
}
