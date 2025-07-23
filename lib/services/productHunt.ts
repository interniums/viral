import { BaseService } from './base'
import { Platform, Topic } from '../constants/enums'

interface ProductHuntTopic {
  platform: Platform
  title: string
  description: string
  url: string
  score: number
  engagement: number
  timestamp: string
  category: string
  tags: string[]
  topic: Topic
  author: string
}

export class ProductHuntService extends BaseService {
  private accessToken: string
  private baseUrl = 'https://api.producthunt.com/v2/api/graphql'

  constructor() {
    super()
    this.accessToken = process.env.PRODUCT_HUNT_ACCESS_TOKEN || ''
  }

  async fetchTrendingTopics(limit = 50): Promise<ProductHuntTopic[]> {
    try {
      if (!this.accessToken) {
        console.warn('Product Hunt access token not configured, using demo data')
        return this.getDemoData(limit)
      }

      const query = `
        query {
          posts(first: ${limit}, order: VOTES) {
            edges {
              node {
                id
                name
                tagline
                description
                url
                votesCount
                commentsCount
                createdAt
                user {
                  name
                  username
                }
                topics {
                  edges {
                    node {
                      name
                    }
                  }
                }
                thumbnail {
                  url
                }
              }
            }
          }
        }
      `

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()
      const posts = data.data.posts.edges.map((edge: any) => edge.node)

      return this.transformPosts(posts)
    } catch (error) {
      console.error('Error fetching Product Hunt data:', error)
      return this.getDemoData(limit)
    }
  }

  private transformPosts(posts: any[]): ProductHuntTopic[] {
    return posts.map((post) => {
      // Calculate base score from votes and add minimum base score
      const baseScore = 50 // Minimum base score
      const votesScore = post.votes_count || 0
      const finalScore = baseScore + votesScore

      return {
        platform: Platform.ProductHunt,
        title: post.name,
        description: post.tagline,
        url: post.url,
        score: finalScore,
        engagement: post.comments_count,
        timestamp: post.created_at,
        category: this.detectCategory(
          post.topics.edges.map((t: any) => t.node.name),
          post.tagline
        ),
        tags: post.topics.edges.map((t: any) => t.node.name.toLowerCase()),
        topic: Topic.Products,
        author: post.user.name,
      }
    })
  }

  private getDemoData(limit: number): ProductHuntTopic[] {
    const demoPosts = [
      {
        name: 'AI Writing Assistant',
        tagline: 'Write better content with AI-powered suggestions',
        votes: 450,
        comments: 32,
        topics: ['AI', 'Productivity', 'Writing'],
        author: 'Sarah Chen',
      },
      {
        name: 'Remote Team Manager',
        tagline: 'All-in-one platform for managing remote teams',
        votes: 380,
        comments: 28,
        topics: ['Remote Work', 'Team Management', 'SaaS'],
        author: 'Alex Johnson',
      },
      {
        name: 'Crypto Portfolio Tracker',
        tagline: 'Track your crypto investments across all exchanges',
        votes: 320,
        comments: 45,
        topics: ['Cryptocurrency', 'Finance', 'Investment'],
        author: 'Michael Brown',
      },
      {
        name: 'Design System Generator',
        tagline: 'Create consistent design systems in minutes',
        votes: 290,
        comments: 25,
        topics: ['Design', 'Development', 'Tools'],
        author: 'Emma Wilson',
      },
      {
        name: 'Social Media Scheduler',
        tagline: 'Schedule and analyze your social media posts',
        votes: 250,
        comments: 18,
        topics: ['Social Media', 'Marketing', 'Productivity'],
        author: 'David Lee',
      },
    ]

    return demoPosts.slice(0, limit).map((post) => ({
      platform: Platform.ProductHunt,
      title: post.name,
      description: post.tagline,
      url: `https://www.producthunt.com/posts/${post.name.toLowerCase().replace(/\s+/g, '-')}`,
      score: 50 + post.votes,
      engagement: post.comments,
      timestamp: new Date().toISOString(),
      category: this.detectCategory(post.topics, post.tagline),
      tags: post.topics.map((t: string) => t.toLowerCase()),
      topic: Topic.Products,
      author: post.author,
    }))
  }

  private detectCategory(topics: string[], tagline: string): string {
    const lowerTopics = topics.map((t) => t.toLowerCase())
    const lowerTagline = tagline.toLowerCase()

    if (lowerTopics.includes('ai') || lowerTagline.includes('ai')) {
      return 'artificial-intelligence'
    }
    if (lowerTopics.includes('productivity') || lowerTopics.includes('workflow')) {
      return 'productivity'
    }
    if (lowerTopics.includes('design') || lowerTopics.includes('ui')) {
      return 'design'
    }
    if (lowerTopics.includes('development') || lowerTopics.includes('coding')) {
      return 'development'
    }
    if (lowerTopics.includes('business') || lowerTopics.includes('startup')) {
      return 'business'
    }

    return 'technology'
  }
}

export const productHuntService = new ProductHuntService()
