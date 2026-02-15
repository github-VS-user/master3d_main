"use client"

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  total: number
  is_paid: boolean
  created_at: string
}

interface OrderItem {
  id: string
  order_id: string
  product_name: string
  quantity: number
  price: number
  shipping_time: string
}

export function AdminOrdersClient({
  initialOrders,
  allItems,
}: {
  initialOrders: Order[]
  allItems: OrderItem[]
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const router = useRouter()

  const togglePaid = async (order: Order) => {
    const supabase = createClient()
    const newStatus = !order.is_paid
    const { error } = await supabase
      .from("orders")
      .update({ is_paid: newStatus })
      .eq("id", order.id)

    if (error) {
      toast.error("Failed to update payment status")
      return
    }

    setOrders(orders.map((o) => (o.id === order.id ? { ...o, is_paid: newStatus } : o)))
    toast.success(newStatus ? "Marked as paid" : "Marked as unpaid")
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return
    const supabase = createClient()
    const { error } = await supabase.from("orders").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete order")
      return
    }
    setOrders(orders.filter((o) => o.id !== id))
    toast.success("Order deleted")
    router.refresh()
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Orders</h1>
      <p className="mt-1 text-muted-foreground">
        {orders.length}
        {orders.length === 1 ? " order" : " orders"}
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {orders.length > 0 ? (
          orders.map((order) => {
            const items = allItems.filter((i) => i.order_id === order.id)
            const isExpanded = expandedId === order.id
            return (
              <div key={order.id} className="overflow-hidden rounded-lg border border-border bg-card">
                <div
                  className="flex cursor-pointer items-center gap-4 px-4 py-4 sm:px-6"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') setExpandedId(isExpanded ? null : order.id) }}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading text-sm font-bold text-card-foreground">
                        {"#"}
                        {order.order_number}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.is_paid
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.is_paid ? "Paid" : "Pending"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.customer_name}
                      {" - CHF "}
                      {Number(order.total).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border px-4 pb-4 pt-3 sm:px-6">
                    <dl className="grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">Customer</dt>
                        <dd className="font-medium text-card-foreground">{order.customer_name}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd className="font-medium text-card-foreground">{order.customer_phone}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-muted-foreground">Address</dt>
                        <dd className="font-medium text-card-foreground">{order.customer_address}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Order Date</dt>
                        <dd className="font-medium text-card-foreground">
                          {new Date(order.created_at).toLocaleDateString("de-CH")}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Total</dt>
                        <dd className="font-bold text-primary">
                          {"CHF "}
                          {Number(order.total).toFixed(2)}
                        </dd>
                      </div>
                    </dl>

                    {items.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium uppercase text-muted-foreground">Items</p>
                        <ul className="mt-2 flex flex-col gap-2">
                          {items.map((item) => (
                            <li key={item.id} className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
                              <span className="text-foreground">
                                {item.product_name}
                                {" x"}
                                {item.quantity}
                              </span>
                              <span className="text-muted-foreground">
                                {"CHF "}
                                {(Number(item.price) * item.quantity).toFixed(2)}
                                {" | "}
                                {item.shipping_time}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => togglePaid(order)}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                          order.is_paid
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {order.is_paid ? "Mark Unpaid" : "Mark as Paid"}
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="flex items-center gap-1.5 rounded-md bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="rounded-lg border border-border bg-card py-12 text-center text-sm text-muted-foreground">
            No orders yet
          </div>
        )}
      </div>
    </div>
  )
}
