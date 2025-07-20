'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, BarChart3, Globe, Zap } from 'lucide-react'
import TrendingCard from '../components/TrendingCard'
import StatsCard from '../components/StatsCard'
import PlatformFilter from '../components/PlatformFilter'
import TopicFilter from '../components/TopicFilter'
import { Topic, Stats } from '../types'

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [lastDbUpdate, setLastDbUpdate] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(50)
  const [showLoadMore, setShowLoadMore] = useState(true)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const fetchAllTrendingTopics = async () => {
    try {
      console.log('🔄 Fetching ALL trending topics from API...')
      const response = await fetch('/api/trending/all')
      const data = await response.json()

      if (data.success) {
        console.log(`✅ Fetched ${data.topics.length} ALL topics from API (cached: ${data.cached})`)
        setTopics(data.topics)
        setLastUpdate(new Date())
      } else {
        console.error('❌ API returned error:', data.error)
      }
    } catch (error) {
      console.error('❌ Error fetching all trending topics:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats', {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
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
  }

  const fetchLastUpdate = async () => {
    try {
      const response = await fetch('/api/last-update', {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      })
      const data = await response.json()
      if (data.success) {
        setLastDbUpdate(data.last_update)
        console.log('🕒 Last database update:', data.formatted)
      }
    } catch (error) {
      console.error('Error fetching last update:', error)
    }
  }

  const handleInitialLoad = async () => {
    setLoading(true)
    await Promise.all([fetchAllTrendingTopics(), fetchStats(), fetchLastUpdate()])
    setLoading(false)
  }

  useEffect(() => {
    // Load initial data
    handleInitialLoad()

    // Set up polling for updates
    const interval = setInterval(() => {
      fetchAllTrendingTopics()
    }, 300000) // Update every 5 minutes (less frequent since we have server cache)

    // Set up database update checking
    const dbUpdateInterval = setInterval(async () => {
      try {
        await fetchLastUpdate()

        // Check if we have a new database update
        if (lastDbUpdate) {
          const savedLastDbUpdate = localStorage.getItem('viral_last_db_update')
          if (!savedLastDbUpdate || savedLastDbUpdate !== lastDbUpdate) {
            console.log('🔄 New database update detected, refreshing content...')
            localStorage.setItem('viral_last_db_update', lastDbUpdate)

            // Fetch fresh data (server cache will be cleared by background update)
            await fetchAllTrendingTopics()
            await fetchStats()
          }
        }
      } catch (error) {
        console.error('Error checking for database updates:', error)
      }
    }, 60000) // Check every 1 minute for database updates

    return () => {
      clearInterval(interval)
      clearInterval(dbUpdateInterval)
    }
  }, [lastDbUpdate])

  const filteredTopics = topics.filter((topic) => {
    const platformMatch = selectedPlatform === 'all' || topic.platform.toLowerCase() === selectedPlatform.toLowerCase()
    const topicMatch = selectedTopic === 'all' || topic.topic === selectedTopic
    return platformMatch && topicMatch
  })

  const displayedTopics = filteredTopics.slice(0, displayCount)
  const hasMoreTopics = filteredTopics.length > displayCount

  const handleLoadMore = () => {
    // Show more topics from the full dataset
    const newCount = Math.min(displayCount + 50, filteredTopics.length)
    setDisplayCount(newCount)
    setShowLoadMore(newCount < filteredTopics.length)
  }

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform)
    setDisplayCount(50) // Reset to initial count when platform changes
    setShowLoadMore(true)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowScrollToTop(scrollTop > 300) // Show button after scrolling 300px
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Scroll to top when Home key is pressed
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
  }, [])

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

        {/* Last Update */}
        <div className="flex items-center justify-center text-sm text-gray-500">
          {lastDbUpdate ? <>Last database update: {new Date(lastDbUpdate).toLocaleTimeString()}</> : <>Loading...</>}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 bg-white">
        {loading ? (
          // Loading skeleton for stats
          <>
            <div className="card p-6 border-2 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-8 rounded w-16 animate-pulse"></div>
                </div>
                <div className="w-6 h-6 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="card p-6 border-2 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-8 rounded w-16 animate-pulse"></div>
                </div>
                <div className="w-6 h-6 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="card p-6 border-2 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-8 rounded w-16 animate-pulse"></div>
                </div>
                <div className="w-6 h-6 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="card p-6 border-2 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-8 rounded w-16 animate-pulse"></div>
                </div>
                <div className="w-6 h-6 rounded animate-pulse"></div>
              </div>
            </div>
          </>
        ) : (
          // Actual stats cards
          <>
            <StatsCard
              title="Total Topics (7d)"
              value={stats?.total_topics_7d || 0}
              icon={<Globe className="w-6 h-6" />}
              color="blue"
            />
            <StatsCard
              title="Reddit Topics"
              value={stats?.platform_stats?.Reddit || 0}
              icon={<span>🔴</span>}
              color="orange"
            />
            <StatsCard
              title="News Articles"
              value={stats?.platform_stats?.News || 0}
              icon={<span>📰</span>}
              color="green"
            />
            <StatsCard
              title="YouTube Videos"
              value={stats?.platform_stats?.YouTube || 0}
              icon={<span>📺</span>}
              color="red"
            />
          </>
        )}
      </div>

      {/* Platform Filter */}
      <div className="mb-6">
        {loading ? (
          <div className="rounded-lg shadow-sm border border-gray-200 p-4 bg-white">
            <div className="h-6 rounded w-32 mb-4 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-20 h-10 rounded-lg animate-pulse"
                  style={{ backgroundColor: '#d1d5db' }}
                ></div>
              ))}
            </div>
          </div>
        ) : (
          <PlatformFilter
            selectedPlatform={selectedPlatform}
            onPlatformChange={handlePlatformChange}
            topics={topics}
            stats={stats || undefined}
          />
        )}
      </div>

      {/* Topic Filter */}
      <div className="mb-8">
        {loading ? (
          <div className="rounded-lg shadow-sm border border-gray-200 p-4 bg-white">
            <div className="h-6 rounded w-32 mb-4 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="w-24 h-10 rounded-lg animate-pulse"
                  style={{ backgroundColor: '#d1d5db' }}
                ></div>
              ))}
            </div>
          </div>
        ) : (
          <TopicFilter
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
            selectedPlatform={selectedPlatform}
            allTopics={topics}
          />
        )}

        {/* Topics Count */}
        <div className="mt-4 text-center text-gray-600">
          {loading ? (
            <div className="h-4 rounded w-48 mx-auto animate-pulse"></div>
          ) : (
            <p>
              Showing {displayedTopics.length} of {filteredTopics.length} trending topics
              {selectedPlatform !== 'all' && ` from ${selectedPlatform}`}
              {selectedTopic !== 'all' && ` in ${selectedTopic}`}
            </p>
          )}
        </div>
      </div>

      {/* Trending Topics Grid */}
      <div className="trending-grid">
        {loading
          ? // Loading skeleton for trending cards
            Array.from({ length: 12 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="trending-card bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded animate-pulse"></div>
                    <div className="w-16 h-6 rounded animate-pulse"></div>
                  </div>
                  <div className="w-20 h-6 rounded animate-pulse"></div>
                </div>
                <div className="h-6 rounded mb-2 animate-pulse"></div>
                <div className="h-4 rounded mb-2 animate-pulse"></div>
                <div className="h-4 rounded mb-4 w-3/4 animate-pulse"></div>
                <div className="flex items-center justify-between">
                  <div className="w-16 h-4 rounded animate-pulse"></div>
                  <div className="w-12 h-4 rounded animate-pulse"></div>
                </div>
              </div>
            ))
          : displayedTopics.map((topic, index) => (
              <TrendingCard key={`${topic.platform}-${index}`} topic={topic} rank={index + 1} />
            ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && hasMoreTopics && (
        <div className="text-center mt-8">
          <button onClick={handleLoadMore} className="btn-load-more text-lg">
            Load More ({filteredTopics.length - displayCount} more)
          </button>
        </div>
      )}

      {/* Show total count when all loaded */}
      {!showLoadMore && filteredTopics.length > 0 && (
        <div className="text-center mt-8 text-gray-600">
          <p>Showing all {filteredTopics.length} trending topics</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTopics.length === 0 && (
        <div className="text-center py-12">
          <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No trending topics found</h3>
          <p className="text-gray-500">
            {selectedPlatform === 'all'
              ? 'Try refreshing to get the latest trending topics.'
              : `No trending topics found for ${selectedPlatform}. Try selecting a different platform.`}
          </p>
        </div>
      )}

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
