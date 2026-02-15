import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar userEmail={user.email || ""} />
      <main className="flex-1 overflow-auto bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
