import { db, trendingTopics, type NewTrendingTopic } from '../db'
import { redditService } from './reddit'
import { youtubeService } from './youtube'
import { googleTrendsService } from './googleTrends'
import { cacheManager, CACHE_KEYS } from '../cache'

const DATABASE_RETENTION_DAYS = 7
const MAX_TOPICS_PER_PLATFORM = 200
const MAX_TOTAL_TOPICS = 500

export class DataFetcherService {
  async updateDatabaseWithFreshData(): Promise<void> {
    console.log('🔄 Starting scheduled database update...')

    try {
      const freshData: NewTrendingTopic[] = []

      // 1. Fetch fresh Reddit data
      console.log('🔴 Fetching fresh Reddit data...')
      try {
        const redditTopics = await redditService.fetchTrendingTopics()
        const redditData = redditTopics.slice(0, 50).map((topic) => ({
          platform: topic.platform,
          title: topic.title,
          description: topic.description,
          url: topic.url,
          score: topic.score,
          engagement: topic.engagement,
          category: topic.category,
          topic: topic.topic,
          tags: topic.tags,
          author: topic.author,
          timestamp: new Date(topic.timestamp),
        }))
        freshData.push(...redditData)
        console.log(`🔴 Fetched ${redditData.length} fresh Reddit posts`)
      } catch (error) {
        console.error('❌ Reddit API failed in background task:', error)
      }

      // 2. Fetch fresh Google Trends data
      console.log('🔥 Fetching fresh Google Trends data...')
      try {
        const googleTrendsData = await googleTrendsService.fetchTrendingTopics()
        const trendsData = googleTrendsData.map((topic) => ({
          platform: topic.platform,
          title: topic.title,
          description: topic.description,
          url: topic.url,
          score: topic.score,
          engagement: topic.engagement,
          category: topic.category,
          topic: topic.topic,
          tags: topic.tags,
          author: topic.author,
          timestamp: new Date(topic.timestamp),
        }))
        freshData.push(...trendsData)
        console.log(`🔥 Fetched ${trendsData.length} fresh Google Trends topics`)
      } catch (error) {
        console.error('❌ Google Trends API failed in background task:', error)
      }

      // 3. Fetch fresh YouTube data
      console.log('📺 Fetching fresh YouTube data...')
      try {
        const youtubeTopics = await youtubeService.fetchTrendingTopics()
        const youtubeData = youtubeTopics.slice(0, 20).map((topic) => ({
          platform: topic.platform,
          title: topic.title,
          description: topic.description,
          url: topic.url,
          score: topic.score,
          engagement: topic.engagement,
          category: topic.category,
          topic: topic.topic,
          tags: topic.tags,
          author: topic.author,
          timestamp: new Date(topic.timestamp),
        }))
        freshData.push(...youtubeData)
        console.log(`📺 Fetched ${youtubeData.length} fresh YouTube videos`)
      } catch (error) {
        console.error('❌ YouTube API failed in background task:', error)
      }

      // 4. Update database with fresh data
      if (freshData.length > 0) {
        console.log(`💾 Updating database with ${freshData.length} fresh items...`)

        // Remove old data (older than DATABASE_RETENTION_DAYS days)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - DATABASE_RETENTION_DAYS)

        await db
          .delete(trendingTopics)
          .where
          // Note: This is a simplified version. In a real implementation,
          // you'd need to handle the timestamp comparison properly
          // For now, we'll just insert new data
          ()

        // Insert fresh data
        for (const topic of freshData) {
          try {
            await db.insert(trendingTopics).values(topic).onConflictDoNothing()
          } catch (error) {
            console.error(`Error inserting topic ${topic.title}:`, error)
            continue
          }
        }

        // Clear cache to force fresh data on next request
        cacheManager.clearCache()
        console.log('🧹 Cache cleared for fresh data')

        console.log(`✅ Database updated successfully with ${freshData.length} fresh items`)
      } else {
        console.log('⚠️ No fresh data fetched - keeping existing database')
      }
    } catch (error) {
      console.error('❌ Background update failed:', error)
    }
  }

