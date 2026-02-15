import { createClient } from "@/lib/supabase/server"
import { Package, ShoppingBag, DollarSign, Clock } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  const totalOrders = orders?.length || 0
  const paidOrders = orders?.filter((o) => o.is_paid).length || 0
  const pendingOrders = totalOrders - paidOrders
  const totalRevenue = orders?.filter((o) => o.is_paid).reduce((sum, o) => sum + Number(o.total), 0) || 0

  const stats = [
    { label: "Total Products", value: productCount || 0, icon: Package, href: "/admin/products" },
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Pending Payment", value: pendingOrders, icon: Clock, href: "/admin/orders" },
    { label: "Revenue (Paid)", value: `CHF ${totalRevenue.toFixed(2)}`, icon: DollarSign, href: "/admin/orders" },
  ]

  const recentOrders = orders?.slice(0, 5) || []

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Overview of your Master 3D store</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-2 font-heading text-2xl font-bold text-card-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-primary hover:text-primary/80">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card">
          {recentOrders.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-sm font-medium text-card-foreground">
                      {"#"}
                      {order.order_number}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{order.customer_name}</td>
                    <td className="px-4 py-3 text-sm font-medium text-card-foreground">
                      {"CHF "}
                      {Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.is_paid
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.is_paid ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
