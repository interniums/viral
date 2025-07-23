import {
  ExternalLink,
  TrendingUp,
  Clock,
  User,
  MessageCircle,
  Eye,
  ThumbsUp,
  Star,
  GitFork,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Heart,
  Share,
  PlayCircle,
} from 'lucide-react'
import { Platform } from '@/lib/constants/enums'
import { TrendingCardProps } from '@/types'
import PlatformIcon from './PlatformIcon'
import { getPlatformByKey } from '@/lib/constants/platforms'
import { TOPICS } from '@/lib/constants/topics'

export function TrendingCardSkeleton() {
  return (
    <div className="trending-card-new">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gray-200 animate-pulse" />
          <div className="w-6 h-6 rounded bg-gray-200 animate-pulse" />
          <div className="h-6 w-28 rounded-full bg-gray-200 animate-pulse" />
        </div>
        <div className="w-8 h-8 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="space-y-2 mb-3">
        <div className="h-6 w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse mb-3" />

      <div className="flex items-center gap-4 mb-3">
        <div className="h-5 w-20 rounded bg-gray-200 animate-pulse" />
        <div className="h-5 w-16 rounded bg-gray-200 animate-pulse" />
        <div className="h-5 w-18 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <div className="h-5 w-18 rounded bg-gray-200 animate-pulse" />
        <div className="h-5 w-22 rounded bg-gray-200 animate-pulse" />
        <div className="h-5 w-16 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  )
}

import { memo } from 'react'

const TrendingCard = memo(function TrendingCard({ topic, rank, className = '', style }: TrendingCardProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days}d ago`
    }
    if (hours > 0) {
      return `${hours}h ago`
    }
    return 'Just now'
  }

  const handleCardClick = () => {
    if (topic.url) {
      window.open(topic.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (topic.url) {
      window.open(topic.url, '_blank', 'noopener,noreferrer')
    }
  }

  const platform = getPlatformByKey(topic.platform)
  const topicData = TOPICS.find((t) => t.key === topic.topic)

  // Calculate viral score (combination of score and engagement)
  // For CoinGecko, engagement is price change percentage, so we need different calculation
  let viralScore: number
  if (topic.platform === Platform.CoinGecko) {
    // For CoinGecko: score is market cap based, engagement is price change %
    // Use score directly as it's already calculated well, add volatility bonus
    const volatilityBonus = Math.abs(topic.engagement || 0) * 2 // Higher volatility = higher viral score
    viralScore = Math.min(99, Math.max(1, Math.round((topic.score || 1) / 1000 + volatilityBonus)))
  } else {
    // For other platforms: traditional calculation
    viralScore = Math.min(99, Math.max(1, Math.round((topic.score + topic.engagement) / 100)))
  }

  // Get platform color classes
  const getPlatformBadgeClasses = (platformKey: Platform) => {
    switch (platformKey) {
      case Platform.GoogleTrends:
        return 'bg-orange-100 text-orange-800 border border-orange-200'
      case Platform.Reddit:
        return 'bg-orange-100 text-orange-800 border border-orange-200'
      case Platform.YouTube:
        return 'bg-red-100 text-red-800 border border-red-200'
      case Platform.GitHub:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
      case Platform.Twitch:
        return 'bg-purple-100 text-purple-800 border border-purple-200'
      case Platform.ProductHunt:
        return 'bg-red-100 text-red-800 border border-red-200'
      case Platform.Mastodon:
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case Platform.GNews:
        return 'bg-green-100 text-green-800 border border-green-200'
      case Platform.CoinGecko:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case Platform.DevTo:
        return 'bg-purple-100 text-purple-800 border border-purple-200'
      case Platform.Steam:
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case Platform.TheGuardian:
        return 'bg-orange-100 text-orange-800 border border-orange-200'
      case Platform.Binance:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case Platform.HackerNews:
        return 'bg-orange-100 text-orange-800 border border-orange-200'
      case Platform.StackOverflow:
        return 'bg-orange-100 text-orange-800 border border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  // Get topic color classes
  const getTopicBadgeClasses = (topicKey: string) => {
    const topic = TOPICS.find((t) => t.key === topicKey)
    if (!topic) return 'bg-gray-100 text-gray-700 border border-gray-200'

    switch (topic.color) {
      case 'blue':
        return 'bg-blue-100 text-blue-700 border border-blue-200'
      case 'purple':
        return 'bg-purple-100 text-purple-700 border border-purple-200'
      case 'pink':
        return 'bg-pink-100 text-pink-700 border border-pink-200'
      case 'green':
        return 'bg-green-100 text-green-700 border border-green-200'
      case 'yellow':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
      case 'red':
        return 'bg-red-100 text-red-700 border border-red-200'
      case 'orange':
        return 'bg-orange-100 text-orange-700 border border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }

  // Get platform-specific metrics
  const renderPlatformMetrics = () => {
    switch (topic.platform) {
      case Platform.YouTube:
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(topic.engagement)} views</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(topic.score)} likes</span>
            </div>
          </div>
        )
      case Platform.Reddit:
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-700">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(topic.score)} upvotes</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(topic.engagement)} comments</span>
            </div>
          </div>
        )
      case Platform.GitHub:
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(topic.score)} stars</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <GitFork className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(topic.engagement)} forks</span>
            </div>
          </div>
        )
      case Platform.Twitch:
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(topic.engagement)} viewers</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <PlayCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        )
      case Platform.ProductHunt:
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-700">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(topic.score)} upvotes</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(topic.engagement)} comments</span>
            </div>
          </div>
        )
      case Platform.Binance:
        // Extract percentage from title for Binance (e.g., "BTCUSDT 2.50%")
        const percentageMatch = topic.title.match(/([-+]?\d+\.?\d*)%/)
        const priceChange = percentageMatch ? parseFloat(percentageMatch[1]) : 0
        const isPositive = priceChange >= 0
        return (
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(priceChange)}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">24h change</span>
            </div>
          </div>
        )
      case Platform.CoinGecko:
        const geckoChange = topic.engagement || 0
        const isGeckoPositive = geckoChange >= 0
        const changeValue = isNaN(geckoChange) ? 0 : geckoChange
        return (
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 ${isGeckoPositive ? 'text-green-700' : 'text-red-700'}`}>
              {isGeckoPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(changeValue)}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">24h change</span>
            </div>
          </div>
        )
      case Platform.GoogleTrends:
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Trending search</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Popular</span>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(topic.score)} points</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(topic.engagement)} interactions</span>
            </div>
          </div>
        )
    }
  }

  return (
    <div
      className={`trending-card-new group cursor-pointer ${className}`}
      style={style}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      {/* Header with rank, platform icon, platform badge, and viral score */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Rank number with blue styling */}
          <div className="text-xl font-bold text-blue-600">#{rank}</div>

          {/* Platform icon */}
          <PlatformIcon platform={topic.platform} size={24} />

          {/* Platform badge */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPlatformBadgeClasses(
              topic.platform
            )}`}
          >
            {platform?.label || topic.platform}
          </span>
        </div>

        {/* Viral score */}
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">~{viralScore}</div>
          <div className="text-xs text-gray-500 font-medium">viral score</div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">{topic.title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{topic.description}</p>

      {/* Topic category tag */}
      {topicData && (
        <div className="mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTopicBadgeClasses(
              topic.topic
            )}`}
          >
            {topicData.icon} {topicData.label}
          </span>
        </div>
      )}

      {/* Platform-specific metrics */}
      <div className="mb-3">{renderPlatformMetrics()}</div>

      {/* Hashtags */}
      {topic.tags && topic.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {topic.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer with source, timestamp, and view link */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span className="font-medium">{platform?.label || topic.platform}</span>
          <Clock className="w-4 h-4 ml-1" />
          <span>{formatTimestamp(topic.timestamp)}</span>
        </div>

        <button
          onClick={handleViewClick}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-blue-50"
        >
          <ExternalLink className="w-4 h-4" />
          View
        </button>
      </div>
    </div>
  )
})

export default TrendingCard
