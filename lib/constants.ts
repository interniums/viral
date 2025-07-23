// App Configuration
export const APP_CONFIG = {
  INITIAL_DISPLAY_COUNT: 100,
  LOAD_MORE_INCREMENT: 100,
  SCROLL_THRESHOLD: 300,
  DB_CHECK_INTERVAL: 60000, // 1 minute - check for database updates
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
