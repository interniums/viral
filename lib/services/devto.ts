import { BaseService } from './base'
import { Platform, Topic } from '../constants/enums'

interface DevToTopic {
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

export class DevToService extends BaseService {
  private baseUrl = 'https://dev.to/api'

  async fetchTrendingTopics(limit = 50): Promise<DevToTopic[]> {
    try {
      // Fetch top articles
      const topArticlesUrl = `${this.baseUrl}/articles?top=1&per_page=${limit}`
      const topResponse = await fetch(topArticlesUrl)
      const topArticles: any[] = await topResponse.json()

      // Fetch latest articles
      const latestArticlesUrl = `${this.baseUrl}/articles?per_page=${limit}`
      const latestResponse = await fetch(latestArticlesUrl)
      const latestArticles: any[] = await latestResponse.json()

      // Combine and deduplicate
      const allArticles = [...topArticles, ...latestArticles]
      const uniqueArticles = this.deduplicateArticles(allArticles)

      return this.transformArticles(uniqueArticles.slice(0, limit))
    } catch (error) {
      console.error('Error fetching Dev.to data:', error)
      return this.getDemoData(limit)
    }
  }

  private deduplicateArticles(articles: any[]): any[] {
    const seen = new Set<number>()
    return articles.filter((article) => {
      if (seen.has(article.id)) {
        return false
      }
      seen.add(article.id)
      return true
    })
  }

  private transformArticles(articles: any[]): DevToTopic[] {
    return articles.map((article) => ({
      platform: Platform.DevTo,
      title: article.title,
      description: article.description || `Reading time: ${article.reading_time_minutes} minutes`,
      url: article.canonical_url || article.url,
      score: this.calculateScore(article),
      engagement: article.public_reactions_count + article.comments_count,
      timestamp: new Date(article.published_at),
      category: this.detectCategory(article.title, article.tag_list),
      tags: article.tag_list,
      topic: Topic.Programming,
      author: article.user.name || article.user.username,
    }))
  }

  private calculateScore(article: any): number {
    const reactions = article.public_reactions_count || 0
    const comments = article.comments_count || 0
    const readingTime = article.reading_time_minutes || 1

    // Score based on engagement and content quality
    return Math.floor(reactions * 10 + comments * 20 + readingTime * 5)
  }

  private getDemoData(limit: number): DevToTopic[] {
    const demoArticles = [
      {
        title: 'Top 10 VS Code extensions for web developers',
        description: 'Boost your productivity with these amazing extensions',
        reactions: 150,
        comments: 25,
        tags: ['vscode', 'webdev', 'productivity'],
        author: 'Jane Doe',
      },
    ]
    return demoArticles.slice(0, limit).map((article) => ({
      platform: Platform.DevTo,
      title: article.title,
      description: article.description,
      url: `https://dev.to/janedoe/${article.title.toLowerCase().replace(/\s+/g, '-')}`,
      score: article.reactions + article.comments * 2,
      engagement: article.reactions + article.comments,
      timestamp: new Date(),
      category: this.detectCategory(article.title, article.tags),
      tags: article.tags,
      topic: Topic.Programming,
      author: article.author,
    }))
  }

  private detectCategory(title: string, tags: string[]): string {
    const lowerTitle = title.toLowerCase()
    const lowerTags = tags.map((tag) => tag.toLowerCase())

    if (lowerTags.includes('ai') || lowerTags.includes('machine-learning') || lowerTitle.includes('ai')) {
      return 'artificial-intelligence'
    }
    if (lowerTags.includes('frontend') || lowerTags.includes('css') || lowerTags.includes('react')) {
      return 'frontend'
    }
    if (lowerTags.includes('backend') || lowerTags.includes('api') || lowerTags.includes('database')) {
      return 'backend'
    }
    if (lowerTags.includes('rust') || lowerTags.includes('go') || lowerTags.includes('systems')) {
      return 'systems-programming'
    }
    if (lowerTags.includes('microservices') || lowerTags.includes('architecture')) {
      return 'architecture'
    }
    if (lowerTags.includes('devops') || lowerTags.includes('docker') || lowerTags.includes('kubernetes')) {
      return 'devops'
    }

    return 'programming'
  }
}

export const devToService = new DevToService()
