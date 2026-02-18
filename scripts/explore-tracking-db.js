import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qvitarpphweoqfimmabu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2aXRhcnBwaHdlb3FmaW1tYWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTYwNzQsImV4cCI6MjA4NTUzMjA3NH0.-5I-0qBOyzjxZmh8uEZb7gri8bW5Nga7Z7D6Hb4Au6k'

const tracking = createClient(supabaseUrl, supabaseKey)

console.log('Exploring tracking database...')

// Try to list all tables by querying a common table
const { data, error } = await tracking
  .from('orders')
  .select('*')
  .limit(1)

if (error) {
  console.log('Error querying orders table:', error.message)
  console.log('This helps us understand what tables exist')
} else {
  console.log('Sample order data:', data)
  if (data && data[0]) {
    console.log('Table columns:', Object.keys(data[0]))
  }
}
