import { createClient } from "@/lib/supabase/server"
import { AdminProductsClient } from "@/components/admin-products-client"

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  return <AdminProductsClient initialProducts={products || []} />
}
