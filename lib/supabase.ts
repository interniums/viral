import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from './config'

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)

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
  total_topics_7d: number
  total_topics_all_time: number
  platform_stats: Record<string, number>
  category_stats: Record<string, number>
}
