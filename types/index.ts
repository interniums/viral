import { Platform, Topic, PlatformCategory, TopicCategory } from '@/lib/constants/enums'

export interface TrendingTopic {
  id?: string
  platform: Platform
  title: string
  description: string
  url: string
  score: number
  engagement: number
  timestamp: string
  category: string
  topic: Topic
  tags: string[]
  author: string
  created_at?: string
}

export interface Stats {
  total_topics_7d: number
  total_topics_all_time: number
  platform_stats: Record<Platform, number>
  category_stats: Record<Topic, number>
}

export interface PlatformFilterProps {
  selectedPlatforms: Platform[]
  onPlatformChange: (platforms: Platform[]) => void
  topics: TrendingTopic[]
  stats?: Stats
  loading?: boolean
  selectedTopics?: Topic[] // Add selectedTopics for dynamic counting
}

export interface TopicFilterProps {
  selectedTopics: Topic[]
  onTopicChange: (topics: Topic[]) => void
  selectedPlatforms?: Platform[]
  allTopics?: TrendingTopic[]
  stats?: Stats
  loading?: boolean
}

export interface SortFilterProps {
  selectedSort: string
  onSortChange: (sort: string) => void
  selectedOrder: string
  onOrderChange: (order: string) => void
}

export interface TrendingCardProps {
  topic: TrendingTopic
  rank: number
  className?: string
  style?: React.CSSProperties
}

export interface StatsCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray'
  className?: string
}

export interface PlatformIconProps {
  platform: Platform
  size?: number
  className?: string
}
