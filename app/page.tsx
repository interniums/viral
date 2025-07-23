'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { TrendingUp, Globe, Zap } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import TrendingCard, { TrendingCardSkeleton } from '../components/TrendingCard'
import StatsCard from '../components/StatsCard'
import PlatformFilter from '../components/PlatformFilter'
import TopicFilter from '../components/TopicFilter'
import SortFilter, { SortFilterSkeleton } from '../components/SortFilter'
import PlatformIcon from '../components/PlatformIcon'
import { TrendingTopic, Stats } from '../types'
import { Platform, Topic } from '../lib/constants/enums'
import { APP_CONFIG, API_ENDPOINTS, PLATFORMS } from '../lib/constants/index'

// Loading skeleton components
const StatsSkeleton = () => (
  <div className="card p-6 border-2 min-w-[240px] flex-shrink-0 bg-gray-50 border-gray-200 mr-4">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="h-4 rounded w-20 mb-2 animate-pulse bg-gray-200"></div>
        <div className="h-8 rounded w-16 mt-1 animate-pulse bg-gray-200"></div>
      </div>
      <div
        className="text-2xl opacity-80 flex-shrink-0 flex items-center justify-center animate-pulse bg-gray-200 rounded"
        style={{ minWidth: '32px', width: '24px', height: '24px' }}
      ></div>
    </div>
  </div>
)

// Helper function to map platform colors to StatsCard colors
const getStatsCardColor = (color: string): 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray' => {
  switch (color) {
    case 'blue':
      return 'blue'
    case 'green':
      return 'green'
    case 'red':
      return 'red'
    case 'yellow':
      return 'yellow'
    case 'purple':
      return 'purple'
    case 'orange':
      return 'orange'
    default:
      return 'gray'
  }
}

