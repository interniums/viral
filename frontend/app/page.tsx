'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { TrendingUp, BarChart3, Globe, Zap } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/scrollbar'
import TrendingCard from '../components/TrendingCard'
import StatsCard from '../components/StatsCard'
import PlatformFilter from '../components/PlatformFilter'
import TopicFilter from '../components/TopicFilter'
import SortFilter from '../components/SortFilter'
import PlatformIcon from '../components/PlatformIcon'
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
  <div
    className="card p-6 border-2 min-w-[200px] flex-shrink-0 bg-gray-50 border-gray-200 mr-4"
    style={{ minHeight: '120px' }}
  >
    <div className="flex items-center justify-between h-full">
      <div>
        <div className="h-4 rounded w-20 mb-2 animate-pulse bg-gray-200"></div>
        <div className="h-8 rounded w-16 animate-pulse bg-gray-200"></div>
      </div>
      <div className="w-6 h-6 rounded animate-pulse bg-gray-200"></div>
    </div>
  </div>
)

const TrendingCardSkeleton = ({
  index,
  className = '',
  style,
}: {
  index: number
  className?: string
  style?: React.CSSProperties
}) => (
  <div
    key={`skeleton-${index}`}
    className={`trending-card bg-white ${className}`}
    style={{ minHeight: '280px', ...style }}
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded animate-pulse bg-gray-200"></div>
        <div className="w-16 h-6 rounded animate-pulse bg-gray-200"></div>
      </div>
      <div className="w-20 h-6 rounded animate-pulse bg-gray-200"></div>
    </div>

    {/* Title */}
    <div className="h-6 rounded mb-2 animate-pulse bg-gray-200"></div>
    <div className="h-6 rounded mb-2 animate-pulse bg-gray-200 w-4/5"></div>

    {/* Description */}
    <div className="h-4 rounded mb-2 animate-pulse bg-gray-200"></div>
    <div className="h-4 rounded mb-2 animate-pulse bg-gray-200"></div>
    <div className="h-4 rounded mb-4 w-3/4 animate-pulse bg-gray-200"></div>

    {/* Topic Badge */}
    <div className="w-16 h-6 rounded-full mb-3 animate-pulse bg-gray-200"></div>

    {/* Tags */}
    <div className="flex gap-1 mb-4">
      <div className="w-12 h-5 rounded-full animate-pulse bg-gray-200"></div>
      <div className="w-16 h-5 rounded-full animate-pulse bg-gray-200"></div>
      <div className="w-14 h-5 rounded-full animate-pulse bg-gray-200"></div>
    </div>

    {/* Author */}
    <div className="flex items-center mb-3">
      <div className="w-4 h-4 rounded mr-1 animate-pulse bg-gray-200"></div>
      <div className="w-20 h-4 rounded animate-pulse bg-gray-200"></div>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center">
        <div className="w-4 h-4 rounded mr-1 animate-pulse bg-gray-200"></div>
        <div className="w-16 h-4 rounded animate-pulse bg-gray-200"></div>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 rounded mr-1 animate-pulse bg-gray-200"></div>
        <div className="w-8 h-4 rounded animate-pulse bg-gray-200"></div>
      </div>
    </div>
  </div>
)

