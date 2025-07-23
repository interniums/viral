import { detectTopicCategory } from '../utils/topicDetection'

interface RedditPost {
  title: string
  selftext: string
  permalink: string
  score: number
  num_comments: number
  author: string
  created_utc: number
  subreddit: string
}

interface RedditTopic {
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

export class RedditService {
  private clientId: string
  private clientSecret: string
  private userAgent: string

  constructor() {
    this.clientId = process.env.REDDIT_CLIENT_ID || ''
    this.clientSecret = process.env.REDDIT_CLIENT_SECRET || ''
    this.userAgent = process.env.REDDIT_USER_AGENT || 'viral_trending_bot/1.0'
  }

  private async getAccessToken(): Promise<string | null> {
    try {
      if (!this.clientId || !this.clientSecret) {
        console.error('Reddit credentials not configured')
        return null
      }

      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
      const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.userAgent,
        },
        body: 'grant_type=client_credentials',
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Failed to get Reddit access token:', error)
        return null
      }

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Error getting Reddit access token:', error)
      return null
    }
  }

  async fetchTrendingTopics(): Promise<RedditTopic[]> {
    const accessToken = await this.getAccessToken()
    if (!accessToken) {
      console.log('❌ Reddit API not available - no access token')
      return []
    }

    const trendingTopics: RedditTopic[] = []
    const seenTitles = new Set<string>()

    try {
      console.log('🔴 Fetching from Reddit API...')

      const subreddits = [
        'trending',
        'popular',
        'all',
        'technology',
        'science',
        'sports',
        'gaming',
        'movies',
        'music',
        'books',
        'food',
        'cryptocurrency',
        'wallstreetbets',
        'investing',
        'personalfinance',
      ]

      for (const subreddit of subreddits) {
        try {
          const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot.json?limit=20`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'User-Agent': this.userAgent,
            },
          })

          if (!response.ok) {
            console.error(`Error fetching from r/${subreddit}:`, response.status)
            continue
          }

          const data = await response.json()
          const posts = data.data.children.map((child: any) => child.data)

          for (const post of posts) {
            if (post.title && !seenTitles.has(post.title)) {
              const topicCategory = detectTopicCategory(subreddit, post.title)

              const topic: RedditTopic = {
                platform: 'Reddit',
                title: post.title,
                description: post.selftext?.substring(0, 200) || `Reddit post from r/${subreddit}`,
                url: `https://reddit.com${post.permalink}`,
                score: post.score,
                engagement: post.score + post.num_comments * 2,
                category: `r/${subreddit}`,
                topic: topicCategory,
                tags: ['reddit', subreddit, topicCategory],
                author: post.author || 'Anonymous',
                timestamp: new Date(post.created_utc * 1000).toISOString(),
              }

              trendingTopics.push(topic)
              seenTitles.add(post.title)

              if (trendingTopics.length >= 200) break
            }
          }

          if (trendingTopics.length >= 200) break
        } catch (error) {
          console.error(`Error fetching from r/${subreddit}:`, error)
          continue
        }
      }

      console.log(`✅ Fetched ${trendingTopics.length} unique Reddit posts from API`)
      return trendingTopics
    } catch (error) {
      console.error('❌ Reddit API failed:', error)
      return []
    }
  }
}

export const redditService = new RedditService()
