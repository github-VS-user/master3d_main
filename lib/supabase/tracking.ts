import { createClient } from '@supabase/supabase-js'

// Tracking database client (separate from main store database)
export function createTrackingClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_TRACKING_SUPABASE_URL || 'https://qvitarpphweoqfimmabu.supabase.co'
  const supabaseKey = process.env.TRACKING_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2aXRhcnBwaHdlb3FmaW1tYWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTYwNzQsImV4cCI6MjA4NTUzMjA3NH0.-5I-0qBOyzjxZmh8uEZb7gri8bW5Nga7Z7D6Hb4Au6k'

  return createClient(supabaseUrl, supabaseKey)
}
