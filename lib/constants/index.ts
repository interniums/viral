// Export all platform constants
export * from './platforms'

// Export all topic constants
export * from './topics'

// Re-export existing constants
export * from '../constants'

// Combined helper functions
import { PLATFORMS, getPlatformKeys, getPlatformLabels } from './platforms'
import { TOPICS, getTopicKeys, getTopicLabels, getTopicIcons } from './topics'

// Combined platform and topic data
export const ALL_PLATFORMS = PLATFORMS
export const ALL_TOPICS = TOPICS

// Combined helper functions
export const getAllPlatformKeys = getPlatformKeys
export const getAllPlatformLabels = getPlatformLabels
export const getAllTopicKeys = getTopicKeys
export const getAllTopicLabels = getTopicLabels
export const getAllTopicIcons = getTopicIcons

// Platform and topic counts
export const PLATFORM_COUNT = PLATFORMS.length
export const TOPIC_COUNT = TOPICS.length

// Default selections
export const DEFAULT_PLATFORMS = getPlatformKeys().slice(0, 3) // First 3 platforms
export const DEFAULT_TOPICS = getTopicKeys().slice(0, 11) // First 11 topics

// Platform and topic metadata
export const PLATFORM_METADATA = {
  total: PLATFORM_COUNT,
  categories: 6, // social, news, tech, gaming, crypto, entertainment
  apiRequired: PLATFORMS.filter((p) => p.apiRequired).length,
  demoOnly: PLATFORMS.filter((p) => p.status === 'demo').length,
  active: PLATFORMS.filter((p) => p.status === 'active').length,
}

export const TOPIC_METADATA = {
  total: TOPIC_COUNT,
  categories: 10, // general, technology, entertainment, finance, gaming, news, crypto, lifestyle, sports, politics
  technology: TOPICS.filter((t) => t.category === 'technology').length,
  gaming: TOPICS.filter((t) => t.category === 'gaming').length,
  crypto: TOPICS.filter((t) => t.category === 'crypto').length,
  news: TOPICS.filter((t) => t.category === 'news').length,
}

// Validation functions
export const isValidPlatform = (platform: string): boolean => {
  return PLATFORMS.some((p) => p.key === platform)
}

export const isValidTopic = (topic: string): boolean => {
  return TOPICS.some((t) => t.key === topic)
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
      topic.category.toLowerCase().includes(lowerQuery) ||
      topic.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}

// Category-based filtering
export const getPlatformsByCategory = (category: string) => {
  return PLATFORMS.filter((platform) => platform.category === category)
}

export const getTopicsByCategory = (category: string) => {
  return TOPICS.filter((topic) => topic.category === category)
}

// API requirement checking
export const getPlatformsRequiringAPI = () => {
  return PLATFORMS.filter((platform) => platform.apiRequired)
}

export const getPlatformsNotRequiringAPI = () => {
  return PLATFORMS.filter((platform) => !platform.apiRequired)
}

// Status-based filtering
export const getActivePlatforms = () => {
  return PLATFORMS.filter((platform) => platform.status === 'active')
}

export const getDemoPlatforms = () => {
  return PLATFORMS.filter((platform) => platform.status === 'demo')
}

// Color utilities
export const getPlatformColor = (platformKey: string): string => {
  const platform = PLATFORMS.find((p) => p.key === platformKey)
  return platform?.color || 'gray'
}

export const getTopicColor = (topicKey: string): string => {
  const topic = TOPICS.find((t) => t.key === topicKey)
  return topic?.color || 'gray'
}

// Icon utilities
export const getPlatformIcon = (platformKey: string): string => {
  const platform = PLATFORMS.find((p) => p.key === platformKey)
  return platform?.icon || '/images/platforms/default.svg'
}

export const getTopicIcon = (topicKey: string): string => {
  const topic = TOPICS.find((t) => t.key === topicKey)
  return topic?.icon || '📌'
}

// Description utilities
export const getPlatformDescription = (platformKey: string): string => {
  const platform = PLATFORMS.find((p) => p.key === platformKey)
  return platform?.description || 'Platform description not available'
}

export const getTopicDescription = (topicKey: string): string => {
  const topic = TOPICS.find((t) => t.key === topicKey)
  return topic?.description || 'Topic description not available'
}
