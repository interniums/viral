export interface Topic {
  platform: string
  title: string
  description: string
  url: string
  score: number
  engagement: number
  category: string
  tags: string[]
  topic: string
  author: string
  timestamp: string
}

export interface Stats {
  platform_stats: { [key: string]: number }
  category_stats: { [key: string]: number }
  total_topics_7d: number
  total_topics_all_time: number
}

export interface PlatformFilterProps {
  selectedPlatforms: string[]
  onPlatformChange: (platforms: string[]) => void
  topics: Topic[]
  stats?: Stats
  loading?: boolean
}

export interface TopicFilterProps {
  selectedTopics: string[]
  onTopicChange: (topics: string[]) => void
  selectedPlatforms: string[]
  allTopics: Topic[]
  loading?: boolean
}

export interface TrendingCardProps {
  topic: Topic
  rank: number
  className?: string
  style?: React.CSSProperties
}

export interface StatsCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple'
  className?: string
}

export interface SortFilterProps {
  selectedSort: string
  onSortChange: (sort: string) => void
  selectedOrder: string
  onOrderChange: (order: string) => void
}
