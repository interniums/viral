import { PlatformFilterProps } from '../types'
import PlatformIcon from './PlatformIcon'

export default function PlatformFilter({
  selectedPlatforms,
  onPlatformChange,
  topics,
  stats,
  loading = false,
}: PlatformFilterProps) {
  const platforms = [
    { key: 'Reddit', label: 'Reddit' },
    { key: 'YouTube', label: 'YouTube' },
    { key: 'Google Trends', label: 'Google Trends' },
    { key: 'Instagram', label: 'Instagram' },
    { key: 'Facebook', label: 'Facebook' },
    { key: 'Telegram', label: 'Telegram' },
  ]

  const isAllSelected = selectedPlatforms.length === platforms.length
  const isAnySelected = selectedPlatforms.length > 0

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
      <div className="rounded-lg shadow-sm border border-gray-200 p-3 bg-white h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 rounded w-20 animate-pulse bg-gray-200"></div>
          <div className="w-[125px] h-[30px] rounded animate-pulse bg-gray-200"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 min-h-[120px]">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="p-2 rounded-md border border-gray-200 animate-pulse bg-gray-200 flex flex-col items-center space-y-1 h-[60px]"
            >
              <div className="relative flex items-center justify-center w-full">
                <div className="w-6 h-6 rounded animate-pulse bg-gray-300"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse bg-gray-300"></div>
              </div>
              <div className="w-12 h-3 rounded animate-pulse bg-gray-300"></div>
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
        <h3 className="text-base font-semibold text-gray-900">Platforms</h3>
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 min-h-[120px]">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.key)
          const count = topics.filter((topic) => topic.platform === platform.key).length

          return (
            <button
              key={platform.key}
              onClick={() => handlePlatformToggle(platform.key)}
              className={`p-2 rounded-md border-2 transition-all duration-300 ease-in-out h-[60px] ${
                isSelected
                  ? 'bg-white text-gray-800 border-gray-300 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                {/* First line: Icon and Count */}
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
                {/* Second line: Platform Name */}
                <span className="text-xs font-medium truncate text-center w-full">{platform.label}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Status indicator */}
      <div className="mt-2 text-xs text-gray-600 h-5">
        {isAnySelected ? (
          <span>
            {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected
          </span>
        ) : (
          <span className="text-gray-600">No platforms selected - showing all content</span>
        )}
      </div>
    </div>
  )
}
