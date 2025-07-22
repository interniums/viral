import { supabase, type TrendingTopic, type DatabaseStats } from '../supabase'
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
      const freshData: Omit<TrendingTopic, 'id' | 'created_at'>[] = []

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
          timestamp: new Date(topic.timestamp).toISOString(),
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
          timestamp: new Date(topic.timestamp).toISOString(),
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
          timestamp: new Date(topic.timestamp).toISOString(),
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

        // Delete old data
        const { error: deleteError } = await supabase
          .from('trending_topics')
          .delete()
          .lt('timestamp', weekAgo.toISOString())

        if (deleteError) {
          console.error('Error deleting old data:', deleteError)
        }

        // Insert fresh data
        const { error: insertError } = await supabase.from('trending_topics').insert(freshData)

        if (insertError) {
          console.error('Error inserting fresh data:', insertError)
        } else {
          console.log(`✅ Database updated successfully with ${freshData.length} fresh items`)
        }

        // Clear cache to force fresh data on next request
        cacheManager.clearCache()
        console.log('🧹 Cache cleared for fresh data')
      } else {
        console.log('⚠️ No fresh data fetched - keeping existing database')
      }
    } catch (error) {
      console.error('❌ Background update failed:', error)
    }
  }

  async fetchTrendingTopics(sortBy = 'random', sortOrder = 'desc'): Promise<TrendingTopic[]> {
    try {
      // Check cache first
      const cachedData = cacheManager.getCachedData<{ topics: TrendingTopic[]; timestamp: string }>(
        CACHE_KEYS.trending_topics
      )
      if (cachedData) {
        console.log(`📦 Serving ${cachedData.topics.length} topics from cache`)

        // Apply sorting to cached data
        const topics = [...cachedData.topics]
        if (sortBy === 'engagement') {
          topics.sort((a, b) =>
            sortOrder === 'desc' ? (b.engagement || 0) - (a.engagement || 0) : (a.engagement || 0) - (b.engagement || 0)
          )
        } else if (sortBy === 'date') {
          topics.sort((a, b) =>
            sortOrder === 'desc'
              ? new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime()
              : new Date(a.timestamp || '').getTime() - new Date(b.timestamp || '').getTime()
          )
        }
        // If sortBy is 'random', keep the random order from cache

        return topics
      }

      // If no cache, fetch from database
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - DATABASE_RETENTION_DAYS)

      let query = supabase
        .from('trending_topics')
        .select('*')
        .gte('timestamp', weekAgo.toISOString())
        .limit(MAX_TOTAL_TOPICS)

      // Apply sorting
      if (sortBy === 'engagement') {
        query = query.order('engagement', { ascending: sortOrder === 'asc' })
      } else if (sortBy === 'date') {
        query = query.order('timestamp', { ascending: sortOrder === 'asc' })
      } else {
        // Random order - we'll shuffle in memory
        query = query.order('timestamp', { ascending: false })
      }

      const { data: results, error } = await query

      if (error) {
        console.error('Error fetching from Supabase:', error)
        return []
      }

      // Convert to the expected format
      const topics: TrendingTopic[] = (results || []).map((row: any) => ({
        id: row.id,
        platform: row.platform,
        title: row.title,
        description: row.description || '',
        url: row.url || '',
        score: row.score || 0,
        engagement: row.engagement || 0,
        category: row.category || '',
        tags: row.tags || [],
        timestamp: row.timestamp || new Date().toISOString(),
        topic: row.topic || 'general',
        author: row.author || 'Unknown',
        created_at: row.created_at,
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

  async getStats(): Promise<DatabaseStats> {
    try {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      // Platform distribution (last 7 days)
      const { data: platformStats, error: platformError } = await supabase
        .from('trending_topics')
        .select('platform')
        .gte('timestamp', weekAgo.toISOString())

      if (platformError) {
        console.error('Error fetching platform stats:', platformError)
        return {
          total_topics: 0,
          platforms: {},
          categories: {},
          last_update: new Date().toISOString(),
        }
      }

      const platformStatsMap: Record<string, number> = {}
      platformStats?.forEach((item) => {
        platformStatsMap[item.platform] = (platformStatsMap[item.platform] || 0) + 1
      })

      // Top categories (last 7 days)
      const { data: categoryStats, error: categoryError } = await supabase
        .from('trending_topics')
        .select('category')
        .gte('timestamp', weekAgo.toISOString())

      if (categoryError) {
        console.error('Error fetching category stats:', categoryError)
        return {
          total_topics: 0,
          platforms: {},
          categories: {},
          last_update: new Date().toISOString(),
        }
      }

      const categoryStatsMap: Record<string, number> = {}
      categoryStats?.forEach((item) => {
        if (item.category) {
          categoryStatsMap[item.category] = (categoryStatsMap[item.category] || 0) + 1
        }
      })

      // Total topics in database (all time)
      const { count: totalTopicsAllTime, error: totalError } = await supabase
        .from('trending_topics')
        .select('*', { count: 'exact', head: true })

      if (totalError) {
        console.error('Error fetching total topics:', totalError)
        return {
          total_topics: 0,
          platforms: {},
          categories: {},
          last_update: new Date().toISOString(),
        }
      }

      const totalTopics7d = Object.values(platformStatsMap).reduce((sum, count) => sum + count, 0)

      return {
        total_topics: totalTopics7d,
        platforms: platformStatsMap,
        categories: categoryStatsMap,
        last_update: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      return {
        total_topics: 0,
        platforms: {},
        categories: {},
        last_update: new Date().toISOString(),
      }
    }
  }
}

export const dataFetcherService = new DataFetcherService()
