"use client"

import { useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Truck, Search, X, Check, Clock, Package, PackageCheck } from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "Waiting" | "printing" | "shipping" | "delivered"
type Shipper = "Oscar" | "Dario"

interface TrackingOrder {
  id: string
  order_code: string
  price: number
  object_name: string
  status: Status
  client_name: string
  shipper: Shipper
  created_at: string
  updated_at: string
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  Waiting:   { label: "Waiting",   color: "bg-yellow-100 text-yellow-800 border-yellow-200",  icon: Clock },
  printing:  { label: "Printing",  color: "bg-blue-100 text-blue-800 border-blue-200",        icon: Package },
  shipping:  { label: "Shipping",  color: "bg-purple-100 text-purple-800 border-purple-200",  icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800 border-green-200",     icon: PackageCheck },
}

const STATUSES: Status[] = ["Waiting", "printing", "shipping", "delivered"]
const SHIPPERS: Shipper[] = ["Oscar", "Dario"]

const emptyForm = {
  order_code: "",
  price: "",
  object_name: "",
  status: "Waiting" as Status,
  client_name: "",
  shipper: "Oscar" as Shipper,
}

export function AdminTrackingClient({ initialOrders }: { initialOrders: TrackingOrder[] }) {
  const [orders, setOrders] = useState<TrackingOrder[]>(initialOrders)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all")
  const [showDialog, setShowDialog] = useState(false)
  const [editing, setEditing] = useState<TrackingOrder | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !search ||
        o.order_code.toLowerCase().includes(search.toLowerCase()) ||
        o.client_name.toLowerCase().includes(search.toLowerCase()) ||
        o.object_name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filterStatus === "all" || o.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [orders, search, filterStatus])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowDialog(true)
  }

  const openEdit = (order: TrackingOrder) => {
    setEditing(order)
    setForm({
      order_code: order.order_code,
      price: order.price.toString(),
      object_name: order.object_name,
      status: order.status,
      client_name: order.client_name,
      shipper: order.shipper,
    })
    setShowDialog(true)
  }

  const handleSave = async () => {
    if (!form.order_code.trim() || !form.client_name.trim() || !form.object_name.trim() || !form.price) {
      toast.error("Please fill all required fields")
      return
    }

    setSaving(true)
    try {
      const payload = {
        order_code: form.order_code.trim(),
        price: parseFloat(form.price),
        object_name: form.object_name.trim(),
        status: form.status,
        client_name: form.client_name.trim(),
        shipper: form.shipper,
      }

      if (editing) {
        const { data, error } = await supabase
          .from("tracking_orders")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editing.id)
          .select()
          .single()
        if (error) throw error
        setOrders((prev) => prev.map((o) => (o.id === editing.id ? data : o)))
        toast.success("Order updated")
      } else {
        const { data, error } = await supabase
          .from("tracking_orders")
          .insert(payload)
          .select()
          .single()
        if (error) throw error
        setOrders((prev) => [data, ...prev])
        toast.success("Order added")
      }

      setShowDialog(false)
      setEditing(null)
      setForm(emptyForm)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (order: TrackingOrder, newStatus: Status) => {
    try {
      const { data, error } = await supabase
        .from("tracking_orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", order.id)
        .select()
        .single()
      if (error) throw error
      setOrders((prev) => prev.map((o) => (o.id === order.id ? data : o)))
      toast.success(`Status updated to ${STATUS_CONFIG[newStatus].label}`)
    } catch {
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const { error } = await supabase.from("tracking_orders").delete().eq("id", id)
      if (error) throw error
      setOrders((prev) => prev.filter((o) => o.id !== id))
      toast.success("Order deleted")
    } catch {
      toast.error("Failed to delete order")
    } finally {
      setDeletingId(null)
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length }
    STATUSES.forEach((s) => { c[s] = orders.filter((o) => o.status === s).length })
    return c
  }, [orders])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Tracking</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order code, client, object..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                filterStatus === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s].label}
              <span className="rounded-full bg-current/10 px-1.5 py-0.5 text-[10px] font-bold">
                {counts[s] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
          <Truck className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">No orders found</p>
          <button onClick={openCreate} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Add first order
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Object</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shipper</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((order) => {
                  const cfg = STATUS_CONFIG[order.status]
                  const Icon = cfg.icon
                  return (
                    <tr key={order.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-sm font-semibold text-foreground">{order.order_code}</td>
                      <td className="px-4 py-3 text-foreground">{order.client_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{order.object_name}</td>
                      <td className="px-4 py-3 font-medium text-foreground">CHF {Number(order.price).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.shipper === "Oscar"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-indigo-100 text-indigo-800"
                        }`}>
                          {order.shipper}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                          {/* Quick status advance */}
                          {order.status !== "delivered" && (
                            <button
                              onClick={() => {
                                const next = STATUSES[STATUSES.indexOf(order.status) + 1]
                                if (next) handleStatusChange(order, next)
                              }}
                              title="Advance to next status"
                              className="rounded border border-border p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(order)}
                            className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            disabled={deletingId === order.id}
                            className="rounded-lg border border-destructive/30 p-1.5 text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDialog(false)} />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-card-foreground">
                {editing ? "Edit Order" : "Add Order"}
              </h2>
              <button onClick={() => setShowDialog(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Order Code *</label>
                  <input
                    type="text"
                    value={form.order_code}
                    onChange={(e) => setForm({ ...form, order_code: e.target.value })}
                    placeholder="e.g. M3D-001"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Price (CHF) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Client Name *</label>
                <input
                  type="text"
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  placeholder="Client full name"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Object Name *</label>
                <input
                  type="text"
                  value={form.object_name}
                  onChange={(e) => setForm({ ...form, object_name: e.target.value })}
                  placeholder="What is being printed/shipped"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Shipper</label>
                  <select
                    value={form.shipper}
                    onChange={(e) => setForm({ ...form, shipper: e.target.value as Shipper })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {SHIPPERS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
