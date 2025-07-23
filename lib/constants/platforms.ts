import { Platform as PlatformEnum, PlatformCategory, PlatformStatus } from './enums'

export interface Platform {
  key: PlatformEnum
  label: string
  icon: string
  color: string
  description: string
  category: PlatformCategory
  apiRequired: boolean
  apiKeyName?: string
  baseUrl?: string
  status: PlatformStatus
}

export const PLATFORMS: Platform[] = [
  {
    key: PlatformEnum.Reddit,
    label: 'Reddit',
    icon: '/images/platforms/reddit-logo.svg',
    color: 'orange',
    description: 'Popular social news aggregation and discussion website',
    category: PlatformCategory.Social,
    apiRequired: true,
    apiKeyName: 'REDDIT_CLIENT_ID',
    baseUrl: 'https://www.reddit.com',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.YouTube,
    label: 'YouTube',
    icon: '/images/platforms/youtube-logo.svg',
    color: 'red',
    description: 'Video sharing and social media platform',
    category: PlatformCategory.Entertainment,
    apiRequired: true,
    apiKeyName: 'YOUTUBE_API_KEY',
    baseUrl: 'https://www.youtube.com',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.GoogleTrends,
    label: 'Google Trends',
    icon: '/images/platforms/google-trends-icon.svg',
    color: 'orange',
    description: "Google's search trend analysis tool",
    category: PlatformCategory.News,
    apiRequired: false,
    baseUrl: 'https://trends.google.com',
    status: PlatformStatus.Demo,
  },
  {
    key: PlatformEnum.HackerNews,
    label: 'Hacker News',
    icon: '/images/platforms/hackernews-logo.svg',
    color: 'orange',
    description: 'Social news website focusing on computer science and entrepreneurship',
    category: PlatformCategory.Tech,
    apiRequired: false,
    baseUrl: 'https://news.ycombinator.com',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.GitHub,
    label: 'GitHub',
    icon: '/images/platforms/github-logo.svg',
    color: 'gray',
    description: 'Git hosting service and software development platform',
    category: PlatformCategory.Tech,
    apiRequired: false,
    baseUrl: 'https://github.com',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.StackOverflow,
    label: 'Stack Overflow',
    icon: '/images/platforms/stackoverflow-logo.svg',
    color: 'orange',
    description: 'Question and answer site for professional and enthusiast programmers',
    category: PlatformCategory.Tech,
    apiRequired: false,
    baseUrl: 'https://stackoverflow.com',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.ProductHunt,
    label: 'Product Hunt',
    icon: '/images/platforms/producthunt-logo.svg',
    color: 'red',
    description: 'Platform for discovering new products and startups',
    category: PlatformCategory.Tech,
    apiRequired: true,
    apiKeyName: 'PRODUCT_HUNT_ACCESS_TOKEN',
    baseUrl: 'https://www.producthunt.com',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.Twitch,
    label: 'Twitch',
    icon: '/images/platforms/twitch-logo.svg',
    color: 'purple',
    description: 'Live streaming platform for gamers and content creators',
    category: PlatformCategory.Gaming,
    apiRequired: true,
    apiKeyName: 'TWITCH_CLIENT_ID',
    baseUrl: 'https://www.twitch.tv',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.Mastodon,
    label: 'Mastodon',
    icon: '/images/platforms/joinmastodon-logo.svg',
    color: 'blue',
    description: 'Decentralized social media platform',
    category: PlatformCategory.Social,
    apiRequired: true,
    apiKeyName: 'MASTODON_ACCESS_TOKEN',
    baseUrl: 'https://mastodon.social',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.GNews,
    label: 'GNews',
    icon: '/images/platforms/gnews-logo.svg',
    color: 'green',
    description: 'News API providing real-time news from various sources',
    category: PlatformCategory.News,
    apiRequired: true,
    apiKeyName: 'GNEWS_API_KEY',
    baseUrl: 'https://gnews.io',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.CoinGecko,
    label: 'CoinGecko',
    icon: '/images/platforms/coingecko-logo.svg',
    color: 'yellow',
    description: 'Cryptocurrency data and analytics platform',
    category: PlatformCategory.Crypto,
    apiRequired: false,
    baseUrl: 'https://www.coingecko.com',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.DevTo,
    label: 'Dev.to',
    icon: '/images/platforms/devto-logo.svg',
    color: 'purple',
    description: 'Community of software developers sharing articles and discussions',
    category: PlatformCategory.Tech,
    apiRequired: false,
    baseUrl: 'https://dev.to',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.Steam,
    label: 'Steam',
    icon: '/images/platforms/steam-logo.svg',
    color: 'blue',
    description: 'Digital distribution platform for video games',
    category: PlatformCategory.Gaming,
    apiRequired: false,
    baseUrl: 'https://store.steampowered.com',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.TheGuardian,
    label: 'The Guardian',
    icon: '/images/platforms/the-guardian-logo.svg',
    color: 'orange',
    description: 'British daily newspaper and news website',
    category: PlatformCategory.News,
    apiRequired: true,
    apiKeyName: 'GUARDIAN_API_KEY',
    baseUrl: 'https://www.theguardian.com',
    status: PlatformStatus.Active,
  },
  {
    key: PlatformEnum.Binance,
    label: 'Binance',
    icon: '/images/platforms/binance-logo.svg',
    color: 'yellow',
    description: 'Cryptocurrency exchange and trading platform',
    category: PlatformCategory.Crypto,
    apiRequired: false,
    baseUrl: 'https://www.binance.com',
    status: PlatformStatus.Active,
  },
]

// Helper functions
export const getPlatformByKey = (key: PlatformEnum): Platform | undefined => {
  return PLATFORMS.find((platform) => platform.key === key)
}

export const getPlatformsByCategory = (category: PlatformCategory): Platform[] => {
  return PLATFORMS.filter((platform) => platform.category === category)
}

export const getActivePlatforms = (): Platform[] => {
  return PLATFORMS.filter((platform) => platform.status === PlatformStatus.Active)
}

export const getPlatformsRequiringAPI = (): Platform[] => {
  return PLATFORMS.filter((platform) => platform.apiRequired)
}

export const getPlatformKeys = (): PlatformEnum[] => {
  return PLATFORMS.map((platform) => platform.key)
}

export const getPlatformLabels = (): string[] => {
  return PLATFORMS.map((platform) => platform.label)
}

// Platform categories
export const PLATFORM_CATEGORIES = {
  [PlatformCategory.Social]: 'Social Media',
  [PlatformCategory.News]: 'News & Media',
  [PlatformCategory.Tech]: 'Technology',
  [PlatformCategory.Gaming]: 'Gaming',
  [PlatformCategory.Crypto]: 'Cryptocurrency',
  [PlatformCategory.Entertainment]: 'Entertainment',
} as const

// Platform statuses
export const PLATFORM_STATUSES = {
  [PlatformStatus.Active]: 'Active',
  [PlatformStatus.Demo]: 'Demo Data',
  [PlatformStatus.Beta]: 'Beta',
} as const
