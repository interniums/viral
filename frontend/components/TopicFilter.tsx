'use client'

import { useState, useEffect } from 'react'

interface Topic {
  topic: string
  count: number
}

interface TopicFilterProps {
  selectedTopics: string[]
  onTopicChange: (topics: string[]) => void
  selectedPlatforms: string[]
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

export default function TopicFilter({ selectedTopics, onTopicChange, selectedPlatforms, allTopics }: TopicFilterProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  // Calculate topic counts based on selected platforms
  const getTopicCounts = () => {
    if (!allTopics || allTopics.length === 0) {
      return topics.map((t) => ({ topic: t.topic, count: 0 }))
    }

    // Filter topics by selected platforms
    const filteredTopics =
      selectedPlatforms.length === 0
        ? allTopics
        : allTopics.filter((topic) =>
            selectedPlatforms.some((platform) => topic.platform.toLowerCase() === platform.toLowerCase())
          )

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

  const availableTopics = getTopicCounts()
  const isAllSelected = selectedTopics.length === availableTopics.length && availableTopics.length > 0
  const isAnySelected = selectedTopics.length > 0

  const handleTopicToggle = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      // Remove topic if already selected
      onTopicChange(selectedTopics.filter((t) => t !== topic))
    } else {
      // Add topic if not selected
      onTopicChange([...selectedTopics, topic])
    }
  }

  const handleAllToggle = () => {
    if (isAllSelected) {
      // Deactivate all
      onTopicChange([])
    } else {
      // Activate all
      onTopicChange(availableTopics.map((t) => t.topic))
    }
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
      <div className="rounded-lg shadow-sm border border-gray-200 p-3 bg-white">
        <div className="h-5 rounded w-24 mb-3 animate-pulse"></div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-20 h-8 rounded-md animate-pulse" style={{ backgroundColor: '#d1d5db' }}></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 p-3 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Topics</h3>
        <button
          onClick={handleAllToggle}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            isAllSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isAllSelected ? 'Deactivate All' : 'Activate All'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableTopics.map((topic) => {
          const isSelected = selectedTopics.includes(topic.topic)

          return (
            <button
              key={topic.topic}
              onClick={() => handleTopicToggle(topic.topic)}
              className={`px-3 py-2 rounded-md border transition-all duration-200 flex items-center space-x-2 ${
                isSelected
                  ? 'bg-blue-600 text-white border-transparent shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <span className="text-sm">{topicIcons[topic.topic] || '📌'}</span>
              <span className="text-xs font-medium truncate">{topic.topic}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  isSelected ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {topic.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Status indicator */}
      <div className="mt-2 text-xs text-gray-600">
        {isAnySelected ? (
          <span>
            {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
          </span>
        ) : (
          <span className="text-orange-600">No topics selected - showing all content</span>
        )}
      </div>
    </div>
  )
}
