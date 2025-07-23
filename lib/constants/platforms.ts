export interface Platform {
  key: string
  label: string
  icon: string
  color: string
  description: string
  category: 'social' | 'news' | 'tech' | 'gaming' | 'crypto' | 'entertainment'
  apiRequired: boolean
  apiKeyName?: string
  baseUrl?: string
  status: 'active' | 'demo' | 'beta'
}

export const PLATFORMS: Platform[] = [
  {
    key: 'Reddit',
    label: 'Reddit',
    icon: '/images/platforms/reddit-logo.svg',
    color: 'orange',
    description: 'Popular social news aggregation and discussion website',
    category: 'social',
    apiRequired: true,
    apiKeyName: 'REDDIT_CLIENT_ID',
    baseUrl: 'https://www.reddit.com',
    status: 'active',
  },
  {
    key: 'YouTube',
    label: 'YouTube',
    icon: '/images/platforms/youtube-logo.svg',
    color: 'red',
    description: 'Video sharing and social media platform',
    category: 'entertainment',
    apiRequired: true,
    apiKeyName: 'YOUTUBE_API_KEY',
    baseUrl: 'https://www.youtube.com',
    status: 'active',
  },
  {
    key: 'Google Trends',
    label: 'Google Trends',
    icon: '/images/platforms/google-trends-icon.svg',
    color: 'orange',
    description: "Google's search trend analysis tool",
    category: 'news',
    apiRequired: false,
    baseUrl: 'https://trends.google.com',
    status: 'demo',
  },
  {
    key: 'Hacker News',
    label: 'Hacker News',
    icon: '/images/platforms/hackernews-logo.svg',
    color: 'orange',
    description: 'Social news website focusing on computer science and entrepreneurship',
    category: 'tech',
    apiRequired: false,
    baseUrl: 'https://news.ycombinator.com',
    status: 'active',
  },
  {
    key: 'GitHub',
    label: 'GitHub',
    icon: '/images/platforms/github-logo.svg',
    color: 'gray',
    description: 'Git hosting service and software development platform',
    category: 'tech',
    apiRequired: false,
    baseUrl: 'https://github.com',
    status: 'active',
  },
  {
    key: 'Stack Overflow',
    label: 'Stack Overflow',
    icon: '/images/platforms/stackoverflow-logo.svg',
    color: 'orange',
    description: 'Question and answer site for professional and enthusiast programmers',
    category: 'tech',
    apiRequired: false,
    baseUrl: 'https://stackoverflow.com',
    status: 'active',
  },
  {
    key: 'Product Hunt',
    label: 'Product Hunt',
    icon: '/images/platforms/producthunt-logo.svg',
    color: 'red',
    description: 'Platform for discovering new products and startups',
    category: 'tech',
    apiRequired: true,
    apiKeyName: 'PRODUCT_HUNT_ACCESS_TOKEN',
    baseUrl: 'https://www.producthunt.com',
    status: 'active',
  },
  {
    key: 'Twitch',
    label: 'Twitch',
    icon: '/images/platforms/twitch-logo.svg',
    color: 'purple',
    description: 'Live streaming platform for gamers and content creators',
    category: 'gaming',
    apiRequired: true,
    apiKeyName: 'TWITCH_CLIENT_ID',
    baseUrl: 'https://www.twitch.tv',
    status: 'active',
  },
  {
    key: 'Mastodon',
    label: 'Mastodon',
    icon: '/images/platforms/joinmastodon-logo.svg',
    color: 'blue',
    description: 'Decentralized social media platform',
    category: 'social',
    apiRequired: true,
    apiKeyName: 'MASTODON_ACCESS_TOKEN',
    baseUrl: 'https://mastodon.social',
    status: 'active',
  },
  {
    key: 'GNews',
    label: 'GNews',
    icon: '/images/platforms/gnews-logo.svg',
    color: 'green',
    description: 'News API providing real-time news from various sources',
    category: 'news',
    apiRequired: true,
    apiKeyName: 'GNEWS_API_KEY',
    baseUrl: 'https://gnews.io',
    status: 'active',
  },
  {
    key: 'CoinGecko',
    label: 'CoinGecko',
    icon: '/images/platforms/coingecko-logo.svg',
    color: 'yellow',
    description: 'Cryptocurrency data and analytics platform',
    category: 'crypto',
    apiRequired: false,
    baseUrl: 'https://www.coingecko.com',
    status: 'active',
  },
  {
    key: 'Dev.to',
    label: 'Dev.to',
    icon: '/images/platforms/devto-logo.svg',
    color: 'purple',
    description: 'Community of software developers sharing articles and discussions',
    category: 'tech',
    apiRequired: false,
    baseUrl: 'https://dev.to',
    status: 'active',
  },
  {
    key: 'Steam',
    label: 'Steam',
    icon: '/images/platforms/steam-logo.svg',
    color: 'blue',
    description: 'Digital distribution platform for video games',
    category: 'gaming',
    apiRequired: false,
    baseUrl: 'https://store.steampowered.com',
    status: 'active',
  },
  {
    key: 'The Guardian',
    label: 'The Guardian',
    icon: '/images/platforms/the-guardian-logo.svg',
    color: 'orange',
    description: 'British daily newspaper and news website',
    category: 'news',
    apiRequired: true,
    apiKeyName: 'GUARDIAN_API_KEY',
    baseUrl: 'https://www.theguardian.com',
    status: 'active',
  },
  {
    key: 'Binance',
    label: 'Binance',
    icon: '/images/platforms/binance-logo.svg',
    color: 'yellow',
    description: 'Cryptocurrency exchange and trading platform',
    category: 'crypto',
    apiRequired: false,
    baseUrl: 'https://www.binance.com',
    status: 'active',
  },
]

// Helper functions
export const getPlatformByKey = (key: string): Platform | undefined => {
  return PLATFORMS.find((platform) => platform.key === key)
}

export const getPlatformsByCategory = (category: Platform['category']): Platform[] => {
  return PLATFORMS.filter((platform) => platform.category === category)
}

export const getActivePlatforms = (): Platform[] => {
  return PLATFORMS.filter((platform) => platform.status === 'active')
}

export const getPlatformsRequiringAPI = (): Platform[] => {
  return PLATFORMS.filter((platform) => platform.apiRequired)
}

export const getPlatformKeys = (): string[] => {
  return PLATFORMS.map((platform) => platform.key)
}

export const getPlatformLabels = (): string[] => {
  return PLATFORMS.map((platform) => platform.label)
}

// Platform categories
export const PLATFORM_CATEGORIES = {
  social: 'Social Media',
  news: 'News & Media',
  tech: 'Technology',
  gaming: 'Gaming',
  crypto: 'Cryptocurrency',
  entertainment: 'Entertainment',
} as const

// Platform statuses
export const PLATFORM_STATUSES = {
  active: 'Active',
  demo: 'Demo Data',
  beta: 'Beta',
} as const
