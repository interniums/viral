interface DevToArticle {
  id: number
  title: string
  description: string
  url: string
  published_at: string
  reading_time_minutes: number
  tag_list: string[]
  user: {
    name: string
    username: string
    profile_image: string
  }
  public_reactions_count: number
  comments_count: number
  positive_reactions_count: number
  cover_image: string
  canonical_url: string
}

interface DevToTopic {
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

export class DevToService {
  private baseUrl = 'https://dev.to/api'

  async fetchTrendingTopics(limit = 50): Promise<DevToTopic[]> {
    try {
      // Fetch top articles
      const topArticlesUrl = `${this.baseUrl}/articles?top=1&per_page=${limit}`
      const topResponse = await fetch(topArticlesUrl)
      const topArticles: DevToArticle[] = await topResponse.json()

      // Fetch latest articles
      const latestArticlesUrl = `${this.baseUrl}/articles?per_page=${limit}`
      const latestResponse = await fetch(latestArticlesUrl)
      const latestArticles: DevToArticle[] = await latestResponse.json()

      // Combine and deduplicate
      const allArticles = [...topArticles, ...latestArticles]
      const uniqueArticles = this.deduplicateArticles(allArticles)

      return this.transformArticles(uniqueArticles.slice(0, limit))
    } catch (error) {
      console.error('Error fetching Dev.to data:', error)
      return this.getDemoData(limit)
    }
  }

  private deduplicateArticles(articles: DevToArticle[]): DevToArticle[] {
    const seen = new Set<number>()
    return articles.filter((article) => {
      if (seen.has(article.id)) {
        return false
      }
      seen.add(article.id)
      return true
    })
  }

  private transformArticles(articles: DevToArticle[]): DevToTopic[] {
    return articles.map((article) => ({
      platform: 'Dev.to',
      title: article.title,
      description: article.description || `Reading time: ${article.reading_time_minutes} minutes`,
      url: article.canonical_url || article.url,
      score: this.calculateScore(article),
      engagement: article.public_reactions_count + article.comments_count,
      timestamp: new Date(article.published_at),
      category: this.detectCategory(article.title, article.tag_list),
      tags: article.tag_list,
      topic: 'programming',
      author: article.user.name || article.user.username,
    }))
  }

  private calculateScore(article: DevToArticle): number {
    const reactions = article.public_reactions_count || 0
    const comments = article.comments_count || 0
    const readingTime = article.reading_time_minutes || 1

    // Score based on engagement and content quality
    return Math.floor(reactions * 10 + comments * 20 + readingTime * 5)
  }

  private getDemoData(limit: number): DevToTopic[] {
    const demoArticles = [
      {
        title: 'Building a Modern Web App with Next.js and TypeScript',
        description: 'A comprehensive guide to creating scalable web applications with modern technologies',
        url: 'https://dev.to/example/nextjs-typescript-guide',
        published_at: new Date().toISOString(),
        reading_time_minutes: 8,
        tag_list: ['nextjs', 'typescript', 'react', 'webdev'],
        user: { name: 'John Developer', username: 'johndev' },
        public_reactions_count: 45,
        comments_count: 12,
      },
      {
        title: 'The Future of AI in Software Development',
        description: 'Exploring how artificial intelligence is transforming the way we write and maintain code',
        url: 'https://dev.to/example/ai-software-development',
        published_at: new Date().toISOString(),
        reading_time_minutes: 12,
        tag_list: ['ai', 'machine-learning', 'programming', 'future'],
        user: { name: 'AI Enthusiast', username: 'aiexpert' },
        public_reactions_count: 89,
        comments_count: 23,
      },
      {
        title: 'Mastering CSS Grid: A Complete Guide',
        description:
          'Learn how to create complex layouts with CSS Grid and take your web design skills to the next level',
        url: 'https://dev.to/example/css-grid-guide',
        published_at: new Date().toISOString(),
        reading_time_minutes: 15,
        tag_list: ['css', 'grid', 'webdesign', 'frontend'],
        user: { name: 'CSS Master', username: 'cssguru' },
        public_reactions_count: 67,
        comments_count: 18,
      },
      {
        title: 'Getting Started with Rust: From Zero to Hero',
        description: 'A beginner-friendly introduction to Rust programming language and its ecosystem',
        url: 'https://dev.to/example/rust-beginners',
        published_at: new Date().toISOString(),
        reading_time_minutes: 20,
        tag_list: ['rust', 'programming', 'beginners', 'systems'],
        user: { name: 'Rust Advocate', username: 'rustlover' },
        public_reactions_count: 123,
        comments_count: 34,
      },
      {
        title: 'Microservices Architecture: Best Practices and Patterns',
        description: 'Learn how to design and implement scalable microservices architectures',
        url: 'https://dev.to/example/microservices-patterns',
        published_at: new Date().toISOString(),
        reading_time_minutes: 18,
        tag_list: ['microservices', 'architecture', 'backend', 'scalability'],
        user: { name: 'Architecture Expert', username: 'architect' },
        public_reactions_count: 156,
        comments_count: 28,
      },
    ]

    return demoArticles.slice(0, limit).map((article) => ({
      platform: 'Dev.to',
      title: article.title,
      description: article.description,
      url: article.url,
      score: this.calculateScore(article as any),
      engagement: article.public_reactions_count + article.comments_count,
      timestamp: new Date(article.published_at),
      category: this.detectCategory(article.title, article.tag_list),
      tags: article.tag_list,
      topic: 'programming',
      author: article.user.name,
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
