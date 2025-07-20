import { PlatformFilterProps } from '../types'

export default function PlatformFilter({ selectedPlatform, onPlatformChange, topics, stats }: PlatformFilterProps) {
  const platforms = ['all', 'reddit', 'news', 'youtube'] // Twitter commented out

  const getPlatformCount = (platform: string) => {
    // Use stats data if available, otherwise fall back to counting from topics
    if (stats && stats.platform_stats) {
      if (platform === 'all') {
        return stats.total_topics_7d || 0
      }
      // Handle the correct case for platform names
      const platformKey =
        platform === 'youtube'
          ? 'YouTube'
          : platform === 'reddit'
          ? 'Reddit'
          : platform === 'news'
          ? 'News'
          : platform.charAt(0).toUpperCase() + platform.slice(1)
      return stats.platform_stats[platformKey] || 0
    }

    // Fallback to counting from topics
    if (!topics || topics.length === 0) return 0
    if (platform === 'all') return topics.length
    return topics.filter((topic) => topic.platform.toLowerCase() === platform.toLowerCase()).length
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'reddit':
        return '🔴'
      // case 'twitter':
      //   return '🐦'
      case 'news':
        return '📰'
      case 'youtube':
        return '📺'
      default:
        return '🌐'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4" style={{ backgroundColor: '#ffffff' }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Platform</h3>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => onPlatformChange(platform)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedPlatform === platform
                ? 'bg-primary-600  text-white shadow-md ring-2 ring-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
            }`}
          >
            <span className="text-lg">{getPlatformIcon(platform)}</span>
            <span className="capitalize">{platform}</span>
            <span
              className={`text-xs px-2 py-1 rounded-full min-w-[20px] text-center ${
                selectedPlatform === platform ? 'bg-white  text-primary-600 font-semibold' : 'bg-gray-300 text-gray-700'
              }`}
            >
              {getPlatformCount(platform)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
