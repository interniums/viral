import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface TrendingTopic {
  id?: number
  platform: string
  title: string
  description?: string
  url?: string
  score?: number
  engagement?: number
  timestamp?: string
  category?: string
  tags?: string[]
  topic?: string
  author?: string
  created_at?: string
}

export interface DatabaseStats {
  total_topics: number
  platforms: Record<string, number>
  categories: Record<string, number>
  last_update: string
}
