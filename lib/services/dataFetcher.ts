import { supabase, type TrendingTopic, type DatabaseStats } from '../supabase'
import { cacheManager, CACHE_KEYS } from '../cache'

const DATABASE_RETENTION_DAYS = 7
const MAX_TOPICS_PER_PLATFORM = 200
const MAX_TOTAL_TOPICS = 500

// Database cleanup configuration
const CLEANUP_CONFIG = {
  RETENTION_DAYS: 7,
  BATCH_SIZE: 1000, // Delete in batches to avoid timeouts
  CLEANUP_INTERVAL_HOURS: 24, // Run cleanup daily
} as const

export class DataFetcherService {
  private services: Record<string, any> = {}

  setServices(services: Record<string, any>) {
    this.services = services
  }

  async updateDatabaseWithFreshData(): Promise<void> {
    try {
      const freshData: Omit<TrendingTopic, 'id' | 'created_at'>[] = []

      // Fetch data from each service
      for (const [serviceName, service] of Object.entries(this.services)) {
        try {
          console.log(`📡 Fetching from ${serviceName}...`)
          const topics = await service.fetchTrendingTopics()
          const data = topics.slice(0, 50).map((topic: any) => ({
            platform: topic.platform,
            title: topic.title,
            description: topic.description,
            url: topic.url,
            score: Math.min(topic.score, 2147483647), // Max 32-bit integer
            engagement: Math.min(topic.engagement, 2147483647), // Max 32-bit integer
            category: topic.category,
            topic: topic.topic,
            tags: topic.tags,
            author: topic.author,
            timestamp: topic.timestamp,
          }))
          freshData.push(...data)
          console.log(`✅ Fetched ${data.length} topics from ${serviceName}`)
        } catch (error) {
          console.error(`❌ ${serviceName} API failed:`, error)
        }
      }

      // Update database with fresh data
      if (freshData.length > 0) {
        console.log(`\n💾 Writing ${freshData.length} topics to database...`)

        // Remove old data (older than DATABASE_RETENTION_DAYS days)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - DATABASE_RETENTION_DAYS)

        // Delete old data
        const { error: deleteError } = await supabase
          .from('trending_topics')
          .delete()
          .lt('timestamp', weekAgo.toISOString())

        if (deleteError) {
          if (deleteError.code === '42P01') {
            console.warn('Database table does not exist yet. Please run the Supabase setup script.')
            return
          }
          console.error('Error deleting old data:', deleteError)
        }

        // Insert data in batches to avoid timeouts and handle duplicates
        const batchSize = 50
        const batches = []
        for (let i = 0; i < freshData.length; i += batchSize) {
          batches.push(freshData.slice(i, i + batchSize))
        }

        console.log(`📦 Processing ${batches.length} batches...`)

        for (let i = 0; i < batches.length; i++) {
          const batch = batches[i]
          try {
            // Try to insert the batch
            const { error: insertError } = await supabase.from('trending_topics').insert(batch)

            // If there's a duplicate key error, insert records one by one
            if (insertError?.code === '23505') {
              console.log(`⚠️ Batch ${i + 1} has duplicates, inserting individually...`)
              for (const topic of batch) {
                try {
                  // Delete any existing record with the same platform and title
                  await supabase
                    .from('trending_topics')
                    .delete()
                    .eq('platform', topic.platform)
                    .eq('title', topic.title)

                  // Insert the new record
                  await supabase.from('trending_topics').insert(topic)
                } catch (error) {
                  console.error(`Failed to insert topic: ${topic.title}`, error)
                }
              }
            } else if (insertError) {
              console.error(`Error inserting batch ${i + 1}:`, insertError)
            } else {
              console.log(`✅ Batch ${i + 1} inserted successfully`)
            }
          } catch (error) {
            console.error(`Error processing batch ${i + 1}:`, error)
          }
        }

        // Clear cache to force fresh data on next request
        cacheManager.clearCache()
        console.log('\n✅ Database update completed')
      }
    } catch (error) {
      console.error('Background update failed:', error)
    }
  }

