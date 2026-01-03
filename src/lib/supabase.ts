import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create client only if env vars are set
export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export const isSupabaseConfigured = () => Boolean(supabase)

// Types for our database
export interface WaitlistEntry {
  id: string
  email: string
  created_at: string
  source?: string
}

export interface CanvasRecord {
  id: string
  user_id?: string
  name: string
  data: object
  created_at: string
  updated_at: string
}

