import { createClient } from "@/lib/supabase/server"
import { AdminTrackingClient } from "@/components/admin-tracking-client"

export default async function AdminTrackingPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from("tracking_orders")
    .select("*")
    .order("created_at", { ascending: false })

  return <AdminTrackingClient initialOrders={orders || []} />
}
