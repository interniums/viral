interface GuardianArticle {
  id: string
  type: string
  sectionId: string
  sectionName: string
  webPublicationDate: string
  webTitle: string
  webUrl: string
  apiUrl: string
  fields?: {
    headline?: string
    trailText?: string
    bodyText?: string
    thumbnail?: string
  }
  tags: Array<{
    id: string
    type: string
    webTitle: string
    webUrl: string
  }>
}

interface GuardianTopic {
  platform: string
  title: string
  description: string
  url: string
  score: number
  engagement: number
  timestamp: string
  category: string
  tags: string[]
  topic: string
  author: string
}

export class GuardianService {
  private baseUrl = 'https://content.guardianapis.com'
  private apiKey = process.env.GUARDIAN_API_KEY

  async fetchTrendingTopics(limit = 50): Promise<GuardianTopic[]> {
    try {
      const [mostViewed, mostShared, latestNews] = await Promise.all([
        this.fetchMostViewed(),
        this.fetchMostShared(),
        this.fetchLatestNews(),
      ])

      // Combine and deduplicate articles
      const allArticles = this.deduplicateArticles([...mostViewed, ...mostShared, ...latestNews])

      // Transform to our standard format
      const topics = this.transformArticles(allArticles.slice(0, limit))

      return topics
    } catch (error) {
      console.error('Error fetching Guardian data:', error)
      return this.getDemoData(limit)
    }
  }

  private async fetchMostViewed(): Promise<GuardianArticle[]> {
    try {
      const url = `${this.baseUrl}/search?api-key=${this.apiKey}&section=news&show-fields=all&order-by=relevance&page-size=20`
      const response = await fetch(url)
      const data = await response.json()

      return data.response?.results || []
    } catch (error) {
      console.error('Error fetching most viewed:', error)
      return []
    }
  }

  private async fetchMostShared(): Promise<GuardianArticle[]> {
    try {
      const url = `${this.baseUrl}/search?api-key=${this.apiKey}&section=technology&show-fields=all&order-by=relevance&page-size=20`
      const response = await fetch(url)
      const data = await response.json()

      return data.response?.results || []
    } catch (error) {
      console.error('Error fetching most shared:', error)
      return []
    }
  }

  private async fetchLatestNews(): Promise<GuardianArticle[]> {
    try {
      const url = `${this.baseUrl}/search?api-key=${this.apiKey}&section=business&show-fields=all&order-by=newest&page-size=20`
      const response = await fetch(url)
      const data = await response.json()

      return data.response?.results || []
    } catch (error) {
      console.error('Error fetching latest news:', error)
      return []
    }
  }

  private deduplicateArticles(articles: GuardianArticle[]): GuardianArticle[] {
    const seen = new Set()
    return articles.filter((article) => {
      if (seen.has(article.id)) {
        return false
      }
      seen.add(article.id)
      return true
    })
  }

  private transformArticles(articles: GuardianArticle[]): GuardianTopic[] {
    return articles.map((article) => ({
      platform: 'The Guardian',
      title: article.webTitle,
      description: article.fields?.trailText || article.fields?.bodyText?.substring(0, 200) || 'Guardian article',
      url: article.webUrl,
      score: this.calculateScore(article),
      engagement: this.calculateEngagement(article),
      timestamp: article.webPublicationDate,
      category: this.detectCategory(article),
      tags: this.extractTags(article),
      topic: 'news',
      author: this.extractAuthor(article),
    }))
  }

  private calculateScore(article: GuardianArticle): number {
    let score = 50 // Base score

    // Boost for important sections
    if (['news', 'world', 'politics'].includes(article.sectionId)) {
      score += 20
    }

    // Boost for recent articles
    const publishDate = new Date(article.webPublicationDate)
    const hoursSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60)
    if (hoursSincePublish < 24) {
      score += 15
    }

