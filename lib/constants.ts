// App Configuration
export const APP_CONFIG = {
  DEFAULT_PLATFORMS: ['Reddit', 'YouTube', 'Google Trends'],
  DEFAULT_TOPICS: [
    'general',
    'technology',
    'sports',
    'entertainment',
    'politics',
    'crypto',
    'gaming',
    'culture',
    'finance',
    'memes',
    'lifestyle',
  ],
  INITIAL_DISPLAY_COUNT: 50,
  LOAD_MORE_INCREMENT: 50,
  SCROLL_THRESHOLD: 300,
  UPDATE_INTERVAL: 300000, // 5 minutes
  DB_CHECK_INTERVAL: 60000, // 1 minute
  SKELETON_HEIGHT: 120,
} as const

// API Endpoints
export const API_ENDPOINTS = {
  TRENDING: '/api/trending',
  TRENDING_ALL: '/api/trending/all',
  STATS: '/api/stats',
  LAST_UPDATE: '/api/last-update',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  LAST_DB_UPDATE: 'viral_last_db_update',
} as const

// Platform Colors
export const PLATFORM_COLORS = {
  Reddit: 'orange',
  YouTube: 'red',
  'Google Trends': 'orange',
} as const

// Sort Options
export const SORT_OPTIONS = {
  RANDOM: 'random',
  ENGAGEMENT: 'engagement',
  DATE: 'date',
} as const

// Order Options
export const ORDER_OPTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const
