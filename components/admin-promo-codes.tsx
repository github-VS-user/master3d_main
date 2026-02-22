"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Pencil, Trash2, Tag, Percent, DollarSign, X } from "lucide-react"
import { toast } from "sonner"

interface PromoCode {
  id: string
  code: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  is_active: boolean
  created_at: string
}

export function AdminPromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null)

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    is_active: true,
  })

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const fetchPromoCodes = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPromoCodes(data || [])
    } catch (error) {
      console.error("[v0] Error fetching promo codes:", error)
      toast.error("Failed to load promo codes")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.code || !formData.discount_value) {
      toast.error("Please fill in all required fields")
      return
    }

    const discountValue = parseFloat(formData.discount_value)
    if (isNaN(discountValue) || discountValue <= 0) {
      toast.error("Discount value must be a positive number")
      return
    }

    if (formData.discount_type === "percentage" && discountValue > 100) {
      toast.error("Percentage discount cannot exceed 100%")
      return
    }

    try {
      const supabase = createClient()

      if (editingCode) {
        const { error } = await supabase
          .from("promo_codes")
          .update({
            code: formData.code.toUpperCase(),
            discount_type: formData.discount_type,
            discount_value: discountValue,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCode.id)

        if (error) throw error
        toast.success("Promo code updated successfully")
      } else {
        const { error } = await supabase.from("promo_codes").insert({
          code: formData.code.toUpperCase(),
          discount_type: formData.discount_type,
          discount_value: discountValue,
          is_active: formData.is_active,
        })

        if (error) throw error
        toast.success("Promo code created successfully")
      }

      setShowDialog(false)
      setEditingCode(null)
      setFormData({ code: "", discount_type: "percentage", discount_value: "", is_active: true })
      fetchPromoCodes()
    } catch (error: any) {
      console.error("[v0] Error saving promo code:", error)
      toast.error(error.message || "Failed to save promo code")
    }
  }

  const handleEdit = (code: PromoCode) => {
    setEditingCode(code)
    setFormData({
      code: code.code,
      discount_type: code.discount_type,
      discount_value: code.discount_value.toString(),
      is_active: code.is_active,
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("promo_codes").delete().eq("id", id)

      if (error) throw error
      toast.success("Promo code deleted successfully")
      fetchPromoCodes()
    } catch (error) {
      console.error("[v0] Error deleting promo code:", error)
      toast.error("Failed to delete promo code")
    }
  }

  const handleToggleActive = async (code: PromoCode) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("promo_codes")
        .update({ is_active: !code.is_active })
        .eq("id", code.id)

      if (error) throw error
      toast.success(`Promo code ${!code.is_active ? "activated" : "deactivated"}`)
      fetchPromoCodes()
    } catch (error) {
      console.error("[v0] Error toggling promo code:", error)
      toast.error("Failed to update promo code")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading promo codes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promo Codes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage discount codes for your customers
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCode(null)
            setFormData({ code: "", discount_type: "percentage", discount_value: "", is_active: true })
            setShowDialog(true)
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Promo Code
        </button>
      </div>

      {/* Promo Codes Grid */}
      {promoCodes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promoCodes.map((code) => (
            <div
              key={code.id}
              className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Status Badge */}
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => handleToggleActive(code)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                    code.is_active
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {code.is_active ? "Active" : "Inactive"}
                </button>
              </div>

              {/* Code */}
              <div className="mb-4 pr-20">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Tag className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Code</span>
                </div>
                <p className="text-2xl font-bold tracking-tight text-foreground font-mono break-all">
                  {code.code}
                </p>
              </div>

              {/* Discount */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  {code.discount_type === "percentage" ? (
                    <Percent className="h-4 w-4" />
                  ) : (
                    <DollarSign className="h-4 w-4" />
                  )}
                  <span className="text-xs font-medium uppercase tracking-wide">Discount</span>
                </div>
                <p className="text-xl font-semibold text-primary">
                  {code.discount_type === "percentage"
                    ? `${code.discount_value}%`
                    : `CHF ${code.discount_value.toFixed(2)}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(code)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(code.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-12 text-center">
          <div className="mx-auto w-fit rounded-full bg-muted p-4">
            <Tag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No promo codes yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Create your first promo code to start offering discounts to your customers
          </p>
          <button
            onClick={() => {
              setEditingCode(null)
              setFormData({ code: "", discount_type: "percentage", discount_value: "", is_active: true })
              setShowDialog(true)
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Promo Code
          </button>
        </div>
      )}

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-xl font-bold">
                {editingCode ? "Edit Promo Code" : "Add New Promo Code"}
              </h2>
              <button
                onClick={() => {
                  setShowDialog(false)
                  setEditingCode(null)
                }}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Code <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SAVE20"
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm font-mono uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Customers will enter this code at checkout
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Discount Type <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.discount_type}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_type: e.target.value as "percentage" | "fixed" })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="fixed">Fixed Amount (CHF)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Discount Value <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.discount_type === "percentage" ? "100" : undefined}
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    placeholder={formData.discount_type === "percentage" ? "e.g., 20" : "e.g., 10.00"}
                    className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {formData.discount_type === "percentage"
                    ? "Enter a percentage between 0 and 100"
                    : "Enter the discount amount in Swiss Francs (CHF)"}
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-md bg-muted p-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                />
                <div className="flex-1">
                  <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer">
                    Active
                  </label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Customers can use this code immediately after creation
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDialog(false)
                    setEditingCode(null)
                  }}
                  className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {editingCode ? "Update Code" : "Create Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
