interface MastodonStatus {
  id: string
  content: string
  url: string
  reblogs_count: number
  favourites_count: number
  replies_count: number
  created_at: string
  account: {
    username: string
    display_name: string
    acct: string
  }
  tags: Array<{
    name: string
    url: string
  }>
  visibility: string
}

interface MastodonTrendingTopic {
  platform: string
  title: string
  description: string
  url: string
  score: number
  engagement: number
  timestamp: Date
  category: string
  tags: string[]
  topic: string
  author: string
}

export class MastodonService {
  private baseUrl = 'https://mastodon.social/api/v1'
  private accessToken = process.env.MASTODON_ACCESS_TOKEN

  async fetchTrendingTopics(limit = 50): Promise<MastodonTrendingTopic[]> {
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
      const allPosts: MastodonStatus[] = postsData.flat()

      return this.transformPosts(allPosts).slice(0, limit)
    } catch (error) {
      console.error('Error fetching Mastodon data:', error)
      return this.getDemoData(limit)
    }
  }

  private transformPosts(posts: MastodonStatus[]): MastodonTrendingTopic[] {
    return posts
      .filter((post) => post.visibility === 'public')
      .map((post) => ({
        platform: 'Mastodon',
        title: this.extractTitle(post.content),
        description: this.cleanContent(post.content),
        url: post.url,
        score: post.reblogs_count + post.favourites_count,
        engagement: post.replies_count,
        timestamp: new Date(post.created_at),
        category: this.detectCategory(
          post.content,
          post.tags.map((tag) => tag.name)
        ),
        tags: post.tags.map((tag) => tag.name),
        topic: 'social-media',
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

  private getDemoData(limit: number): MastodonTrendingTopic[] {
    const demoPosts = [
      {
        title: 'The future of decentralized social media',
        content: 'Exploring how Mastodon and other federated platforms are changing the social media landscape...',
        url: 'https://mastodon.social/@user/123456',
        reblogs: 45,
        favourites: 123,
        replies: 12,
        tags: ['socialmedia', 'decentralization'],
        author: 'TechEnthusiast',
      },
      {
        title: 'Open source software development tips',
        content: 'Here are some best practices for contributing to open source projects...',
        url: 'https://mastodon.social/@user/123457',
        reblogs: 23,
        favourites: 89,
        replies: 8,
        tags: ['opensource', 'programming'],
        author: 'DevGuru',
      },
      {
        title: 'Privacy and security in the digital age',
        content: 'How to protect your data and maintain privacy online...',
        url: 'https://mastodon.social/@user/123458',
        reblogs: 67,
        favourites: 156,
        replies: 15,
        tags: ['privacy', 'security'],
        author: 'PrivacyAdvocate',
      },
      {
        title: 'AI and machine learning developments',
        content: 'Latest updates in artificial intelligence and machine learning research...',
        url: 'https://mastodon.social/@user/123459',
        reblogs: 34,
        favourites: 98,
        replies: 11,
        tags: ['ai', 'machinelearning'],
        author: 'AIResearcher',
      },
      {
        title: 'Climate change and sustainability',
        content: 'Discussing environmental issues and sustainable solutions...',
        url: 'https://mastodon.social/@user/123460',
        reblogs: 89,
        favourites: 234,
        replies: 23,
        tags: ['climate', 'sustainability'],
        author: 'EcoWarrior',
      },
    ]

    return demoPosts.slice(0, limit).map((post) => ({
      platform: 'Mastodon',
      title: post.title,
      description: post.content,
      url: post.url,
      score: post.reblogs + post.favourites,
      engagement: post.replies,
      timestamp: new Date(),
      category: this.detectCategory(post.content, post.tags),
      tags: post.tags,
      topic: 'social-media',
      author: post.author,
    }))
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
