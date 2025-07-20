export interface Topic {
  platform: string
  title: string
  description: string
  url: string
  score: number
  engagement: number
  category: string
  tags: string[]
  timestamp: string
  topic: string
}

export interface Stats {
  platform_stats: {
    [key: string]: number
  }
  category_stats: {
    [key: string]: number
  }
  total_topics_7d: number
}

export interface TrendingCardProps {
  topic: Topic
  rank: number
}

export interface StatsCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple'
}

export interface PlatformFilterProps {
  selectedPlatform: string
  onPlatformChange: (platform: string) => void
  topics: Topic[]
  stats?: Stats
}