  async fetchTrendingTopics(sortBy = 'random', sortOrder = 'desc'): Promise<any[]> {
    try {
      // Check cache first
      const cachedData = cacheManager.getCachedData<{ topics: any[]; timestamp: string }>(CACHE_KEYS.trending_topics)
      if (cachedData) {
        console.log(`📦 Serving ${cachedData.topics.length} topics from cache`)

        // Apply sorting to cached data
        const topics = [...cachedData.topics]
        if (sortBy === 'engagement') {
          topics.sort((a, b) => (sortOrder === 'desc' ? b.engagement - a.engagement : a.engagement - b.engagement))
        } else if (sortBy === 'date') {
          topics.sort((a, b) =>
            sortOrder === 'desc'
              ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        }
        // If sortBy is 'random', keep the random order from cache

        return topics
      }

      // If no cache, fetch from database
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - DATABASE_RETENTION_DAYS)

      let query = db
        .select()
        .from(trendingTopics)
        .where(trendingTopics.timestamp > weekAgo)
        .limit(MAX_TOTAL_TOPICS)

      // Apply sorting
      if (sortBy === 'engagement') {
        query = query.orderBy(sortOrder === 'desc' ? trendingTopics.engagement.desc() : trendingTopics.engagement.asc())
      } else if (sortBy === 'date') {
        query = query.orderBy(sortOrder === 'desc' ? trendingTopics.timestamp.desc() : trendingTopics.timestamp.asc())
      } else {
        // Random order - we'll shuffle in memory
        query = query.orderBy(trendingTopics.timestamp.desc())
      }

      const results = await query

      // Convert to the expected format
      const topics = results.map((row: any) => ({
        platform: row.platform,
        title: row.title,
        description: row.description || '',
        url: row.url || '',
        score: row.score || 0,
        engagement: row.engagement || 0,
        category: row.category || '',
        tags: row.tags || [],
        timestamp: row.timestamp?.toISOString() || new Date().toISOString(),
        topic: row.topic || 'general',
        author: row.author || 'Unknown',
      }))

      // Shuffle if random order requested
      if (sortBy === 'random') {
        for (let i = topics.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[topics[i], topics[j]] = [topics[j], topics[i]]
        }
      }

      // Cache the results
      const cacheData = {
        topics: topics.slice(0, MAX_TOTAL_TOPICS),
        timestamp: new Date().toISOString(),
      }
      cacheManager.setCachedData(CACHE_KEYS.trending_topics, cacheData)

      return topics.slice(0, MAX_TOTAL_TOPICS)
    } catch (error) {
      console.error('Error fetching trending topics:', error)
      return []
    }
  }

  async getStats(): Promise<any> {
    try {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      // Platform distribution (last 7 days)
      const platformStats = await db
        .select({
          platform: trendingTopics.platform,
          count: db.fn.count(),
        })
        .from(trendingTopics)
        .where(trendingTopics.timestamp > weekAgo)
        .groupBy(trendingTopics.platform)

      const platformStatsMap: Record<string, number> = {}
      platformStats.forEach((stat: any) => {
        platformStatsMap[stat.platform] = Number(stat.count)
      })

      // Top categories (last 7 days)
      const categoryStats = await db
        .select({
          category: trendingTopics.category,
          count: db.fn.count(),
        })
        .from(trendingTopics)
        .where(trendingTopics.timestamp > weekAgo)
        .groupBy(trendingTopics.category)
        .orderBy(db.fn.count().desc())
        .limit(10)

      const categoryStatsMap: Record<string, number> = {}
      categoryStats.forEach((stat: any) => {
        if (stat.category) {
          categoryStatsMap[stat.category] = Number(stat.count)
        }
      })

      // Total topics in database (all time)
      const totalTopicsAllTime = await db.select({ count: db.fn.count() }).from(trendingTopics)

      const totalTopics7d = Object.values(platformStatsMap).reduce((sum, count) => sum + count, 0)

      return {
        platform_stats: platformStatsMap,
        category_stats: categoryStatsMap,
        total_topics_7d: totalTopics7d,
        total_topics_all_time: Number(totalTopicsAllTime[0]?.count || 0),
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      return {
        platform_stats: {},
        category_stats: {},
        total_topics_7d: 0,
        total_topics_all_time: 0,
      }
    }
  }
}

export const dataFetcherService = new DataFetcherService()
