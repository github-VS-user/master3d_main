import { createClient } from "@/lib/supabase/server"
import { Package, ShoppingBag, DollarSign, Clock, TrendingUp, Star, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  const { data: products } = await supabase
    .from("products")
    .select("*")

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  const totalOrders = orders?.length || 0
  const paidOrders = orders?.filter((o) => o.is_paid).length || 0
  const pendingOrders = totalOrders - paidOrders
  const totalRevenue = orders?.filter((o) => o.is_paid).reduce((sum, o) => sum + Number(o.total), 0) || 0
  const avgOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0
  const featuredProducts = products?.filter((p) => p.featured).length || 0

  const stats = [
    { 
      label: "Total Products", 
      value: productCount || 0, 
      icon: Package, 
      href: "/admin/products",
      subtext: `${featuredProducts} featured`,
      color: "text-blue-600"
    },
    { 
      label: "Total Orders", 
      value: totalOrders, 
      icon: ShoppingBag, 
      href: "/admin/orders",
      subtext: `${paidOrders} completed`,
      color: "text-green-600"
    },
    { 
      label: "Pending Payment", 
      value: pendingOrders, 
      icon: Clock, 
      href: "/admin/orders",
      subtext: pendingOrders > 0 ? "Requires attention" : "All up to date",
      color: "text-amber-600"
    },
    { 
      label: "Total Revenue", 
      value: `CHF ${totalRevenue.toFixed(2)}`, 
      icon: DollarSign, 
      href: "/admin/orders",
      subtext: `Avg: CHF ${avgOrderValue.toFixed(2)}`,
      color: "text-primary"
    },
  ]

  const recentOrders = orders?.slice(0, 5) || []

  // Quick stats for additional insights
  const today = new Date()
  const todayOrders = orders?.filter(o => {
    const orderDate = new Date(o.created_at)
    return orderDate.toDateString() === today.toDateString()
  }).length || 0

  return (
    <div className="space-y-8">
      {/* Header with welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1.5 text-muted-foreground">Welcome back! Here's what's happening with Master 3D today.</p>
        </div>
        {todayOrders > 0 && (
          <div className="hidden rounded-lg border border-border bg-card px-4 py-2.5 md:block">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-foreground">{todayOrders}</span>
              <span className="text-muted-foreground">{todayOrders === 1 ? 'order' : 'orders'} today</span>
            </div>
          </div>
        )}
      </div>

      {/* Main stats grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="font-heading text-3xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </div>
              <div className={`rounded-lg bg-muted p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/products"
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80"
        >
          <div className="rounded-full bg-primary/10 p-2">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Manage Products</p>
            <p className="text-xs text-muted-foreground">Add or edit your catalog</p>
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80"
        >
          <div className="rounded-full bg-green-100 p-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Process Orders</p>
            <p className="text-xs text-muted-foreground">View and update orders</p>
          </div>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80"
        >
          <div className="rounded-full bg-blue-100 p-2">
            <Star className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">View Store</p>
            <p className="text-xs text-muted-foreground">See your live storefront</p>
          </div>
        </Link>
      </div>

      {/* Alerts for pending orders */}
      {pendingOrders > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900">Payment Pending</h3>
              <p className="mt-1 text-sm text-amber-700">
                You have {pendingOrders} {pendingOrders === 1 ? 'order' : 'orders'} waiting for payment confirmation. 
                <Link href="/admin/orders" className="ml-1 font-medium underline">
                  Review now
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent orders table */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-foreground">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
            View all orders →
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {recentOrders.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-semibold text-card-foreground">
                      #{order.order_number}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-card-foreground">
                      CHF {Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          order.is_paid
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.is_paid ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {order.is_paid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('en-CH', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">No orders yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Orders will appear here once customers start purchasing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
