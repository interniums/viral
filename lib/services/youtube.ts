import { BaseService } from './base'
import { Platform, Topic } from '../constants/enums'

interface YouTubeTopic {
  platform: Platform
  title: string
  description: string
  url: string
  score: number
  engagement: number
  timestamp: string
  category: string
  tags: string[]
  topic: Topic
  author: string
}

export class YouTubeService extends BaseService {
  private apiKey: string
  private MAX_DESCRIPTION_LENGTH = 200
  private ENGAGEMENT_SCORE_DIVISOR = 1000

  constructor() {
    super()
    this.apiKey = process.env.YOUTUBE_API_KEY || ''
  }

  private transformVideos(videos: any[]): YouTubeTopic[] {
    return videos.map((video) => {
      const snippet = video.snippet
      const statistics = video.statistics || {}

      // Calculate engagement score
      const viewCount = parseInt(statistics.viewCount || '0')
      const likeCount = parseInt(statistics.likeCount || '0')
      const commentCount = parseInt(statistics.commentCount || '0')
      const engagement = viewCount + likeCount * 10 + commentCount * 50

      return {
        platform: Platform.YouTube,
        title: snippet.title,
        description: snippet.description?.substring(0, this.MAX_DESCRIPTION_LENGTH) || 'No description available',
        url: `https://www.youtube.com/watch?v=${video.id}`,
        score: Math.floor(engagement / this.ENGAGEMENT_SCORE_DIVISOR),
        engagement: engagement,
        timestamp: new Date(snippet.publishedAt).toISOString(),
        category: snippet.categoryId || 'Video',
        tags: snippet.tags || ['video', 'youtube'],
        topic: Topic.Entertainment,
        author: snippet.channelTitle || 'Unknown Channel',
      }
    })
  }

  async fetchTrendingTopics(): Promise<YouTubeTopic[]> {
    if (!this.apiKey) {
      console.log('YouTube API key not found')
      return []
    }

    const trendingTopics: YouTubeTopic[] = []
    const seenTitles = new Set<string>()

    try {
      console.log('📺 Fetching from YouTube API...')

      const regions = ['US', 'GB', 'CA', 'AU']

      for (const region of regions) {
        try {
          const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${region}&maxResults=50&videoCategoryId=0&key=${this.apiKey}`

          const response = await fetch(url)

          if (!response.ok) {
            console.error(`Error fetching YouTube data for region ${region}:`, response.status)
            continue
          }

          const data = await response.json()

          for (const video of data.items || []) {
            if (video.snippet.title && !seenTitles.has(video.snippet.title)) {
              const snippet = video.snippet
              const statistics = video.statistics || {}

              // Calculate engagement score
              const viewCount = parseInt(statistics.viewCount || '0')
              const likeCount = parseInt(statistics.likeCount || '0')
              const commentCount = parseInt(statistics.commentCount || '0')
              const engagement = viewCount + likeCount * 10 + commentCount * 50

              // Detect topic based on title and description
              const videoText = `${snippet.title} ${snippet.description || ''}`
              const topicCategory = 'video' // Placeholder, actual detection logic needs to be re-evaluated

              const videoTags = ['youtube', 'video', 'trending', region.toLowerCase()]

              const topic: YouTubeTopic = {
                platform: Platform.YouTube,
                title: snippet.title,
                description:
                  snippet.description?.substring(0, this.MAX_DESCRIPTION_LENGTH) || 'Trending video on YouTube',
                url: `https://www.youtube.com/watch?v=${video.id}`,
                score: Math.floor(engagement / this.ENGAGEMENT_SCORE_DIVISOR),
                engagement: engagement,
                category: snippet.categoryId || 'Video',
                topic: Topic.Entertainment,
                tags: videoTags,
                author: snippet.channelTitle || 'Unknown Channel',
                timestamp: snippet.publishedAt,
              }

              trendingTopics.push(topic)
              seenTitles.add(snippet.title)

              if (trendingTopics.length >= 200) break
            }
          }

          if (trendingTopics.length >= 200) break
        } catch (error) {
          console.error(`Error fetching from YouTube region ${region}:`, error)
          continue
        }
      }

      console.log(`✅ Fetched ${trendingTopics.length} unique YouTube videos from API`)

      // If no videos found, create demo data
      if (trendingTopics.length === 0) {
        console.log('No YouTube videos found - creating demo data')
        const demoVideos = [
          'Amazing Street Food Tour in Tokyo',
          'How to Build a Sustainable Home',
          'Mind-blowing Magic Tricks Revealed',
          'SpaceX Launch Live Stream',
          'Best Travel Destinations 2024',
        ]

        for (let i = 0; i < demoVideos.length; i++) {
          const title = demoVideos[i]
          const detectedTopic = 'video' // Placeholder, actual detection logic needs to be re-evaluated

          const topic: YouTubeTopic = {
            platform: Platform.YouTube,
            title,
            description: 'Trending video on YouTube',
            url: 'https://youtube.com/watch?v=demo',
            score: 100 - i * 10,
            engagement: 100 - i * 10,
            category: 'Video',
            tags: ['youtube', 'video', 'trending'],
            topic: Topic.Entertainment,
            author: 'Unknown Channel',
            timestamp: new Date().toISOString(),
          }
          trendingTopics.push(topic)
        }
      }

      return trendingTopics
    } catch (error) {
      console.error('❌ YouTube API failed:', error)
      return []
    }
  }
}

export const youtubeService = new YouTubeService()