    return Math.min(score, 100)
  }

  private calculateEngagement(article: GuardianArticle): number {
    // Simulate engagement based on section and recency
    let engagement = 1000

    if (['news', 'world'].includes(article.sectionId)) {
      engagement += 2000
    }

    const publishDate = new Date(article.webPublicationDate)
    const hoursSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60)
    if (hoursSincePublish < 6) {
      engagement += 1500
    }

    return engagement
  }

  private detectCategory(article: GuardianArticle): string {
    const section = article.sectionId.toLowerCase()
    const title = article.webTitle.toLowerCase()

    if (
      section === 'technology' ||
      title.includes('tech') ||
      title.includes('ai') ||
      title.includes('artificial intelligence')
    ) {
      return 'technology'
    }
    if (
      section === 'business' ||
      title.includes('business') ||
      title.includes('economy') ||
      title.includes('finance')
    ) {
      return 'business'
    }
    if (section === 'politics' || title.includes('politics') || title.includes('government')) {
      return 'politics'
    }
    if (section === 'world' || title.includes('international') || title.includes('global')) {
      return 'world'
    }
    if (title.includes('climate') || title.includes('environment') || title.includes('sustainability')) {
      return 'environment'
    }
    if (title.includes('health') || title.includes('medical') || title.includes('covid')) {
      return 'health'
    }

    return 'news'
  }

  private extractTags(article: GuardianArticle): string[] {
    const tags: string[] = ['news', 'guardian']

    // Add section tag
    if (article.sectionName) {
      tags.push(article.sectionName.toLowerCase())
    }

    // Add tags from article tags
    if (article.tags) {
      article.tags.forEach((tag) => {
        if (tag.webTitle) {
          tags.push(tag.webTitle.toLowerCase())
        }
      })
    }

    return tags.slice(0, 5) // Limit to 5 tags
  }

  private extractAuthor(article: GuardianArticle): string {
    if (!article.tags) return 'The Guardian'
    const authorTag = article.tags.find((tag) => tag.type === 'contributor')
    return authorTag?.webTitle || 'The Guardian'
  }

  private getDemoData(limit: number): GuardianTopic[] {
    const demoArticles = [
      {
        title: 'AI Breakthrough: New Model Achieves Human-Level Reasoning',
        description:
          'Researchers develop artificial intelligence system that demonstrates unprecedented reasoning capabilities, marking a significant milestone in AI development.',
        category: 'technology',
        tags: ['ai', 'technology', 'research'],
        engagement: 8500,
      },
      {
        title: 'Global Climate Summit Reaches Historic Agreement',
        description:
          'World leaders agree on ambitious new targets to combat climate change, with unprecedented commitments from major economies.',
        category: 'environment',
        tags: ['climate', 'environment', 'politics'],
        engagement: 7200,
      },
      {
        title: 'Tech Giant Reports Record Quarterly Earnings',
        description:
          'Major technology company exceeds market expectations with strong performance across all business segments.',
        category: 'business',
        tags: ['business', 'technology', 'earnings'],
        engagement: 6100,
      },
      {
        title: 'Revolutionary Medical Treatment Shows Promise',
        description:
          'Clinical trials reveal breakthrough treatment for previously incurable condition, offering hope to millions worldwide.',
        category: 'health',
        tags: ['health', 'medical', 'research'],
        engagement: 5400,
      },
      {
        title: 'Space Mission Discovers Evidence of Water on Mars',
        description:
          'Latest Mars rover data confirms presence of liquid water, raising questions about potential for life on the red planet.',
        category: 'technology',
        tags: ['space', 'mars', 'science'],
        engagement: 4800,
      },
    ]

    return demoArticles.slice(0, limit).map((article, index) => ({
      platform: 'The Guardian',
      title: article.title,
      description: article.description,
      url: `https://www.theguardian.com/article/${index + 1}`,
      score: Math.round(100 - index * 15),
      engagement: article.engagement,
      timestamp: new Date().toISOString(),
      category: article.category,
      tags: article.tags,
      topic: 'news',
      author: 'The Guardian',
    }))
  }
}

export const guardianService = new GuardianService()
