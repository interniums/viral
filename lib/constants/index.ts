import { Platform, Topic, PlatformCategory, TopicCategory } from './enums'
import { PLATFORMS } from './platforms'
import { TOPICS } from './topics'

// App configuration (consolidated from lib/constants.ts)
export const APP_CONFIG = {
  INITIAL_DISPLAY_COUNT: 100,
  LOAD_MORE_INCREMENT: 100,
  SCROLL_THRESHOLD: 300,
  DB_CHECK_INTERVAL: 60000, // 1 minute - check for database updates
  SKELETON_HEIGHT: 120,
} as const

// Platform metadata
export const PLATFORM_COUNT = Object.keys(Platform).length

// Platform and topic metadata
export const PLATFORM_METADATA = {
  total: PLATFORM_COUNT,
  categories: Object.keys(PlatformCategory).length,
  apiRequired: PLATFORMS.filter((p) => p.apiRequired).length,
  demoOnly: PLATFORMS.filter((p) => p.status === 'demo').length,
  active: PLATFORMS.filter((p) => p.status === 'active').length,
}

// API endpoints
export const API_ENDPOINTS = {
  TRENDING_ALL: '/api/trending/all',
  TRENDING: '/api/trending',
  STATS: '/api/stats',
  LAST_UPDATE: '/api/last-update',
  CLEANUP: '/api/cleanup',
  UPDATE_TRIGGER: '/api/update/trigger',
  UPDATE_DATABASE: '/api/cron/update-database',
} as const

// Storage keys
export const STORAGE_KEYS = {
  LAST_UPDATE: 'last_update',
  LAST_DB_UPDATE: 'last_db_update',
} as const

// Cache keys
export const CACHE_KEYS = {
  trending_topics: 'trending_topics',
  platform_stats: 'platform_stats',
  topic_stats: 'topic_stats',
  last_update: 'last_update',
} as const

// Validation functions
export const isValidPlatform = (platform: string): platform is Platform => {
  return Object.values(Platform).includes(platform as Platform)
}

export const isValidTopic = (topic: string): topic is Topic => {
  return Object.values(Topic).includes(topic as Topic)
}

// Search functions
export const searchPlatforms = (query: string) => {
  const lowerQuery = query.toLowerCase()
  return PLATFORMS.filter(
    (platform) =>
      platform.label.toLowerCase().includes(lowerQuery) ||
      platform.description.toLowerCase().includes(lowerQuery) ||
      platform.category.toLowerCase().includes(lowerQuery)
  )
}

export const searchTopics = (query: string) => {
  const lowerQuery = query.toLowerCase()
  return TOPICS.filter(
    (topic) =>
      topic.label.toLowerCase().includes(lowerQuery) ||
      topic.description.toLowerCase().includes(lowerQuery) ||
      topic.category.toLowerCase().includes(lowerQuery)
  )
}

// Category-based filtering
export const getPlatformsByCategory = (category: PlatformCategory) => {
  return PLATFORMS.filter((platform) => platform.category === category)
}

export const getTopicsByCategory = (category: TopicCategory) => {
  return TOPICS.filter((topic) => topic.category === category)
}

// Status-based filtering
export const getActivePlatforms = () => {
  return PLATFORMS.filter((platform) => platform.status === 'active')
}

// Export enums
export { Platform, Topic, PlatformCategory, TopicCategory }

// Export platform and topic data
export { PLATFORMS, TOPICS }