export default function Home() {
  // State management
  const [topics, setTopics] = useState<Topic[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [topicsLoading, setTopicsLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [filtersLoading, setFiltersLoading] = useState(true)
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

  // API fetch functions
  const fetchAllTrendingTopics = useCallback(async () => {
    try {
      setTopicsLoading(true)
      setError(null)

      // Start minimum loading timer
      const loadingStartTime = Date.now()

      const response = await fetch(`/api/trending/all?sort=${selectedSort}&order=${selectedOrder}`)
      const data = await response.json()

      if (data.success) {
        setTopics(data.topics)
        setLastUpdate(new Date())
      } else {
        setError(data.error || 'Failed to fetch trending topics')
      }

      // Ensure minimum 1 second loading time for better UX
      const elapsedTime = Date.now() - loadingStartTime
      const minLoadingTime = 1000 // 1 second

      if (elapsedTime < minLoadingTime) {
        await new Promise((resolve) => setTimeout(resolve, minLoadingTime - elapsedTime))
      }
    } catch (error) {
      setError('Network error while fetching trending topics')
      console.error('❌ Error fetching all trending topics:', error)
    } finally {
      setTopicsLoading(false)
    }
  }, [selectedSort, selectedOrder])

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true)
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
    } finally {
      setStatsLoading(false)
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
    setTopicsLoading(true)
    setFiltersLoading(true)
    setError(null)
    try {
      await Promise.all([fetchStats(), fetchLastUpdate()])
      // Fetch topics separately to avoid dependency issues
      await fetchAllTrendingTopics()
    } catch (error) {
      setError('Failed to load initial data')
    } finally {
      setLoading(false)
      setFiltersLoading(false)
    }
  }, [fetchStats, fetchLastUpdate])

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
  }, [handleInitialLoad, fetchLastUpdate, lastDbUpdate])

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
        icon: <PlatformIcon platform="Reddit" size={24} />,
        color: 'orange' as const,
      },
      {
        title: 'News Articles',
        value: stats?.platform_stats?.News || 0,
        icon: <PlatformIcon platform="News" size={24} />,
        color: 'green' as const,
      },
      {
        title: 'YouTube Videos',
        value: stats?.platform_stats?.YouTube || 0,
        icon: <PlatformIcon platform="YouTube" size={24} />,
        color: 'red' as const,
      },
      {
        title: 'Instagram Posts',
        value: stats?.platform_stats?.Instagram || 0,
        icon: <PlatformIcon platform="Instagram" size={24} />,
        color: 'purple' as const,
      },
      {
        title: 'Facebook Posts',
        value: stats?.platform_stats?.Facebook || 0,
        icon: <PlatformIcon platform="Facebook" size={24} />,
        color: 'blue' as const,
      },
      {
        title: 'Telegram Posts',
        value: stats?.platform_stats?.Telegram || 0,
        icon: <PlatformIcon platform="Telegram" size={24} />,
        color: 'green' as const,
      },
    ]

    return platformStats.map((stat, index) => (
      <StatsCard
        key={index}
        title={stat.title}
        value={stat.value}
        icon={stat.icon}
        color={stat.color}
        className="mr-4"
      />
    ))
  }

  const renderTrendingCards = () => {
    if (topicsLoading) {
      return Array.from({ length: 12 }).map((_, index) => (
        <TrendingCardSkeleton key={`skeleton-${index}`} index={index} className="animate-in fade-in" />
      ))
    }

    return displayedTopics.map((topic, index) => (
      <TrendingCard
        key={`${topic.platform}-${topic.title}-${index}`}
        topic={topic}
        rank={index + 1}
        className="animate-in fade-in"
      />
    ))
  }

  const renderTopicsCount = () => {
    return (
      <div className="flex items-center space-x-2">
        <p className="text-gray-600">
          Showing {Math.min(displayCount, filteredTopics.length)} of {filteredTopics.length} trending topics
        </p>
        {topicsLoading && (
          <div className="flex items-center space-x-1 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Sorting...</span>
          </div>
        )}
      </div>
    )
  }

  const renderEmptyState = () => {
    if (topicsLoading || filteredTopics.length > 0) return null

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
          {lastDbUpdate ? (
            <>Last database update: {new Date(lastDbUpdate).toLocaleTimeString()}</>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading database status...</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="mb-8">
        <Swiper modules={[FreeMode]} slidesPerView="auto" freeMode={true} className="stats-swiper">
          {statsLoading
            ? // Loading skeletons with proper SwiperSlide structure
              Array.from({ length: 7 }).map((_, index) => (
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  <StatsSkeleton />
                </SwiperSlide>
              ))
            : // Actual stats cards
              renderStatsCards().map((card, index) => (
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  {card}
                </SwiperSlide>
              ))}
        </Swiper>
      </div>

      {/* Filters Section */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <PlatformFilter
            selectedPlatforms={selectedPlatforms}
            onPlatformChange={handlePlatformChange}
            topics={topics}
            stats={stats || undefined}
            loading={filtersLoading}
          />
          <TopicFilter
            selectedTopics={selectedTopics}
            onTopicChange={setSelectedTopics}
            selectedPlatforms={selectedPlatforms}
            allTopics={topics}
            loading={filtersLoading}
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
