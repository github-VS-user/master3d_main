"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"

const ADMIN_PASSWORD_KEY = "admin_authenticated"

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const isAuth = sessionStorage.getItem(ADMIN_PASSWORD_KEY) === "true"
    setAuthenticated(isAuth)
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Check against ADMIN_PSW environment variable
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PSW || "admin123"
    
    if (password === adminPassword) {
      sessionStorage.setItem(ADMIN_PASSWORD_KEY, "true")
      setAuthenticated(true)
      router.refresh()
    } else {
      setError("Incorrect password")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
          <div>
            <h2 className="text-center text-3xl font-bold tracking-tight">Admin Login</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">Enter admin password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <AdminSidebar>{children}</AdminSidebar>
}
