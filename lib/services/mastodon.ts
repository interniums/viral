import { BaseService } from './base'
import { Platform, Topic } from '../constants/enums'

interface MastodonTopic {
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

export class MastodonService extends BaseService {
  private accessToken: string
  private baseUrl = 'https://mastodon.social/api/v1'

  constructor() {
    super()
    this.accessToken = process.env.MASTODON_ACCESS_TOKEN || ''
  }

  async fetchTrendingTopics(limit = 50): Promise<MastodonTopic[]> {
    try {
      if (!this.accessToken) {
        console.warn('Mastodon access token not configured, using demo data')
        return this.getDemoData(limit)
      }

      // Fetch trending hashtags
      const hashtagsResponse = await fetch(`${this.baseUrl}/trends/tags`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      const hashtags = await hashtagsResponse.json()

      // Fetch posts for trending hashtags
      const postPromises = hashtags.slice(0, 10).map((hashtag: any) =>
        fetch(`${this.baseUrl}/timelines/public?tag=${hashtag.name}&limit=5`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }).then((res) => res.json())
      )

      const postsData = await Promise.all(postPromises)
      const allPosts: any[] = postsData.flat()

      return this.transformPosts(allPosts).slice(0, limit)
    } catch (error) {
      console.error('Error fetching Mastodon data:', error)
      return this.getDemoData(limit)
    }
  }

  private transformPosts(posts: any[]): MastodonTopic[] {
    return posts
      .filter((post) => post.visibility === 'public')
      .map((post) => ({
        platform: Platform.Mastodon,
        title: this.extractTitle(post.content),
        description: this.cleanContent(post.content),
        url: post.url,
        score: post.reblogs_count + post.favourites_count,
        engagement: post.replies_count,
        timestamp: new Date(post.created_at),
        category: this.detectCategory(
          post.content,
          post.tags.map((tag: any) => tag.name)
        ),
        tags: post.tags.map((tag: any) => tag.name),
        topic: Topic.SocialMedia,
        author: post.account.display_name || post.account.username,
      }))
      .sort((a, b) => b.score - a.score)
  }

  private extractTitle(content: string): string {
    // Remove HTML tags and get first line
    const cleanContent = content.replace(/<[^>]*>/g, '')
    const lines = cleanContent.split('\n').filter((line) => line.trim())
    return lines[0]?.substring(0, 100) || 'Mastodon Post'
  }

  private cleanContent(content: string): string {
    // Remove HTML tags and limit length
    return content.replace(/<[^>]*>/g, '').substring(0, 200)
  }

  private getDemoData(limit: number): MastodonTopic[] {
    const demoPosts = [
      {
        content: 'This is a demo post from Mastodon! #mastodon #demo',
        url: 'https://mastodon.social/@demo/1',
        reblogs_count: 10,
        favourites_count: 20,
        replies_count: 5,
        created_at: new Date().toISOString(),
        tags: [{ name: 'mastodon' }, { name: 'demo' }],
        account: { display_name: 'Demo User', username: 'demo' },
        visibility: 'public',
      },
    ]

    return this.transformPosts(demoPosts.slice(0, limit))
  }

  private detectCategory(content: string, tags: string[]): string {
    const lowerContent = content.toLowerCase()
    const lowerTags = tags.map((tag) => tag.toLowerCase())

    if (
      lowerTags.includes('ai') ||
      lowerTags.includes('machinelearning') ||
      lowerContent.includes('artificial intelligence')
    ) {
      return 'artificial-intelligence'
    }
    if (lowerTags.includes('privacy') || lowerTags.includes('security')) {
      return 'security'
    }
    if (lowerTags.includes('opensource') || lowerTags.includes('programming')) {
      return 'programming'
    }
    if (lowerTags.includes('climate') || lowerTags.includes('sustainability')) {
      return 'environment'
    }
    if (lowerTags.includes('socialmedia') || lowerTags.includes('decentralization')) {
      return 'technology'
    }

    return 'general'
  }
}

export const mastodonService = new MastodonService()
