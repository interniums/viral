import { useState, useEffect, useRef } from 'react'
import { Platform, Topic } from '@/lib/constants/enums'
import { PlatformFilterProps } from '@/types'
import PlatformIcon from './PlatformIcon'
import { PLATFORMS } from '@/lib/constants/platforms'

export default function PlatformFilter({
  selectedPlatforms,
  onPlatformChange,
  topics,
  stats,
  loading = false,
  selectedTopics = [], // Add selectedTopics prop
}: PlatformFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  // Start with `false` so the expand button only shows once we've checked
  // whether the grid actually overflows the collapsed height.
  const [hasOverflow, setHasOverflow] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Calculate dynamic platform counts based on current topic selection
  const getDynamicPlatformCounts = () => {
    if (!topics || topics.length === 0) {
      // Fallback to static stats if no topics data
      return PLATFORMS.reduce((acc, platform) => {
        acc[platform.key] = stats?.platform_stats?.[platform.key] || 0
        return acc
      }, {} as Record<Platform, number>)
    }

    // Filter topics based on selected topics (if any)
    let filteredTopics = topics
    if (selectedTopics && selectedTopics.length > 0) {
      filteredTopics = topics.filter((topic) => selectedTopics.includes(topic.topic))
    }

    // Count topics per platform
    return PLATFORMS.reduce((acc, platform) => {
      acc[platform.key] = filteredTopics.filter((topic) => topic.platform === platform.key).length
      return acc
    }, {} as Record<Platform, number>)
  }

  const platformCounts = getDynamicPlatformCounts()

  const handlePlatformToggle = (platformKey: Platform) => {
    if (selectedPlatforms.includes(platformKey)) {
      onPlatformChange(selectedPlatforms.filter((p) => p !== platformKey))
    } else {
      onPlatformChange([...selectedPlatforms, platformKey])
    }
  }

  const handleAllToggle = () => {
    if (selectedPlatforms.length === PLATFORMS.length) {
      onPlatformChange([])
    } else {
      // Pass the enum values (platform.key) not the objects
      onPlatformChange(PLATFORMS.map((p) => p.key))
    }
  }

  useEffect(() => {
    const checkOverflow = () => {
      if (gridRef.current) {
        const hasVerticalOverflow = gridRef.current.scrollHeight > 220
        setHasOverflow(hasVerticalOverflow)
        if (!hasVerticalOverflow && isExpanded) {
          setIsExpanded(false)
        }
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [isExpanded, selectedTopics, topics])

  if (loading) {
    return (
      <div className="rounded-lg shadow-sm border border-gray-200 px-3 py-4 bg-white flex flex-col h-[310px]">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 rounded w-20 animate-pulse bg-gray-200"></div>
          <div className="w-[125px] h-[30px] rounded animate-pulse bg-gray-200"></div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 content-start h-[220px]">
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
      className={`rounded-lg shadow-sm border border-gray-200 px-3 py-4 bg-white flex flex-col transition-all duration-300 ease-in-out relative ${
        isExpanded ? 'h-[500px]' : 'h-[310px]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Platforms</h3>
        <button
          onClick={handleAllToggle}
          className={`px-3 rounded-md text-sm font-medium w-[125px] h-[30px] transition-all duration-300 ease-in-out ${
            selectedPlatforms.length === PLATFORMS.length
              ? 'bg-primary-50 border border-primary-600 text-primary-600'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          {selectedPlatforms.length === PLATFORMS.length ? 'Deactivate All' : 'Activate All'}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 content-start"
          style={{
            height: isExpanded ? '420px' : '220px',
            transition: 'height 300ms ease-in-out',
          }}
        >
          {PLATFORMS.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.key)
            const count = platformCounts[platform.key] || 0

            return (
              <button
                key={platform.key}
                onClick={() => handlePlatformToggle(platform.key)}
                className={`p-2 rounded-md transition-all duration-300 ease-in-out h-[60px] ${
                  isSelected
                    ? 'bg-primary-50 border border-primary-600 text-primary-600'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="relative flex items-center justify-center w-full">
                    <PlatformIcon platform={platform.key} size={24} className="text-xl" />
                    <span
                      className={`absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <span className="text-xs font-medium truncate text-center w-full">{platform.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between h-6 flex-shrink-0">
        <div className="text-xs text-gray-600">
          {selectedPlatforms.length > 0 ? (
            <span>
              {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected
            </span>
          ) : (
            <span className="text-gray-600">No platforms selected - showing all content</span>
          )}
        </div>
        {hasOverflow && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
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
