import { useState, useEffect, useRef } from 'react'
import { PlatformFilterProps } from '../types'
import PlatformIcon from './PlatformIcon'
import { PLATFORMS, getPlatformColor } from '../lib/constants/index'

export default function PlatformFilter({
  selectedPlatforms,
  onPlatformChange,
  topics,
  stats,
  loading = false,
}: PlatformFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(true) // Start with true to prevent layout shift
  const gridRef = useRef<HTMLDivElement>(null)

  // Use centralized platform data
  const platforms = PLATFORMS.map((platform) => ({
    key: platform.key,
    label: platform.label,
  }))

  const isAllSelected = selectedPlatforms.length === platforms.length
  const isAnySelected = selectedPlatforms.length > 0

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
  }, [platforms, isExpanded])

  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      // Remove platform if already selected
      onPlatformChange(selectedPlatforms.filter((p) => p !== platform))
    } else {
      // Add platform if not selected
      onPlatformChange([...selectedPlatforms, platform])
    }
  }

  const handleAllToggle = () => {
    if (isAllSelected) {
      // Deactivate all
      onPlatformChange([])
    } else {
      // Activate all
      onPlatformChange(platforms.map((p) => p.key))
    }
  }

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
            height: isExpanded ? '420px' : '220px',
            transition: 'height 300ms ease-in-out',
          }}
        >
          {platforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.key)
            // Use stats from database instead of counting loaded topics
            const count = stats?.platform_stats?.[platform.key] || 0

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

      {/* Status indicator and expand button */}
      <div className="mt-3 flex items-center justify-between h-6 flex-shrink-0">
        <div className="text-xs text-gray-600">
          {isAnySelected ? (
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
