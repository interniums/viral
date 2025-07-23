import { BaseService } from './base'
import { Platform, Topic } from '../constants/enums'

interface StackOverflowQuestion {
  question_id: number
  title: string
  link: string
  score: number
  answer_count: number
  view_count: number
  creation_date: number
  owner: {
    display_name: string
    reputation: number
  }
  tags: string[]
  is_answered: boolean
}

interface StackOverflowTopic {
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

export class StackOverflowService extends BaseService {
  private baseUrl = 'https://api.stackexchange.com/2.3'
  private site = 'stackoverflow'

  private transformQuestions(questions: any[]): StackOverflowTopic[] {
    return questions.map((question) => ({
      platform: Platform.StackOverflow,
      title: question.title,
      description: `Score: ${question.score} | Answers: ${question.answer_count} | Views: ${question.view_count}`,
      url: question.link,
      score: question.score,
      engagement: question.answer_count + question.view_count,
      timestamp: new Date(question.creation_date * 1000),
      category: this.detectCategory(question.tags),
      tags: question.tags,
      topic: Topic.Programming,
      author: question.owner.display_name,
    }))
  }

  async fetchTrendingTopics(limit = 50): Promise<StackOverflowTopic[]> {
    try {
      // Fetch hot questions
      const hotQuestionsUrl = `${this.baseUrl}/questions?order=desc&sort=hot&site=${this.site}&pagesize=${limit}`
      const hotResponse = await fetch(hotQuestionsUrl)
      const hotData = await hotResponse.json()

      // Fetch most voted questions
      const votedQuestionsUrl = `${this.baseUrl}/questions?order=desc&sort=votes&site=${this.site}&pagesize=${limit}`
      const votedResponse = await fetch(votedQuestionsUrl)
      const votedData = await votedResponse.json()

      // Combine and deduplicate
      const allQuestions = [...hotData.items, ...votedData.items]
      const uniqueQuestions = this.deduplicateQuestions(allQuestions)

      // Transform to our format
      const trendingTopics: StackOverflowTopic[] = uniqueQuestions
        .slice(0, limit)
        .map((question) => ({
          platform: Platform.StackOverflow,
          title: question.title,
          description: `Score: ${question.score} | Answers: ${question.answer_count} | Views: ${question.view_count}`,
          url: question.link,
          score: question.score,
          engagement: question.answer_count + question.view_count,
          timestamp: new Date(question.creation_date * 1000),
          category: this.detectCategory(question.tags),
          tags: question.tags,
          topic: Topic.Programming,
          author: question.owner.display_name,
        }))
        .sort((a, b) => b.score - a.score)

      return trendingTopics
    } catch (error) {
      console.error('Error fetching Stack Overflow data:', error)
      return []
    }
  }

  private deduplicateQuestions(questions: StackOverflowQuestion[]): StackOverflowQuestion[] {
    const seen = new Set<number>()
    return questions.filter((question) => {
      if (seen.has(question.question_id)) {
        return false
      }
      seen.add(question.question_id)
      return true
    })
  }

  private detectCategory(tags: string[]): string {
    const lowerTags = tags.map((t) => t.toLowerCase())

    if (
      lowerTags.some(
        (t) => t.includes('javascript') || t.includes('typescript') || t.includes('react') || t.includes('vue')
      )
    ) {
      return 'frontend'
    }
    if (
      lowerTags.some((t) => t.includes('python') || t.includes('java') || t.includes('c#') || t.includes('node.js'))
    ) {
      return 'backend'
    }
    if (
      lowerTags.some(
        (t) => t.includes('android') || t.includes('ios') || t.includes('flutter') || t.includes('react-native')
      )
    ) {
      return 'mobile'
    }
    if (lowerTags.some((t) => t.includes('sql') || t.includes('mongodb') || t.includes('postgresql'))) {
      return 'database'
    }
    if (lowerTags.some((t) => t.includes('docker') || t.includes('kubernetes') || t.includes('aws'))) {
      return 'devops'
    }
    if (lowerTags.some((t) => t.includes('security') || t.includes('authentication'))) {
      return 'security'
    }
    return 'programming'
  }
}

export const stackOverflowService = new StackOverflowService()
