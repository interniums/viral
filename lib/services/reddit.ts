import { BaseService } from './base'
import { Platform, Topic } from '../constants/enums'

interface RedditTopic {
  platform: Platform
  title: string
  description: string
  url: string
  score: number
  engagement: number
  timestamp: Date
  category: string
  tags: string[]
  topic: Topic
  author: string
}

export class RedditService extends BaseService {
  private clientId: string
  private clientSecret: string
  private userAgent: string

  constructor() {
    super()
    this.clientId = process.env.REDDIT_CLIENT_ID || ''
    this.clientSecret = process.env.REDDIT_CLIENT_SECRET || ''
    this.userAgent = process.env.REDDIT_USER_AGENT || 'viral_trending_bot/1.0'
  }

  async fetchTrendingTopics(limit = 50): Promise<RedditTopic[]> {
    const accessToken = await this.getAccessToken()
    if (!accessToken) {
      console.warn('❌ Reddit API not available - using demo data')
      return this.getDemoData(limit)
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
              const topic: RedditTopic = {
                platform: Platform.Reddit,
                title: post.title,
                description: post.selftext?.substring(0, 200) || `Reddit post from r/${subreddit}`,
                url: `https://reddit.com${post.permalink}`,
                score: post.score,
                engagement: post.num_comments,
                timestamp: new Date(post.created_utc * 1000),
                category: `r/${subreddit}`,
                topic: this.detectCategory(post.title, post.subreddit),
                tags: this.extractTags(post),
                author: post.author || 'Anonymous',
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
      return this.getDemoData(limit)
    }
  }

  private getDemoData(limit: number): RedditTopic[] {
    const demoPosts = [
      {
        title: 'What is the most interesting fact you know?',
        selftext:
          "I'll start: Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
        permalink: '/r/AskReddit/comments/123456/what_is_the_most_interesting_fact_you_know/',
        score: 12500,
        num_comments: 4500,
        author: 'FactFinder',
        created_utc: Date.now() / 1000 - 3600,
        subreddit: 'AskReddit',
      },
      {
        title: 'A beautiful sunset over the mountains',
        selftext: '',
        permalink: '/r/pics/comments/789101/a_beautiful_sunset_over_the_mountains/',
        score: 8900,
        num_comments: 500,
        author: 'PhotoGrapher',
        created_utc: Date.now() / 1000 - 7200,
        subreddit: 'pics',
      },
      {
        title: 'Devs who have been programming for 10+ years, what is the best advice you can give to beginners?',
        selftext:
          "Don't be afraid to ask questions. Read the documentation. Practice every day. Build projects. It's a marathon, not a sprint.",
        permalink: '/r/learnprogramming/comments/ABCDEF/devs_who_have_been_programming_for_10_years/',
        score: 5600,
        num_comments: 1200,
        author: 'CodeWizard',
        created_utc: Date.now() / 1000 - 86400,
        subreddit: 'learnprogramming',
      },
    ]

    return this.transformPosts(demoPosts.slice(0, limit))
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

  private transformPosts(posts: any[]): RedditTopic[] {
    return posts.map((post) => ({
      platform: Platform.Reddit,
      title: post.title,
      description: post.selftext || `Score: ${post.score} | Comments: ${post.num_comments}`,
      url: `https://reddit.com${post.permalink}`,
      score: post.score,
      engagement: post.num_comments,
      timestamp: new Date(post.created_utc * 1000),
      category: this.detectCategory(post.title, post.subreddit),
      tags: this.extractTags(post),
      topic: Topic.SocialMedia,
      author: post.author,
    }))
  }

  private detectCategory(title: string, subreddit: string): Topic {
    const lowerTitle = title.toLowerCase()
    const lowerSubreddit = subreddit.toLowerCase()

    if (lowerSubreddit.includes('gaming') || lowerTitle.includes('game')) {
      return Topic.Gaming
    }
    if (lowerSubreddit.includes('tech') || lowerTitle.includes('technology')) {
      return Topic.Technology
    }
    if (lowerSubreddit.includes('news') || lowerTitle.includes('news')) {
      return Topic.News
    }
    if (lowerSubreddit.includes('crypto') || lowerTitle.includes('crypto')) {
      return Topic.Cryptocurrency
    }
    if (lowerSubreddit.includes('meme') || lowerTitle.includes('meme')) {
      return Topic.Memes
    }
    return Topic.SocialMedia
  }

  private extractTags(post: any): string[] {
    const tags = ['reddit']
    if (post.subreddit) {
      tags.push(post.subreddit.toLowerCase())
    }
    if (post.link_flair_text) {
      tags.push(post.link_flair_text.toLowerCase())
    }
    return tags
  }
}

export const redditService = new RedditService()
