interface ProductHuntPost {
  id: number
  name: string
  tagline: string
  description: string
  url: string
  votes_count: number
  comments_count: number
  created_at: string
  user: {
    name: string
    username: string
  }
  topics: {
    edges: Array<{
      node: {
        name: string
      }
    }>
  }
  thumbnail: {
    url: string
  }
}

interface ProductHuntTopic {
  platform: string
  title: string
  description: string
  url: string
  score: number
  engagement: number
  timestamp: string // Changed from Date to string
  category: string
  tags: string[]
  topic: string
  author: string
}

export class ProductHuntService {
  private baseUrl = 'https://api.producthunt.com/v2/api/graphql'
  private accessToken = process.env.PRODUCT_HUNT_ACCESS_TOKEN

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

  private transformPosts(posts: ProductHuntPost[]): ProductHuntTopic[] {
    return posts.map((post) => ({
      platform: 'Product Hunt',
      title: post.name,
      description: post.tagline,
      url: post.url,
      score: post.votes_count,
      engagement: post.comments_count,
      timestamp: post.created_at, // Already an ISO string
      category: this.detectCategory(
        post.topics.edges.map((t) => t.node.name),
        post.tagline
      ),
      tags: post.topics.edges.map((t) => t.node.name.toLowerCase()),
      topic: 'products',
      author: post.user.name,
    }))
  }

  private getDemoData(limit: number): ProductHuntTopic[] {
    const demoProducts = [
      {
        name: 'Notion AI',
        tagline: 'Write, edit, and brainstorm with AI',
        url: 'https://notion.so',
        votes: 1250,
        comments: 89,
        topics: ['Productivity', 'AI'],
        author: 'Notion Team',
      },
      {
        name: 'Midjourney',
        tagline: 'AI-powered image generation',
        url: 'https://midjourney.com',
        votes: 2100,
        comments: 156,
        topics: ['AI', 'Design'],
        author: 'Midjourney',
      },
      {
        name: 'Linear',
        tagline: 'Issue tracking for modern software teams',
        url: 'https://linear.app',
        votes: 890,
        comments: 67,
        topics: ['Productivity', 'Development'],
        author: 'Linear Team',
      },
      {
        name: 'Figma',
        tagline: 'Collaborative interface design tool',
        url: 'https://figma.com',
        votes: 3400,
        comments: 234,
        topics: ['Design', 'Collaboration'],
        author: 'Figma',
      },
      {
        name: 'Stripe',
        tagline: 'Payment processing for internet businesses',
        url: 'https://stripe.com',
        votes: 1800,
        comments: 123,
        topics: ['Payments', 'Business'],
        author: 'Stripe',
      },
    ]

    return demoProducts.slice(0, limit).map((product) => ({
      platform: 'Product Hunt',
      title: product.name,
      description: product.tagline,
      url: product.url,
      score: product.votes,
      engagement: product.comments,
      timestamp: new Date().toISOString(), // Use ISO string
      category: this.detectCategory(product.topics, product.tagline),
      tags: product.topics.map((t) => t.toLowerCase()),
      topic: 'products',
      author: product.author,
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
