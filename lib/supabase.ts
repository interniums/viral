import { createClient } from '@supabase/supabase-js'
import { Platform, Topic } from './constants/enums'

// Database types
export interface TrendingTopic {
  id?: number
  platform: Platform
  title: string
  description?: string
  url?: string
  score?: number
  engagement?: number
  timestamp?: string
  category?: string
  tags?: string[]
  topic?: Topic
  author?: string
  created_at?: string
}

export interface DatabaseStats {
  total_topics_7d: number
  total_topics_all_time: number
  platform_stats: Record<Platform, number>
  category_stats: Record<Topic, number>
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)