  async fetchTrendingTopics(sortBy = 'random', sortOrder = 'desc', limit = 100, offset = 0): Promise<TrendingTopic[]> {
    try {
      // Check cache first
      const cachedData = cacheManager.getCachedData<{ topics: TrendingTopic[]; timestamp: string }>(
        CACHE_KEYS.trending_topics
      )
      if (cachedData) {
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
        .range(offset, offset + limit - 1)

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
        // Check if it's a table doesn't exist error
        if (error.code === '42P01') {
          console.warn('Database table does not exist yet. Please run the Supabase setup script.')
          return []
        }
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

      // Cache the results (only for first page to avoid cache conflicts)
      if (offset === 0) {
        const cacheData = {
          topics: topics.slice(0, MAX_TOTAL_TOPICS),
          timestamp: new Date().toISOString(),
        }
        cacheManager.setCachedData(CACHE_KEYS.trending_topics, cacheData)
      }

      return topics
    } catch (error) {
      console.error('Error fetching trending topics:', error)
      return []
    }
  }

  async getStats(): Promise<DatabaseStats> {
    try {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      // Get platform counts from database using raw SQL
      const { data: platformStats, error: platformError } = await supabase.rpc('get_platform_stats', { days_ago: 7 })

      if (platformError) {
        console.error('Error fetching platform stats:', platformError)
        return {
          total_topics_7d: 0,
          total_topics_all_time: 0,
          platform_stats: {},
          category_stats: {},
        }
      }

      // Convert to required format
      const platformStatsMap: Record<string, number> = {}
      platformStats?.forEach((item: { platform: string; count: number }) => {
        platformStatsMap[item.platform] = item.count
      })

      // Get topic counts from database using raw SQL
      const { data: topicStats, error: topicError } = await supabase.rpc('get_topic_stats', { days_ago: 7 })

      if (topicError) {
        console.error('Error fetching topic stats:', topicError)
        return {
          total_topics_7d: 0,
          total_topics_all_time: 0,
          platform_stats: {},
          category_stats: {},
        }
      }

      // Convert to required format
      const topicStatsMap: Record<string, number> = {}
      topicStats?.forEach((item: { topic: string; count: number }) => {
        if (item.topic) {
          topicStatsMap[item.topic] = item.count
        }
      })

      // Get total topics in last 7 days
      const totalTopics7d = Object.values(platformStatsMap).reduce((sum, count) => sum + count, 0)

      // Get total topics all time
      const { count: totalTopicsAllTime, error: totalError } = await supabase
        .from('trending_topics')
        .select('*', { count: 'exact', head: true })

      if (totalError) {
        console.error('Error fetching total topics:', totalError)
        return {
          total_topics_7d: totalTopics7d,
          total_topics_all_time: totalTopics7d,
          platform_stats: platformStatsMap,
          category_stats: topicStatsMap,
        }
      }

      return {
        total_topics_7d: totalTopics7d,
        total_topics_all_time: totalTopicsAllTime || 0,
        platform_stats: platformStatsMap,
        category_stats: topicStatsMap,
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      return {
        total_topics_7d: 0,
        total_topics_all_time: 0,
        platform_stats: {},
        category_stats: {},
      }
    }
  }

  /**
   * Get total number of topics in the database
   */
  async getTotalTopicsCount(): Promise<number> {
    try {
      const { count, error } = await supabase.from('trending_topics').select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error getting total topics count:', error)
        return 0
      }

      return count || 0
    } catch (error) {
      console.error('Error getting total topics count:', error)
      return 0
    }
  }

  /**
   * Clean up old data from the database
   * Removes data older than CLEANUP_CONFIG.RETENTION_DAYS days
   */
  async cleanupOldData(): Promise<{ deletedCount: number; error?: string }> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_CONFIG.RETENTION_DAYS)

      console.log(`🧹 Starting database cleanup - removing data older than ${cutoffDate.toISOString()}`)

      // First, count how many records will be deleted
      const { count: totalToDelete, error: countError } = await supabase
        .from('trending_topics')
        .select('*', { count: 'exact', head: true })
        .lt('timestamp', cutoffDate.toISOString())

      if (countError) {
        console.error('Error counting old records:', countError)
        return { deletedCount: 0, error: countError.message }
      }

      if (!totalToDelete || totalToDelete === 0) {
        console.log('✅ No old data to clean up')
        return { deletedCount: 0 }
      }

      console.log(`🗑️ Found ${totalToDelete} records to delete`)

      // Delete old data
      const { error: deleteError } = await supabase
        .from('trending_topics')
        .delete()
        .lt('timestamp', cutoffDate.toISOString())

      if (deleteError) {
        console.error('Error deleting old data:', deleteError)
        return { deletedCount: 0, error: deleteError.message }
      }

      console.log(`✅ Successfully deleted ${totalToDelete} old records`)
      return { deletedCount: totalToDelete }
    } catch (error) {
      console.error('Error during database cleanup:', error)
      return {
        deletedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get database size information
   */
  async getDatabaseSize(): Promise<{ totalRecords: number; oldRecords: number; retentionDays: number }> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_CONFIG.RETENTION_DAYS)

      // Get total records
      const { count: totalRecords, error: totalError } = await supabase
        .from('trending_topics')
        .select('*', { count: 'exact', head: true })

      if (totalError) {
        console.error('Error counting total records:', totalError)
        return { totalRecords: 0, oldRecords: 0, retentionDays: CLEANUP_CONFIG.RETENTION_DAYS }
      }

      // Get old records count
      const { count: oldRecords, error: oldError } = await supabase
        .from('trending_topics')
        .select('*', { count: 'exact', head: true })
        .lt('timestamp', cutoffDate.toISOString())

      if (oldError) {
        console.error('Error counting old records:', oldError)
        return { totalRecords: totalRecords || 0, oldRecords: 0, retentionDays: CLEANUP_CONFIG.RETENTION_DAYS }
      }

      return {
        totalRecords: totalRecords || 0,
        oldRecords: oldRecords || 0,
        retentionDays: CLEANUP_CONFIG.RETENTION_DAYS,
      }
    } catch (error) {
      console.error('Error getting database size:', error)
      return { totalRecords: 0, oldRecords: 0, retentionDays: CLEANUP_CONFIG.RETENTION_DAYS }
    }
  }
}

export const dataFetcherService = new DataFetcherService()
