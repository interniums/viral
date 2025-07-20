'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { TrendingUp, BarChart3, Globe, Zap } from 'lucide-react'
import TrendingCard from '../components/TrendingCard'
import StatsCard from '../components/StatsCard'
import PlatformFilter from '../components/PlatformFilter'
import TopicFilter from '../components/TopicFilter'
import SortFilter from '../components/SortFilter'
import { Topic, Stats } from '../types'

// Constants
const DEFAULT_PLATFORMS = ['Reddit', 'YouTube', 'News', 'Instagram', 'Facebook', 'Telegram']
const INITIAL_DISPLAY_COUNT = 50
const LOAD_MORE_INCREMENT = 50
const SCROLL_THRESHOLD = 300
const UPDATE_INTERVAL = 300000 // 5 minutes
const DB_CHECK_INTERVAL = 60000 // 1 minute

// Loading skeleton components
const StatsSkeleton = () => (
  <div className="card p-6 border-2 bg-white">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 rounded w-20 mb-2 animate-pulse bg-gray-200"></div>
        <div className="h-8 rounded w-16 animate-pulse bg-gray-200"></div>
      </div>
      <div className="w-6 h-6 rounded animate-pulse bg-gray-200"></div>
    </div>
  </div>
)

const TrendingCardSkeleton = ({ index }: { index: number }) => (
  <div key={`skeleton-${index}`} className="trending-card bg-white">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded animate-pulse bg-gray-200"></div>
        <div className="w-16 h-6 rounded animate-pulse bg-gray-200"></div>
      </div>
      <div className="w-20 h-6 rounded animate-pulse bg-gray-200"></div>
    </div>
    <div className="h-6 rounded mb-2 animate-pulse bg-gray-200"></div>
    <div className="h-4 rounded mb-2 animate-pulse bg-gray-200"></div>
    <div className="h-4 rounded mb-4 w-3/4 animate-pulse bg-gray-200"></div>
    <div className="flex items-center justify-between">
      <div className="w-16 h-4 rounded animate-pulse bg-gray-200"></div>
      <div className="w-12 h-4 rounded animate-pulse bg-gray-200"></div>
    </div>
  </div>
)

