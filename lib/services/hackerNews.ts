import { BaseService } from './base'
import { Platform, Topic } from '../constants/enums'

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

export class HackerNewsService extends BaseService {
  private baseUrl = 'https://hacker-news.firebaseio.com/v0'

  private transformStories(stories: any[]): HackerNewsTopic[] {
    return stories.map((story) => ({
      platform: Platform.HackerNews,
      title: story.title,
      description: `Score: ${story.score} | Comments: ${story.descendants || 0}`,
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      score: story.score,
      engagement: story.descendants || 0,
      timestamp: new Date(story.time * 1000),
      category: this.detectCategory(story.title, story.type),
      tags: this.extractTags(story),
      topic: Topic.Technology,
      author: story.by,
    }))
  }

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
      const trendingTopics: HackerNewsTopic[] = this.transformStories(stories).sort((a, b) => b.score - a.score)

      return trendingTopics
    } catch (error) {
      console.error('Error fetching Hacker News data:', error)
      return []
    }
  }

  private detectCategory(title: string, type: string): string {
    const lowerTitle = title.toLowerCase()

    if (
      type === 'story' &&
      (lowerTitle.includes('ai') || lowerTitle.includes('machine learning') || lowerTitle.includes('gpt'))
    ) {
      return 'artificial-intelligence'
    }
    if (
      type === 'story' &&
      (lowerTitle.includes('crypto') || lowerTitle.includes('bitcoin') || lowerTitle.includes('blockchain'))
    ) {
      return 'cryptocurrency'
    }
    if (
      type === 'story' &&
      (lowerTitle.includes('startup') || lowerTitle.includes('funding') || lowerTitle.includes('venture'))
    ) {
      return 'startups'
    }
    if (
      type === 'story' &&
      (lowerTitle.includes('security') || lowerTitle.includes('hack') || lowerTitle.includes('breach'))
    ) {
      return 'security'
    }
    if (
      type === 'story' &&
      (lowerTitle.includes('programming') || lowerTitle.includes('code') || lowerTitle.includes('developer'))
    ) {
      return 'programming'
    }

    return 'technology'
  }

  private extractTags(story: HackerNewsStory): string[] {
    const tags: string[] = []
    const lowerTitle = story.title.toLowerCase()

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
