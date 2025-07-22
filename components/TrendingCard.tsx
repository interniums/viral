import { useState, useEffect } from 'react'
import { ExternalLink, TrendingUp, Clock, User } from 'lucide-react'
import { TrendingCardProps } from '../types'
import PlatformIcon from './PlatformIcon'

export default function TrendingCard({ topic, rank, className = '', style }: TrendingCardProps) {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'reddit':
        return 'platform-reddit'
      // case 'twitter':
      //   return 'platform-twitter'
      case 'google trends':
        return 'platform-google-trends'
      case 'youtube':
        return 'platform-youtube'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreClass = (score: number) => {
    if (score >= 10000) return 'score-high'
    if (score >= 1000) return 'score-medium'
    return 'score-low'
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  // Client-side only time formatting to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatTimeClient = (timestamp: string) => {
    if (!mounted) return 'Loading...'
    return formatTime(timestamp)
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const handleCardClick = () => {
    if (topic.url) {
      window.open(topic.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className={`trending-card group cursor-pointer ${className}`}
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
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-600">#{rank}</span>
          <div className="flex items-center space-x-2">
            <PlatformIcon platform={topic.platform} className="w-4 h-4" />
            <span className={`platform-badge ${getPlatformColor(topic.platform)}`}>{topic.platform}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`viral-score ${getScoreClass(topic.engagement)}`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {topic.engagement.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {truncateText(topic.title, 80)}
      </h3>

      {/* Description */}
      {topic.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{truncateText(topic.description, 120)}</p>
      )}

      {/* Topic Badge */}
      {topic.topic && topic.topic !== 'general' && (
        <div className="mb-3">
          <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full capitalize">
            {topic.topic}
          </span>
        </div>
      )}

      {/* Tags */}
      {topic.tags && topic.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {topic.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
          {topic.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">+{topic.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Author */}
      {topic.author && (
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <User className="w-4 h-4 mr-1" />
          <span className="truncate">{topic.author}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {formatTimeClient(topic.timestamp)}
        </div>
        <div className="flex items-center text-primary-600 group-hover:text-primary-700 transition-colors">
          <ExternalLink className="w-4 h-4 mr-1" />
          View
        </div>
      </div>
    </div>
  )
}