export default function Home() {
  const [allTopics, setAllTopics] = useState<TrendingTopic[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([])
  const [selectedSort, setSelectedSort] = useState<string>('timestamp')
  const [selectedOrder, setSelectedOrder] = useState<string>('desc')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [lastDbUpdate, setLastDbUpdate] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState<number>(APP_CONFIG.INITIAL_DISPLAY_COUNT) // How many to show
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  // Fetch ALL data from database (called once on load)
  const fetchAllTopics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.TRENDING_ALL, {
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      })

      const data = await response.json()

      if (data.success) {
        setAllTopics(data.topics)
        setLastUpdate(new Date())
      } else {
        console.error('API returned error:', data.error)
        setError(data.error || 'Failed to fetch trending topics')
      }
    } catch (error) {
      console.error('Network error while fetching topics:', error)
      setError('Network error while fetching topics')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.STATS, {
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      })
      const data = await response.json()
      if (data.success) {
        setStats(data)
      } else {
        console.error('Stats API returned error:', data.error)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [])

  const fetchLastUpdate = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.LAST_UPDATE, {
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      })
      const data = await response.json()
      if (data.success) {
        setLastDbUpdate(data.last_update)
      }
    } catch (error) {
      // Silent error for last update check
    }
  }, [])

  // Filter and sort topics based on current selections
  const processedTopics = useMemo(() => {
    let filtered = allTopics

    // Apply platform filter
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter((topic) => selectedPlatforms.includes(topic.platform))
    }

    // Apply topic filter
    if (selectedTopics.length > 0) {
      filtered = filtered.filter((topic) => selectedTopics.includes(topic.topic))
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aVal: any, bVal: any

      switch (selectedSort) {
        case 'engagement':
          // Use combined score + engagement for viral score sorting
          aVal = (a.engagement || 0) + (a.score || 0)
          bVal = (b.engagement || 0) + (b.score || 0)
          break
        case 'timestamp':
          aVal = new Date(a.timestamp || '').getTime()
          bVal = new Date(b.timestamp || '').getTime()
          break
        case 'random':
          // For random, we'll use a seeded random based on topic ID to maintain consistency
          aVal = (Number(a.id || 0) * 0.618033988749895) % 1 // Golden ratio for better distribution
          bVal = (Number(b.id || 0) * 0.618033988749895) % 1
          break
        default:
          aVal = new Date(a.timestamp || '').getTime()
          bVal = new Date(b.timestamp || '').getTime()
      }

      if (selectedOrder === 'asc') {
        return aVal - bVal
      } else {
        return bVal - aVal
      }
    })

    return sorted
  }, [allTopics, selectedPlatforms, selectedTopics, selectedSort, selectedOrder])

  // Topics to display (with local pagination)
  const displayedTopics = useMemo(() => {
    return processedTopics.slice(0, displayCount)
  }, [processedTopics, displayCount])

  // Calculate remaining topics for load more button
  const remainingTopicsCount = processedTopics.length - displayCount
  const canLoadMore = remainingTopicsCount > 0

  // Event handlers
  const handleLoadMore = useCallback(() => {
    const newDisplayCount = Math.min(displayCount + APP_CONFIG.LOAD_MORE_INCREMENT, processedTopics.length)
    setDisplayCount(newDisplayCount)
  }, [displayCount, processedTopics.length])

  const handlePlatformChange = useCallback((platforms: Platform[]) => {
    setSelectedPlatforms(platforms)
    setDisplayCount(APP_CONFIG.INITIAL_DISPLAY_COUNT) // Reset pagination
  }, [])

  const handleTopicChange = useCallback((topics: Topic[]) => {
    setSelectedTopics(topics)
    setDisplayCount(APP_CONFIG.INITIAL_DISPLAY_COUNT) // Reset pagination
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSelectedSort(sort)
    setDisplayCount(APP_CONFIG.INITIAL_DISPLAY_COUNT) // Reset pagination
  }, [])

  const handleOrderChange = useCallback((order: string) => {
    setSelectedOrder(order)
    setDisplayCount(APP_CONFIG.INITIAL_DISPLAY_COUNT) // Reset pagination
  }, [])

  const handleManualRefresh = useCallback(async () => {
    await Promise.all([fetchAllTopics(), fetchStats(), fetchLastUpdate()])
  }, [fetchAllTopics, fetchStats, fetchLastUpdate])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Initial load
  useEffect(() => {
    const initialLoad = async () => {
      await Promise.all([fetchAllTopics(), fetchStats(), fetchLastUpdate()])
    }
    initialLoad()
  }, [fetchAllTopics, fetchStats, fetchLastUpdate])

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(APP_CONFIG.INITIAL_DISPLAY_COUNT)
  }, [selectedPlatforms, selectedTopics, selectedSort, selectedOrder])

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowScrollToTop(scrollTop > APP_CONFIG.SCROLL_THRESHOLD)
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
    // Create stats cards for all platforms
    const platformStats = [
      {
        title: 'Total Topics (7d)',
        value: stats?.total_topics_7d || 0,
        icon: <Globe className="w-6 h-6" />,
        color: 'blue' as const,
      },
      ...PLATFORMS.map((platform) => ({
        title: `${platform.label} Topics`,
        value: stats?.platform_stats?.[platform.key] || 0,
        icon: <PlatformIcon platform={platform.key} size={24} />,
        color: getStatsCardColor(platform.color),
      })),
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
    if (loading) {
      return Array.from({ length: 12 }).map((_, index) => <TrendingCardSkeleton key={`skeleton-${index}`} />)
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
    const displayedCount = displayedTopics.length
    const filteredCount = processedTopics.length
    const totalLoadedFromAPI = allTopics.length

    return (
      <div className="flex items-center space-x-2">
        <p className="text-gray-600">
          Showing {displayedCount} of {filteredCount} trending topics
          {allTopics.length > 0 && (
            <span className="text-sm text-gray-500 ml-1">({totalLoadedFromAPI} loaded from database)</span>
          )}
        </p>
        {loading && (
          <div className="flex items-center space-x-1 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading...</span>
          </div>
        )}
      </div>
    )
  }

  const renderEmptyState = () => {
    if (loading || processedTopics.length > 0) return null

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
          Real-time trending topics from Reddit, YouTube, and other social platforms
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="text-gray-500">
            {lastDbUpdate ? (
              <>Last database update: {new Date(lastDbUpdate).toLocaleTimeString()}</>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading database status...</span>
              </div>
            )}
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
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
        <Swiper
          modules={[FreeMode]}
          slidesPerView="auto"
          freeMode={{
            enabled: true,
            sticky: false,
            momentum: true,
            momentumRatio: 0.6,
            momentumVelocityRatio: 0.6,
          }}
          className={`stats-swiper ${loading ? 'loading' : ''}`}
          watchSlidesProgress={true}
          resistanceRatio={0.85}
          allowTouchMove={true}
          simulateTouch={true}
          touchStartPreventDefault={false}
          preventClicks={false}
          preventClicksPropagation={false}
        >
          {loading
            ? // Loading skeletons - match the actual number of cards (15 platforms + 1 total)
              Array.from({ length: 16 }).map((_, index) => (
                <SwiperSlide key={`skeleton-${index}`} style={{ width: 'auto' }}>
                  <StatsSkeleton />
                </SwiperSlide>
              ))
            : // Actual stats cards
              renderStatsCards().map((card, index) => (
                <SwiperSlide key={`stats-${index}`} style={{ width: 'auto' }}>
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
            topics={allTopics}
            stats={stats || undefined}
            loading={loading}
            selectedTopics={selectedTopics}
          />
          <TopicFilter
            selectedTopics={selectedTopics}
            onTopicChange={handleTopicChange}
            selectedPlatforms={selectedPlatforms}
            allTopics={allTopics}
            stats={stats || undefined}
            loading={loading}
          />
        </div>
      </div>

      {/* Cards Container with Sort Filter */}
      <div className="relative pt-16 sm:pt-20">
        <div className="absolute top-0 right-0 z-10">
          {loading ? (
            <SortFilterSkeleton />
          ) : (
            <SortFilter
              selectedSort={selectedSort}
              onSortChange={handleSortChange}
              selectedOrder={selectedOrder}
              onOrderChange={handleOrderChange}
            />
          )}
        </div>

        <div className="mb-4">{renderTopicsCount()}</div>

        <div className="trending-grid">{renderTrendingCards()}</div>

        {canLoadMore && (
          <div className="text-center mt-8">
            <button onClick={handleLoadMore} className="btn-load-more text-lg" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                `Load More (${remainingTopicsCount} more)`
              )}
            </button>
          </div>
        )}

        {!canLoadMore && processedTopics.length > 0 && (
          <div className="text-center mt-8 text-gray-600">
            <p>Showing all {processedTopics.length} trending topics</p>
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
