import { BaseService } from './base'
import { Platform, Topic } from '../constants/enums'

interface GNewsArticle {
  title: string
  description: string
  content: string
  url: string
  image: string
  publishedAt: string
  source: {
    name: string
    url: string
  }
}

interface GNewsTopic {
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

export class GNewsService extends BaseService {
  private baseUrl = 'https://gnews.io/api/v4'
  private apiKey = process.env.GNEWS_API_KEY

  async fetchTrendingTopics(limit = 50): Promise<GNewsTopic[]> {
    try {
      if (!this.apiKey) {
        console.warn('GNews API key not configured, using demo data')
        return this.getDemoData(limit)
      }

      // Fetch top headlines
      const headlinesUrl = `${this.baseUrl}/top-headlines?lang=en&country=us&max=${limit}&apikey=${this.apiKey}`
      const headlinesResponse = await fetch(headlinesUrl)
      const headlinesData = await headlinesResponse.json()

      if (!headlinesData.articles) {
        throw new Error('Invalid response from GNews API')
      }

      // Fetch trending topics
      const trendingUrl = `${this.baseUrl}/search?q=trending&lang=en&max=${limit}&apikey=${this.apiKey}`
      const trendingResponse = await fetch(trendingUrl)
      const trendingData = await trendingResponse.json()

      // Combine and deduplicate articles
      const allArticles = [...headlinesData.articles, ...(trendingData.articles || [])]
      const uniqueArticles = this.deduplicateArticles(allArticles)

      return this.transformArticles(uniqueArticles.slice(0, limit))
    } catch (error) {
      console.error('Error fetching GNews data:', error)
      return this.getDemoData(limit)
    }
  }

  private deduplicateArticles(articles: GNewsArticle[]): GNewsArticle[] {
    const seen = new Set<string>()
    return articles.filter((article) => {
      const key = article.title.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  private transformArticles(articles: any[]): GNewsTopic[] {
    return articles.map((article) => ({
      platform: Platform.GNews,
      title: article.title,
      description: article.description || article.content?.substring(0, 200) || 'No description available',
      url: article.url,
      score: this.calculateScore(article),
      engagement: Math.floor(Math.random() * 1000) + 100, // Simulated engagement
      timestamp: new Date(article.publishedAt),
      category: this.detectCategory(article.title, article.description || ''),
      tags: this.extractTags(article.title, article.description || ''),
      topic: Topic.News,
      author: article.source.name,
    }))
  }

  private calculateScore(article: GNewsArticle): number {
    // Simple scoring based on content length and source credibility
    const contentLength = article.content?.length || 0
    const sourceScore = this.getSourceScore(article.source.name)
    return Math.floor(contentLength / 100 + sourceScore)
  }

  private getSourceScore(sourceName: string): number {
    const credibleSources = ['BBC', 'CNN', 'Reuters', 'AP', 'The New York Times', 'The Washington Post']
    return credibleSources.some((source) => sourceName.includes(source)) ? 500 : 100
  }

  private getDemoData(limit: number): GNewsTopic[] {
    const demoArticles = [
      {
        title: 'AI Breakthrough: New Model Achieves Human-Level Understanding',
        description:
          'Researchers develop revolutionary AI model that demonstrates unprecedented language comprehension capabilities...',
        url: 'https://example.com/ai-breakthrough',
        source: 'Tech News Daily',
        publishedAt: new Date().toISOString(),
      },
      {
        title: 'Global Markets React to Economic Policy Changes',
        description:
          'Stock markets worldwide show significant movement following major economic policy announcements...',
        url: 'https://example.com/markets-reaction',
        source: 'Financial Times',
        publishedAt: new Date().toISOString(),
      },
      {
        title: 'Climate Summit: World Leaders Agree on New Targets',
        description: 'International climate conference concludes with ambitious new environmental protection goals...',
        url: 'https://example.com/climate-summit',
        source: 'BBC News',
        publishedAt: new Date().toISOString(),
      },
      {
        title: 'SpaceX Successfully Launches New Satellite Constellation',
        description: "Elon Musk's company achieves another milestone in space exploration and satellite technology...",
        url: 'https://example.com/spacex-launch',
        source: 'Space News',
        publishedAt: new Date().toISOString(),
      },
      {
        title: 'Major Cybersecurity Breach Affects Millions of Users',
        description: 'Security experts warn of widespread data vulnerability affecting popular online services...',
        url: 'https://example.com/cybersecurity-breach',
        source: 'Security Weekly',
        publishedAt: new Date().toISOString(),
      },
    ]

    return demoArticles.slice(0, limit).map((article) => ({
      platform: Platform.GNews,
      title: article.title,
      description: article.description,
      url: article.url,
      score: Math.floor(Math.random() * 1000) + 500,
      engagement: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date(article.publishedAt),
      category: this.detectCategory(article.title, article.description),
      tags: this.extractTags(article.title, article.description),
      topic: Topic.News,
      author: article.source,
    }))
  }

  private detectCategory(title: string, description: string): string {
    const text = `${title} ${description}`.toLowerCase()

    if (text.includes('politics') || text.includes('government') || text.includes('election')) {
      return 'politics'
    }
    if (text.includes('technology') || text.includes('tech') || text.includes('ai')) {
      return 'technology'
    }
    if (text.includes('business') || text.includes('economy') || text.includes('market')) {
      return 'business'
    }
    if (text.includes('sports') || text.includes('game') || text.includes('match')) {
      return 'sports'
    }
    if (text.includes('entertainment') || text.includes('movie') || text.includes('music')) {
      return 'entertainment'
    }
    return 'news'
  }

  private extractTags(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase()
    const tags = ['news']

    if (text.includes('politics')) tags.push('politics')
    if (text.includes('technology')) tags.push('technology')
    if (text.includes('business')) tags.push('business')
    if (text.includes('sports')) tags.push('sports')
    if (text.includes('entertainment')) tags.push('entertainment')

    return tags
  }
}

export const gnewsService = new GNewsService()
