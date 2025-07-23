import { BaseService } from './base'
import { Platform, Topic } from '../constants/enums'

interface GitHubTrendingRepo {
  author: string
  name: string
  avatar: string
  url: string
  description: string
  language: string
  languageColor: string
  stars: number
  forks: number
  currentPeriodStars: number
  builtBy: Array<{
    username: string
    href: string
    avatar: string
  }>
}

interface GitHubTrendingTopic {
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

export class GitHubTrendingService extends BaseService {
  private baseUrl = 'https://api.github.com'

  private transformRepos(repos: any[]): GitHubTrendingTopic[] {
    return repos.map((repo: any) => ({
      platform: Platform.GitHub,
      title: repo.full_name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      score: repo.stargazers_count,
      engagement: repo.forks_count,
      timestamp: new Date(repo.created_at),
      category: this.detectCategory(repo.language || '', repo.description || ''),
      tags: this.extractTags(repo.language || '', repo.description || '', repo.topics || []),
      topic: Topic.OpenSource,
      author: repo.owner.login,
    }))
  }

  async fetchTrendingTopics(limit = 50): Promise<GitHubTrendingTopic[]> {
    try {
      // Get trending repositories for the last week
      const date = new Date()
      date.setDate(date.getDate() - 7)
      const dateString = date.toISOString().split('T')[0]

      const query = `created:>${dateString} sort:stars-desc`
      const url = `${this.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&per_page=${limit}`

      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'viral-trending-app',
        },
      })

      if (!response.ok) {
        throw new Error('GitHub API request failed')
      }

      const data = await response.json()
      const repos = data.items

      // Transform to our format
      const trendingTopics: GitHubTrendingTopic[] = this.transformRepos(repos)

      return trendingTopics
    } catch (error) {
      console.error('Error fetching GitHub Trending data:', error)
      return this.getDemoData(limit)
    }
  }

  private detectCategory(language: string, description: string): string {
    const lowerDesc = description.toLowerCase()
    const lowerLang = language.toLowerCase()

    if (
      lowerLang === 'javascript' ||
      lowerLang === 'typescript' ||
      lowerDesc.includes('react') ||
      lowerDesc.includes('vue')
    ) {
      return 'frontend'
    }
    if (lowerLang === 'python' || lowerLang === 'java' || lowerLang === 'c++' || lowerLang === 'go') {
      return 'backend'
    }
    if (lowerDesc.includes('ai') || lowerDesc.includes('machine learning') || lowerDesc.includes('gpt')) {
      return 'artificial-intelligence'
    }
    if (lowerDesc.includes('mobile') || lowerDesc.includes('ios') || lowerDesc.includes('android')) {
      return 'mobile'
    }
    if (lowerDesc.includes('blockchain') || lowerDesc.includes('crypto')) {
      return 'blockchain'
    }

    return 'development'
  }

  private extractTags(language: string, description: string, topics: string[] = []): string[] {
    const tags = new Set<string>()

    // Add language as tag
    if (language) {
      tags.add(language.toLowerCase())
    }

    // Add repository topics
    topics.forEach((topic) => tags.add(topic))

    // Extract common tech keywords
    const keywords = [
      'react',
      'vue',
      'angular',
      'node',
      'python',
      'java',
      'golang',
      'rust',
      'ai',
      'ml',
      'blockchain',
      'crypto',
      'mobile',
      'ios',
      'android',
      'docker',
      'kubernetes',
      'aws',
      'azure',
      'gcp',
      'database',
      'api',
    ]

    const lowerDesc = description.toLowerCase()
    keywords.forEach((keyword) => {
      if (lowerDesc.includes(keyword)) {
        tags.add(keyword)
      }
    })

    return Array.from(tags)
  }

  private getDemoData(limit: number): GitHubTrendingTopic[] {
    const demoRepos = [
      {
        full_name: 'microsoft/vscode',
        description: 'Visual Studio Code',
        stargazers_count: 150000,
        forks_count: 25000,
        language: 'TypeScript',
        created_at: '2015-04-29T11:00:00Z',
        owner: { login: 'microsoft' },
        topics: ['editor', 'typescript', 'electron'],
      },
    ]
    return this.transformRepos(demoRepos.slice(0, limit))
  }
}

export const githubTrendingService = new GitHubTrendingService()
