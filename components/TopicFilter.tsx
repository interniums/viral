'use client'

import { useState, useEffect, useRef } from 'react'
import { Topic, TopicCategory } from '@/lib/constants/enums'
import { TopicFilterProps } from '@/types'
import { TOPICS, getTopicIcons } from '@/lib/constants/topics'

// Use centralized topic icons
const topicIcons = getTopicIcons()

export default function TopicFilter({
  selectedTopics,
  onTopicChange,
  selectedPlatforms,
  allTopics,
  stats,
  loading = false,
}: TopicFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  // Start with `false` so the expand button only shows once we've confirmed overflow
  const [hasOverflow, setHasOverflow] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Calculate dynamic topic counts based on current platform selection
  const getTopicCounts = () => {
    if (!allTopics || allTopics.length === 0) {
      // Fallback to static stats if no topics data
      return TOPICS.map((topicConfig) => ({
        topic: topicConfig.key,
        count: stats?.category_stats[topicConfig.key] || 0,
      }))
    }

    // Filter topics based on selected platforms (if any)
    let filteredTopics = allTopics
    if (selectedPlatforms && selectedPlatforms.length > 0) {
      filteredTopics = allTopics.filter((topic) => selectedPlatforms.includes(topic.platform))
    }

    // Count topics per category
    return TOPICS.map((topicConfig) => ({
      topic: topicConfig.key,
      count: filteredTopics.filter((topic) => topic.topic === topicConfig.key).length,
    }))
  }

  const availableTopics = getTopicCounts()
  const isAllSelected = selectedTopics.length === availableTopics.length && availableTopics.length > 0
  const isAnySelected = selectedTopics.length > 0

  useEffect(() => {
    const checkOverflow = () => {
      if (gridRef.current) {
        const hasVerticalOverflow = gridRef.current.scrollHeight > 220 // 220px is our default grid height
        setHasOverflow(hasVerticalOverflow)
        if (!hasVerticalOverflow && isExpanded) {
          setIsExpanded(false)
        }
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [availableTopics, isExpanded, selectedPlatforms])

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded && gridRef.current) {
      // Wait for state update and animation to start
      setTimeout(() => {
        gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 50)
    }
  }

  const handleTopicToggle = (topicKey: Topic) => {
    if (selectedTopics.includes(topicKey)) {
      // Remove topic if already selected
      onTopicChange(selectedTopics.filter((t) => t !== topicKey))
    } else {
      // Add topic if not selected
      onTopicChange([...selectedTopics, topicKey])
    }
  }

  const handleAllToggle = () => {
    if (isAllSelected) {
      // Deactivate all
      onTopicChange([])
    } else {
      // Activate all - pass the enum values directly
      onTopicChange(availableTopics.map((t) => t.topic))
    }
  }

  if (loading) {
    return (
      <div
        className="rounded-lg shadow-sm border border-gray-200 px-3 py-4 bg-white flex flex-col relative"
        style={{ height: '310px' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 rounded w-20 animate-pulse bg-gray-200"></div>
          <div className="w-[125px] h-[30px] rounded animate-pulse bg-gray-200"></div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 content-start"
            style={{ maxHeight: '220px', overflow: 'hidden' }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="p-2 rounded-md border border-gray-200 animate-pulse bg-gray-200 flex flex-col items-center space-y-1 h-[60px]"
              >
                <div className="relative flex items-center justify-center w-full">
                  <div className="w-6 h-6 rounded animate-pulse bg-gray-300"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse bg-gray-300"></div>
                </div>
                <div className="w-16 h-3 rounded animate-pulse bg-gray-300"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between h-6 flex-shrink-0">
          <div className="h-4 rounded w-32 animate-pulse bg-gray-200"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-lg shadow-sm border border-gray-200 px-3 py-4 bg-white flex flex-col relative"
      style={{ height: isExpanded ? 'auto' : '310px' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Topics</h3>
        <button
          onClick={handleAllToggle}
          className={`px-3 rounded-md text-sm font-medium w-[125px] h-[30px] transition-all duration-300 ease-in-out ${
            isAllSelected
              ? 'bg-primary-50 border border-primary-600 text-primary-600'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          {isAllSelected ? 'Deactivate All' : 'Activate All'}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 content-start"
          style={{
            // Use a large height value instead of 'none' to allow smooth animation
            maxHeight: isExpanded ? '2000px' : '220px',
            transition: 'max-height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: isExpanded ? 'visible' : 'hidden',
          }}
        >
          {availableTopics.map((topicData) => {
            const isSelected = selectedTopics.includes(topicData.topic)
            // Find the topic configuration for the label
            const topicConfig = TOPICS.find((t) => t.key === topicData.topic)
            const topicLabel = topicConfig ? topicConfig.label : topicData.topic

            return (
              <button
                key={topicData.topic}
                onClick={() => handleTopicToggle(topicData.topic)}
                className={`p-2 rounded-md transition-all duration-300 ease-in-out h-[60px] ${
                  isSelected
                    ? 'bg-primary-50 border border-primary-600 text-primary-600'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="relative flex items-center justify-center w-full">
                    <span
                      className="text-xl"
                      style={{
                        fontSize: '24px',
                        height: '24px',
                        width: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {topicIcons[topicData.topic] || '📌'}
                    </span>
                    <span
                      className={`absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {topicData.count}
                    </span>
                  </div>
                  <span className="text-xs font-medium truncate text-center w-full">{topicLabel}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Status indicator and expand button */}
      <div className="mt-3 flex items-center justify-between h-6 flex-shrink-0">
        <div className="text-xs text-gray-600">
          {isAnySelected ? (
            <span>
              {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
            </span>
          ) : (
            <span className="text-gray-600">No topics selected - showing all content</span>
          )}
        </div>
        {hasOverflow && (
          <button
            onClick={handleExpand}
            className="flex items-center gap-2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            title={isExpanded ? 'Show Less' : 'Show All'}
          >
            <span className="text-xs">{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
