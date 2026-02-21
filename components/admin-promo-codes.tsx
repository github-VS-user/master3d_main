"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Pencil } from "lucide-react"
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
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    is_active: true,
  })

  useEffect(() => {
    loadCodes()
  }, [])

  const loadCodes = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (data) setCodes(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    const payload = {
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      is_active: form.is_active,
    }

    if (editingId) {
      const { error } = await supabase
        .from("promo_codes")
        .update(payload)
        .eq("id", editingId)
      
      if (error) {
        toast.error("Failed to update promo code")
        return
      }
      toast.success("Promo code updated")
    } else {
      const { error } = await supabase.from("promo_codes").insert(payload)
      
      if (error) {
        toast.error("Failed to create promo code")
        return
      }
      toast.success("Promo code created")
    }

    setForm({ code: "", discount_type: "percentage", discount_value: "", is_active: true })
    setEditingId(null)
    setShowForm(false)
    loadCodes()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return
    const supabase = createClient()
    const { error } = await supabase.from("promo_codes").delete().eq("id", id)
    
    if (error) {
      toast.error("Failed to delete promo code")
      return
    }
    
    setCodes(codes.filter((c) => c.id !== id))
    toast.success("Promo code deleted")
  }

  const openEdit = (code: PromoCode) => {
    setForm({
      code: code.code,
      discount_type: code.discount_type,
      discount_value: String(code.discount_value),
      is_active: code.is_active,
    })
    setEditingId(code.id)
    setShowForm(true)
  }

  const openAdd = () => {
    setForm({ code: "", discount_type: "percentage", discount_value: "", is_active: true })
    setEditingId(null)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Promo Codes</h2>
          <p className="text-sm text-muted-foreground">Manage discount codes for customers</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span>Add Promo Code</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
            {editingId ? "Edit Promo Code" : "New Promo Code"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. SUMMER20"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">Discount Type</label>
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percentage" | "fixed" })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (CHF)</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Discount Value {form.discount_type === "percentage" ? "(%)" : "(CHF)"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={form.discount_type === "percentage" ? "100" : undefined}
                  value={form.discount_value}
                  onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 20"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-card-foreground">
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {codes.map((code) => (
          <div key={code.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold text-foreground">{code.code}</span>
                {!code.is_active && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    Inactive
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {code.discount_type === "percentage"
                  ? `${code.discount_value}% off`
                  : `CHF ${code.discount_value.toFixed(2)} off`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(code)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(code.id)}
                className="rounded-md p-2 text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
