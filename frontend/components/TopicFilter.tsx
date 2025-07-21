'use client'

import { useState, useEffect } from 'react'
import { TopicFilterProps } from '../types'

interface Topic {
  topic: string
  count: number
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

export default function TopicFilter({
  selectedTopics,
  onTopicChange,
  selectedPlatforms,
  allTopics,
  loading = false,
}: TopicFilterProps) {
  const [topics, setTopics] = useState<Topic[]>([])

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
      }
    }

    fetchTopics()
  }, [])

  if (loading) {
    return (
      <div className="rounded-lg shadow-sm border border-gray-200 p-3 bg-white h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 rounded w-20 animate-pulse bg-gray-200"></div>
          <div className="w-[125px] h-[30px] rounded animate-pulse bg-gray-200"></div>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[120px]">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="px-3 py-2 rounded-md border border-gray-200 animate-pulse bg-gray-200 flex items-center space-x-2"
            >
              <div className="w-4 h-4 rounded animate-pulse bg-gray-300"></div>
              <div className="w-12 h-3 rounded animate-pulse bg-gray-300"></div>
              <div className="w-6 h-4 rounded-full animate-pulse bg-gray-300"></div>
            </div>
          ))}
        </div>
        <div className="mt-2 h-5 rounded w-32 animate-pulse bg-gray-200"></div>
      </div>
    )
  }

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 p-3 bg-white h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Topics</h3>
        <button
          onClick={handleAllToggle}
          className={`px-3 rounded text-xs font-medium transition-all duration-300 ease-in-out w-[125px] h-[30px] ${
            isAllSelected
              ? 'bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isAllSelected ? 'Deactivate All' : 'Activate All'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[120px]">
        {availableTopics.map((topic) => {
          const isSelected = selectedTopics.includes(topic.topic)

          return (
            <button
              key={topic.topic}
              onClick={() => handleTopicToggle(topic.topic)}
              className={`px-3 py-2 rounded-md border-2 transition-all duration-300 ease-in-out flex items-center space-x-2 ${
                isSelected
                  ? 'bg-white text-gray-800 border-gray-300 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <span className="text-sm">{topicIcons[topic.topic] || '📌'}</span>
              <span className="text-xs font-medium truncate">{topic.topic}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  isSelected ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {topic.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Status indicator */}
      <div className="mt-2 text-xs text-gray-600 h-5">
        {isAnySelected ? (
          <span>
            {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
          </span>
        ) : (
          <span className="text-gray-600">No topics selected - showing all content</span>
        )}
      </div>
    </div>
  )
}
