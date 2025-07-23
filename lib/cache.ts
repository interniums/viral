interface CacheEntry<T> {
  data: T
  timestamp: number
}

interface CacheInfo {
  exists: boolean
  ttl_seconds: number
  ttl_minutes: number
}

export class CacheManager {
  private cacheDuration: number
  private memoryCache: Map<string, CacheEntry<any>>

  constructor(cacheDurationSeconds = 900) {
    this.cacheDuration = cacheDurationSeconds
    this.memoryCache = new Map()
  }

  getCachedData<T>(key: string): T | null {
    const entry = this.memoryCache.get(key)
    if (entry) {
      const elapsed = Date.now() - entry.timestamp
      if (elapsed < this.cacheDuration * 1000) {
        return entry.data
      }
    }
    return null
  }

  setCachedData<T>(key: string, data: T): void {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  isCacheValid(key: string): boolean {
    return this.getCachedData(key) !== null
  }

  getCacheInfo(key: string): CacheInfo {
    const entry = this.memoryCache.get(key)
    if (entry) {
      const elapsed = Date.now() - entry.timestamp
      const remaining = Math.max(0, this.cacheDuration * 1000 - elapsed)
      return {
        exists: remaining > 0,
        ttl_seconds: Math.floor(remaining / 1000),
        ttl_minutes: Math.floor(remaining / 60000),
      }
    }
    return { exists: false, ttl_seconds: 0, ttl_minutes: 0 }
  }

  clearCache(key?: string): void {
    if (key) {
      this.memoryCache.delete(key)
    } else {
      this.memoryCache.clear()
    }
  }
}

// Global cache manager instance
export const cacheManager = new CacheManager()

// Cache keys (simplified for new architecture)
export const CACHE_KEYS = {
  all_trending_topics: 'viral:trending:all_topics',
  stats: 'viral:stats:overview',
  last_update: 'viral:last_update',
} as const