export default function Home() {
  // State management
  const [topics, setTopics] = useState<Topic[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(DEFAULT_PLATFORMS)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedSort, setSelectedSort] = useState<string>('random')
  const [selectedOrder, setSelectedOrder] = useState<string>('desc')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [lastDbUpdate, setLastDbUpdate] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT)
  const [showLoadMore, setShowLoadMore] = useState(true)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  // Grab scrolling functionality
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(false)
  const statsContainerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!statsContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - statsContainerRef.current.offsetLeft)
    setScrollLeft(statsContainerRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !statsContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - statsContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    statsContainerRef.current.scrollLeft = scrollLeft - walk
  }

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!statsContainerRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - statsContainerRef.current.offsetLeft)
    setScrollLeft(statsContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !statsContainerRef.current) return
    e.preventDefault()
    const x = e.touches[0].pageX - statsContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    statsContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleScroll = () => {
    if (statsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = statsContainerRef.current
      setShowLeftFade(scrollLeft > 0)
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  // Check fade state on mount and resize
  useEffect(() => {
    handleScroll()
    window.addEventListener('resize', handleScroll)
    return () => window.removeEventListener('resize', handleScroll)
  }, [])

  // API fetch functions
  const fetchAllTrendingTopics = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch(`/api/trending/all?sort=${selectedSort}&order=${selectedOrder}`)
      const data = await response.json()

      if (data.success) {
        setTopics(data.topics)
        setLastUpdate(new Date())
      } else {
        setError(data.error || 'Failed to fetch trending topics')
      }
    } catch (error) {
      setError('Network error while fetching trending topics')
      console.error('❌ Error fetching all trending topics:', error)
    }
  }, [selectedSort, selectedOrder])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/stats', {
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      })
      const data = await response.json()
      if (data.success) {
        setStats(data)
      } else {
        console.error('❌ Stats API returned error:', data.error)
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error)
    }
  }, [])

  const fetchLastUpdate = useCallback(async () => {
    try {
      const response = await fetch('/api/last-update', {
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      })
      const data = await response.json()
      if (data.success) {
        setLastDbUpdate(data.last_update)
      }
    } catch (error) {
      console.error('Error fetching last update:', error)
    }
  }, [])

  // Computed values
  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const platformMatch =
        selectedPlatforms.length === 0 ||
        selectedPlatforms.some((platform) => topic.platform.toLowerCase() === platform.toLowerCase())
      const topicMatch = selectedTopics.length === 0 || selectedTopics.some((topicName) => topic.topic === topicName)
      return platformMatch && topicMatch
    })
  }, [topics, selectedPlatforms, selectedTopics])

  const displayedTopics = useMemo(() => filteredTopics.slice(0, displayCount), [filteredTopics, displayCount])

  const hasMoreTopics = useMemo(() => filteredTopics.length > displayCount, [filteredTopics.length, displayCount])

  // Event handlers
  const handleInitialLoad = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([fetchAllTrendingTopics(), fetchStats(), fetchLastUpdate()])
    } catch (error) {
      setError('Failed to load initial data')
    } finally {
      setLoading(false)
    }
  }, [fetchAllTrendingTopics, fetchStats, fetchLastUpdate])

  const handleLoadMore = useCallback(() => {
    const newCount = Math.min(displayCount + LOAD_MORE_INCREMENT, filteredTopics.length)
    setDisplayCount(newCount)
    setShowLoadMore(newCount < filteredTopics.length)
  }, [displayCount, filteredTopics.length])

  const handlePlatformChange = useCallback((platforms: string[]) => {
    setSelectedPlatforms(platforms)
    setDisplayCount(INITIAL_DISPLAY_COUNT)
    setShowLoadMore(true)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSelectedSort(sort)
    setDisplayCount(INITIAL_DISPLAY_COUNT)
    setShowLoadMore(true)
  }, [])

  const handleOrderChange = useCallback((order: string) => {
    setSelectedOrder(order)
    setDisplayCount(INITIAL_DISPLAY_COUNT)
    setShowLoadMore(true)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Effects
  useEffect(() => {
    handleInitialLoad()

    const interval = setInterval(fetchAllTrendingTopics, UPDATE_INTERVAL)
    const dbUpdateInterval = setInterval(async () => {
      try {
        await fetchLastUpdate()
        if (lastDbUpdate) {
          const savedLastDbUpdate = localStorage.getItem('viral_last_db_update')
          if (!savedLastDbUpdate || savedLastDbUpdate !== lastDbUpdate) {
            localStorage.setItem('viral_last_db_update', lastDbUpdate)
            await Promise.all([fetchAllTrendingTopics(), fetchStats()])
          }
        }
      } catch (error) {
        console.error('Error checking for database updates:', error)
      }
    }, DB_CHECK_INTERVAL)

    return () => {
      clearInterval(interval)
      clearInterval(dbUpdateInterval)
    }
  }, [handleInitialLoad, fetchAllTrendingTopics, fetchLastUpdate, fetchStats, lastDbUpdate])

  useEffect(() => {
    if (topics.length > 0) {
      fetchAllTrendingTopics()
    }
  }, [selectedSort, selectedOrder, fetchAllTrendingTopics])

  useEffect(() => {
    if (topics.length > 0 && selectedTopics.length === 0) {
      const allAvailableTopics = Array.from(new Set(topics.map((topic) => topic.topic))).filter(
        (topic) => topic && topic !== ''
      )
      setSelectedTopics(allAvailableTopics)
    }
  }, [topics])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowScrollToTop(scrollTop > SCROLL_THRESHOLD)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Home') {
        event.preventDefault()
        scrollToTop()
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [scrollToTop])

  // Render helpers
  const renderStatsCards = () => {
    if (loading) {
      return Array.from({ length: 7 }).map((_, index) => <StatsSkeleton key={index} />)
    }

    const platformStats = [
      {
        title: 'Total Topics (7d)',
        value: stats?.total_topics_7d || 0,
        icon: <Globe className="w-6 h-6" />,
        color: 'blue' as const,
      },
      {
        title: 'Reddit Topics',
        value: stats?.platform_stats?.Reddit || 0,
        icon: <span>🔴</span>,
        color: 'orange' as const,
      },
      {
        title: 'News Articles',
        value: stats?.platform_stats?.News || 0,
        icon: <span>📰</span>,
        color: 'green' as const,
      },
      {
        title: 'YouTube Videos',
        value: stats?.platform_stats?.YouTube || 0,
        icon: <span>📺</span>,
        color: 'red' as const,
      },
      {
        title: 'Instagram Posts',
        value: stats?.platform_stats?.Instagram || 0,
        icon: <span>📸</span>,
        color: 'purple' as const,
      },
      {
        title: 'Facebook Posts',
        value: stats?.platform_stats?.Facebook || 0,
        icon: <span>📘</span>,
        color: 'blue' as const,
      },
      {
        title: 'Telegram Posts',
        value: stats?.platform_stats?.Telegram || 0,
        icon: <span>📱</span>,
        color: 'green' as const,
      },
    ]

    return platformStats.map((stat, index) => (
      <StatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
    ))
  }

  const renderTrendingCards = () => {
    if (loading) {
      return Array.from({ length: 12 }).map((_, index) => <TrendingCardSkeleton key={index} index={index} />)
    }

    return displayedTopics.map((topic, index) => (
      <TrendingCard key={`${topic.platform}-${index}`} topic={topic} rank={index + 1} />
    ))
  }

  const renderTopicsCount = () => {
    if (loading) return <p className="text-gray-600">Loading trending topics...</p>

    return (
      <p className="text-gray-600">
        Showing {Math.min(displayCount, filteredTopics.length)} of {filteredTopics.length} trending topics
        {selectedPlatforms.length > 0 && ` from ${selectedPlatforms.map((p) => p.toLowerCase()).join(', ')}`}
        {selectedTopics.length > 0 && ` in ${selectedTopics.map((t) => t).join(', ')}`}
        {selectedSort !== 'random' && ` sorted by ${selectedSort}`}
        {selectedOrder === 'desc' ? ' (descending)' : ' (ascending)'}
      </p>
    )
  }

  const renderEmptyState = () => {
    if (loading || filteredTopics.length > 0) return null

    return (
      <div className="text-center py-12">
        <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No trending topics found</h3>
        <p className="text-gray-500">
          {selectedPlatforms.length === 0
            ? 'Try refreshing to get the latest trending topics.'
            : `No trending topics found for ${selectedPlatforms
                .map((p) => p.toLowerCase())
                .join(', ')}. Try selecting a different platform.`}
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <TrendingUp className="w-12 h-12 text-primary-600 mr-3" />
          <h1 className="text-4xl font-bold text-gradient">Viral Trending Topics</h1>
        </div>
        <p className="text-xl text-gray-600 mb-6">
          Real-time trending topics from Reddit, News, and other social platforms
        </p>
        <div className="flex items-center justify-center text-sm text-gray-500">
          {lastDbUpdate ? <>Last database update: {new Date(lastDbUpdate).toLocaleTimeString()}</> : <>Loading...</>}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="mb-8 relative">
        <div
          ref={statsContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onScroll={handleScroll}
          className={`flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 cursor-grab active:cursor-grabbing select-none transition-opacity duration-200 ${
            isDragging ? 'opacity-90' : 'opacity-100'
          }`}
        >
          {renderStatsCards()}
        </div>
        {/* Gradient fade indicators - only show when needed */}
        {showLeftFade && (
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
        )}
        {showRightFade && (
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
        )}
      </div>

      {/* Filters Section */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PlatformFilter
            selectedPlatforms={selectedPlatforms}
            onPlatformChange={handlePlatformChange}
            topics={topics}
            stats={stats || undefined}
          />
          <TopicFilter
            selectedTopics={selectedTopics}
            onTopicChange={setSelectedTopics}
            selectedPlatforms={selectedPlatforms}
            allTopics={topics}
          />
        </div>
      </div>

      {/* Cards Container with Sort Filter */}
      <div className="relative pt-16 sm:pt-20">
        <div className="absolute top-0 right-0 z-10">
          <SortFilter
            selectedSort={selectedSort}
            onSortChange={handleSortChange}
            selectedOrder={selectedOrder}
            onOrderChange={handleOrderChange}
          />
        </div>

        <div className="mb-4">{renderTopicsCount()}</div>

        <div className="trending-grid">{renderTrendingCards()}</div>

        {showLoadMore && hasMoreTopics && (
          <div className="text-center mt-8">
            <button onClick={handleLoadMore} className="btn-load-more text-lg">
              Load More ({filteredTopics.length - displayCount} more)
            </button>
          </div>
        )}

        {!showLoadMore && filteredTopics.length > 0 && (
          <div className="text-center mt-8 text-gray-600">
            <p>Showing all {filteredTopics.length} trending topics</p>
          </div>
        )}

        {renderEmptyState()}
      </div>

      {/* Scroll to Top Button */}
      <div
        className={`fixed bottom-8 right-8 transition-all duration-300 ease-in-out z-50 ${
          showScrollToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
