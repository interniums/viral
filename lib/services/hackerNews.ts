interface HackerNewsStory {
  id: number
  title: string
  url?: string
  score: number
  by: string
  time: number
  descendants: number
  type: 'story'
}

interface HackerNewsTopic {
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

export class HackerNewsService {
  private baseUrl = 'https://hacker-news.firebaseio.com/v0'

  async fetchTrendingTopics(limit = 50): Promise<HackerNewsTopic[]> {
    try {
      // Get top stories IDs
      const topStoriesResponse = await fetch(`${this.baseUrl}/topstories.json`)
      const topStoriesIds: number[] = await topStoriesResponse.json()

      // Get best stories IDs
      const bestStoriesResponse = await fetch(`${this.baseUrl}/beststories.json`)
      const bestStoriesIds: number[] = await bestStoriesResponse.json()

      // Combine and get unique IDs
      const allIds = Array.from(new Set([...topStoriesIds, ...bestStoriesIds])).slice(0, limit)

      // Fetch story details
      const storyPromises = allIds.map((id) => fetch(`${this.baseUrl}/item/${id}.json`).then((res) => res.json()))

      const stories: HackerNewsStory[] = await Promise.all(storyPromises)

      // Transform to our format
      const trendingTopics: HackerNewsTopic[] = stories
        .filter((story) => story && story.type === 'story' && story.url)
        .map((story) => ({
          platform: 'Hacker News',
          title: story.title,
          description: `Score: ${story.score} | Comments: ${story.descendants}`,
          url: story.url!,
          score: story.score,
          engagement: story.descendants,
          timestamp: new Date(story.time * 1000),
          category: this.detectCategory(story.title),
          tags: this.extractTags(story.title),
          topic: 'technology',
          author: story.by,
        }))
        .sort((a, b) => b.score - a.score)

      return trendingTopics
    } catch (error) {
      console.error('Error fetching Hacker News data:', error)
      return []
    }
  }

  private detectCategory(title: string): string {
    const lowerTitle = title.toLowerCase()

    if (lowerTitle.includes('ai') || lowerTitle.includes('machine learning') || lowerTitle.includes('gpt')) {
      return 'artificial-intelligence'
    }
    if (lowerTitle.includes('crypto') || lowerTitle.includes('bitcoin') || lowerTitle.includes('blockchain')) {
      return 'cryptocurrency'
    }
    if (lowerTitle.includes('startup') || lowerTitle.includes('funding') || lowerTitle.includes('venture')) {
      return 'startups'
    }
    if (lowerTitle.includes('security') || lowerTitle.includes('hack') || lowerTitle.includes('breach')) {
      return 'security'
    }
    if (lowerTitle.includes('programming') || lowerTitle.includes('code') || lowerTitle.includes('developer')) {
      return 'programming'
    }

    return 'technology'
  }

  private extractTags(title: string): string[] {
    const tags: string[] = []
    const lowerTitle = title.toLowerCase()

    // Extract common tech keywords
    const keywords = [
      'ai',
      'ml',
      'crypto',
      'blockchain',
      'startup',
      'security',
      'programming',
      'javascript',
      'python',
      'react',
      'vue',
      'angular',
    ]

    keywords.forEach((keyword) => {
      if (lowerTitle.includes(keyword)) {
        tags.push(keyword)
      }
    })

    return tags
  }
}

export const hackerNewsService = new HackerNewsService()
