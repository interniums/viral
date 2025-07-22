import { detectTopicCategory } from '../utils/topicDetection'

interface YouTubeVideo {
  id: string
  snippet: {
    title: string
    description: string
    publishedAt: string
    channelTitle: string
    categoryId: string
  }
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
}

interface YouTubeTopic {
  platform: string
  title: string
  description: string
  url: string
  score: number
  engagement: number
  category: string
  topic: string
  tags: string[]
  author: string
  timestamp: string
}

export class YouTubeService {
  private apiKey: string
  private readonly MAX_DESCRIPTION_LENGTH = 200
  private readonly ENGAGEMENT_SCORE_DIVISOR = 1000

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || ''
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
              const topicCategory = detectTopicCategory('youtube', videoText)

              const videoTags = ['youtube', 'video', 'trending', region.toLowerCase()]

              const topic: YouTubeTopic = {
                platform: 'YouTube',
                title: snippet.title,
                description:
                  snippet.description?.substring(0, this.MAX_DESCRIPTION_LENGTH) || 'Trending video on YouTube',
                url: `https://www.youtube.com/watch?v=${video.id}`,
                score: Math.floor(engagement / this.ENGAGEMENT_SCORE_DIVISOR),
                engagement,
                category: snippet.categoryId || 'Video',
                topic: topicCategory,
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
          const detectedTopic = detectTopicCategory('youtube', title)

          const topic: YouTubeTopic = {
            platform: 'YouTube',
            title,
            description: 'Trending video on YouTube',
            url: 'https://youtube.com/watch?v=demo',
            score: 100 - i * 10,
            engagement: 100 - i * 10,
            category: 'Video',
            tags: ['youtube', 'video', 'trending'],
            topic: detectedTopic,
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
