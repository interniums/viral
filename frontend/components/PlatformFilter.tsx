import { PlatformFilterProps } from '../types'

export default function PlatformFilter({ selectedPlatforms, onPlatformChange, topics, stats }: PlatformFilterProps) {
  const platforms = [
    { key: 'Reddit', label: 'Reddit', icon: '🔴' },
    { key: 'YouTube', label: 'YouTube', icon: '📺' },
    { key: 'News', label: 'News', icon: '📰' },
    { key: 'Instagram', label: 'Instagram', icon: '📸' },
    { key: 'Facebook', label: 'Facebook', icon: '📘' },
    { key: 'Telegram', label: 'Telegram', icon: '📱' },
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

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 p-3 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Platforms</h3>
        <button
          onClick={handleAllToggle}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            isAllSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isAllSelected ? 'Deactivate All' : 'Activate All'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.key)
          const count = topics.filter((topic) => topic.platform === platform.key).length

          return (
            <button
              key={platform.key}
              onClick={() => handlePlatformToggle(platform.key)}
              className={`p-2 rounded-md border transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-600 text-white border-transparent shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                {/* First line: Icon and Count */}
                <div className="relative flex items-center justify-center w-full">
                  <span className="text-xl">{platform.icon}</span>
                  <span
                    className={`absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'
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
      <div className="mt-2 text-xs text-gray-600">
        {isAnySelected ? (
          <span>
            {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected
          </span>
        ) : (
          <span className="text-orange-600">No platforms selected - showing all content</span>
        )}
      </div>
    </div>
  )
}
