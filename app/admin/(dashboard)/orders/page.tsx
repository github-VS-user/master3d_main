import { createClient } from "@/lib/supabase/server"
import { AdminOrdersClient } from "@/components/admin-orders-client"

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  // Fetch all order items
  const orderIds = orders?.map((o) => o.id) || []
  const { data: allItems } = orderIds.length > 0
    ? await supabase.from("order_items").select("*").in("order_id", orderIds)
    : { data: [] }

  return <AdminOrdersClient initialOrders={orders || []} allItems={allItems || []} />
}
