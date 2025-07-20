'use client'

import { useState, useEffect } from 'react'

interface Topic {
  topic: string
  count: number
}

interface TopicFilterProps {
  selectedTopic: string
  onTopicChange: (topic: string) => void
  selectedPlatform: string
  allTopics: any[]
}

const topicIcons: { [key: string]: string } = {
  crypto: '₿',
  sports: '⚽',
  finance: '💰',
  culture: '🎭',
  memes: '😂',
  gaming: '🎮',
  technology: '💻',
  politics: '🗳️',
  lifestyle: '🏠',
  general: '🌐',
}

const topicColors: { [key: string]: string } = {
  crypto: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  sports: 'bg-green-100 text-green-800 border-green-200',
  finance: 'bg-blue-100 text-blue-800 border-blue-200',
  culture: 'bg-purple-100 text-purple-800 border-purple-200',
  memes: 'bg-pink-100 text-pink-800 border-pink-200',
  gaming: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  technology: 'bg-gray-100 text-gray-800 border-gray-200',
  politics: 'bg-red-100 text-red-800 border-red-200',
  lifestyle: 'bg-orange-100 text-orange-800 border-orange-200',
  general: 'bg-gray-100 text-gray-800 border-gray-200',
}

export default function TopicFilter({ selectedTopic, onTopicChange, selectedPlatform, allTopics }: TopicFilterProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  // Calculate topic counts based on selected platform
  const getTopicCounts = () => {
    if (!allTopics || allTopics.length === 0) {
      return topics.map((t) => ({ topic: t.topic, count: 0 }))
    }

    // Filter topics by selected platform
    const filteredTopics =
      selectedPlatform === 'all'
        ? allTopics
        : allTopics.filter((topic) => topic.platform.toLowerCase() === selectedPlatform.toLowerCase())

    // Count topics by category
    const topicCounts: { [key: string]: number } = {}
    filteredTopics.forEach((topic) => {
      const topicCategory = topic.topic || 'general'
      topicCounts[topicCategory] = (topicCounts[topicCategory] || 0) + 1
    })

    // Return topics with counts
    return topics.map((t) => ({
      topic: t.topic,
      count: topicCounts[t.topic] || 0,
    }))
  }

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        console.log('🔄 Fetching topics from API...')
        const response = await fetch('/api/topics', {
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
        }

        const data = await response.json()
        if (data.success) {
          console.log(`✅ Fetched ${data.topics.length} topics from API`)
          setTopics(data.topics)
        } else {
          console.error('❌ API returned error:', data.error)
        }
      } catch (error) {
        console.error('❌ Error fetching topics:', error)
        // Set some default topics if API fails
        setTopics([
          { topic: 'crypto', count: 0 },
          { topic: 'sports', count: 0 },
          { topic: 'finance', count: 0 },
          { topic: 'culture', count: 0 },
          { topic: 'memes', count: 0 },
          { topic: 'gaming', count: 0 },
          { topic: 'technology', count: 0 },
          { topic: 'politics', count: 0 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  if (loading) {
    return (
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
    )
  }

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 p-4 bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Topic</h3>
      <div className="flex flex-wrap gap-2">
        {/* All Topics */}
        <button
          onClick={() => onTopicChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
            selectedTopic === 'all'
              ? 'bg-primary-600 text-white shadow-md ring-2 ring-primary-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
          }`}
        >
          <span className="text-lg">🌐</span>
          <span>All Topics</span>
        </button>

        {/* Topic-specific filters */}
        {getTopicCounts().map((topic) => (
          <button
            key={topic.topic}
            onClick={() => onTopicChange(topic.topic)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedTopic === topic.topic
                ? 'bg-primary-600 text-white shadow-md ring-2 ring-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
            }`}
          >
            <span className="text-lg">{topicIcons[topic.topic] || '📌'}</span>
            <span className="capitalize">{topic.topic}</span>
            <span
              className={`text-xs px-2 py-1 rounded-full min-w-[20px] text-center ${
                selectedTopic === topic.topic ? 'bg-white text-primary-600 font-semibold' : 'bg-gray-300 text-gray-700'
              }`}
            >
              {topic.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
