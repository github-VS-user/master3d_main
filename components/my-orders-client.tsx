"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Package, ExternalLink, Calendar, Phone, MapPin, CreditCard, Clock, FileText, X, Building2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  total: number
  is_paid: boolean
  created_at: string
}

type OrderItem = {
  id: string
  product_name: string
  quantity: number
  price: number
  shipping_time: string
}

export function MyOrdersClient() {
  const searchParams = useSearchParams()
  const [searchType, setSearchType] = useState<"phone" | "order">("phone")
  const [phone, setPhone] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({})
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Auto-search if order number is in URL
  useEffect(() => {
    const orderFromUrl = searchParams.get('order')
    if (orderFromUrl) {
      setSearchType('order')
      setOrderNumber(orderFromUrl)
      // Trigger search automatically
      setTimeout(() => {
        const form = document.querySelector('form')
        if (form) {
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
        }
      }, 100)
    }
  }, [searchParams])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const searchValue = searchType === "phone" ? phone.trim() : orderNumber.trim()
    if (!searchValue) return

    setLoading(true)
    setSearched(true)

    try {
      const supabase = createClient()

      // Fetch orders by phone number or order number
      let query = supabase.from("orders").select("*")
      
      if (searchType === "phone") {
        query = query.eq("customer_phone", phone.trim())
      } else {
        query = query.eq("order_number", orderNumber.trim())
      }
      
      const { data: ordersData, error: ordersError } = await query.order("created_at", { ascending: false })

      if (ordersError) throw ordersError

      setOrders(ordersData || [])

      // Fetch order items for each order
      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map((o) => o.id)
        const { data: itemsData } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds)

        if (itemsData) {
          const itemsByOrder: Record<string, OrderItem[]> = {}
          itemsData.forEach((item) => {
            if (!itemsByOrder[item.order_id]) {
              itemsByOrder[item.order_id] = []
            }
            itemsByOrder[item.order_id].push(item)
          })
          setOrderItems(itemsByOrder)
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTrackingUrl = (orderNumber: string) => {
    return `https://track.master3d.net/?order=${orderNumber}`
  }

  return (
    <div className="space-y-6">
      {/* Search form */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
        <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">Search By</label>
            <div className="mt-2 flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSearchType("phone")}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors sm:flex-none sm:px-4 sm:text-sm ${
                  searchType === "phone"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                Phone Number
              </button>
              <button
                type="button"
                onClick={() => setSearchType("order")}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors sm:flex-none sm:px-4 sm:text-sm ${
                  searchType === "order"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                Order Number
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="search-input" className="block text-sm font-medium text-foreground">
              {searchType === "phone" ? "Phone Number" : "Order Number"}
            </label>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchType === "phone"
                ? "Enter the phone number you used when placing your order"
                : "Enter your 3-digit order number (e.g., 123)"}
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              {searchType === "phone" ? (
                <input
                  type="tel"
                  id="search-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+41 XX XXX XX XX"
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:px-4"
                  required
                />
              ) : (
                <input
                  type="text"
                  id="search-input"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="123"
                  pattern="[0-9]{3}"
                  maxLength={3}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:px-4"
                  required
                />
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 sm:px-6"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    <span className="sm:inline">Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          {orders.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                Found {orders.length} {orders.length === 1 ? "order" : "orders"}
              </p>
              {orders.map((order) => (
                <div key={order.id} className="rounded-lg border border-border bg-card shadow-sm">
                  {/* Order header */}
                  <div className="border-b border-border bg-muted/30 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Package className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <p className="font-heading text-base font-bold text-foreground sm:text-lg">
                            Order #{order.order_number}
                          </p>
                          <p className="text-xs text-muted-foreground sm:text-sm">
                            {new Date(order.created_at).toLocaleDateString("en-CH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowPaymentModal(true)
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                        >
                          <FileText className="h-4 w-4" />
                          Payment Info
                        </button>
                        <a
                          href={getTrackingUrl(order.order_number)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Track Order
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Order details */}
                  <div className="p-4 sm:p-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Customer info */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Customer Details
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="text-sm text-foreground">{order.customer_phone}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="text-sm text-foreground">{order.customer_address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order status */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Order Status
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {order.is_paid ? (
                              <>
                                <CreditCard className="h-4 w-4 text-green-600" />
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                  Paid
                                </span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4 text-amber-600" />
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                  Payment Pending
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Order Total
                        </h3>
                        <p className="font-heading text-2xl font-bold text-foreground">
                          CHF {Number(order.total).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Order items */}
                    {orderItems[order.id] && orderItems[order.id].length > 0 && (
                      <div className="mt-6 border-t border-border pt-6">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Items ({orderItems[order.id].length})
                        </h3>
                        <div className="space-y-2">
                          {orderItems[order.id].map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{item.product_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity} • Ships in: {item.shipping_time}
                                </p>
                              </div>
                              <p className="font-semibold text-foreground">
                                CHF {Number(item.price).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">No orders found</h3>
              <p className="text-sm text-muted-foreground">
                {searchType === "phone"
                  ? "We couldn't find any orders with this phone number. Try searching by order number instead."
                  : "We couldn't find an order with this number. Please check and try again."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Payment Instructions Modal */}
      {showPaymentModal && selectedOrder && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">Payment Instructions</h2>
                  <p className="text-sm text-muted-foreground">Order #{selectedOrder.order_number}</p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6 p-6">
                {/* Payment status */}
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
                  {selectedOrder.is_paid ? (
                    <>
                      <div className="rounded-full bg-green-100 p-2">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Payment Confirmed</p>
                        <p className="text-sm text-muted-foreground">Your order has been paid</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-amber-100 p-2">
                        <Clock className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Payment Pending</p>
                        <p className="text-sm text-muted-foreground">Please complete payment to proceed with your order</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Payment methods */}
                <div>
                  <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Payment Methods</h3>
                  <div className="space-y-4">
                    {/* TWINT */}
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-foreground">TWINT</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Send payment to: <span className="font-mono font-semibold text-foreground">+41 78 251 47 68</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Include order number #{selectedOrder.order_number} in the payment message.
                      </p>
                    </div>

                    {/* IBAN */}
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-foreground">Bank Transfer (Min. CHF 10.00)</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        IBAN: <span className="font-mono font-semibold text-foreground">CH15 0021 5215 3188 4640 F</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Include order number #{selectedOrder.order_number} in the payment reference.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order total */}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total Amount</span>
                    <span className="font-heading text-2xl font-bold text-primary">
                      CHF {Number(selectedOrder.total).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* View full order details */}
                <div className="flex justify-center border-t border-border pt-4">
                  <Link
                    href={`/order-success?id=${selectedOrder.order_number}`}
                    onClick={() => setShowPaymentModal(false)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    View Full Order Details
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
