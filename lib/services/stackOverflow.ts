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

export class StackOverflowService {
  private baseUrl = 'https://api.stackexchange.com/2.3'
  private site = 'stackoverflow'

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
          platform: 'Stack Overflow',
          title: question.title,
          description: `Score: ${question.score} | Answers: ${question.answer_count} | Views: ${question.view_count}`,
          url: question.link,
          score: question.score,
          engagement: question.answer_count + question.view_count,
          timestamp: new Date(question.creation_date * 1000),
          category: this.detectCategory(question.tags),
          tags: question.tags,
          topic: 'programming',
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
    const lowerTags = tags.map((tag) => tag.toLowerCase())

    if (lowerTags.some((tag) => ['javascript', 'typescript', 'react', 'vue', 'angular'].includes(tag))) {
      return 'frontend'
    }
    if (lowerTags.some((tag) => ['python', 'java', 'c#', 'php', 'node.js'].includes(tag))) {
      return 'backend'
    }
    if (lowerTags.some((tag) => ['android', 'ios', 'flutter', 'react-native'].includes(tag))) {
      return 'mobile'
    }
    if (lowerTags.some((tag) => ['machine-learning', 'tensorflow', 'pytorch', 'ai'].includes(tag))) {
      return 'artificial-intelligence'
    }
    if (lowerTags.some((tag) => ['database', 'sql', 'mongodb', 'redis'].includes(tag))) {
      return 'database'
    }
    if (lowerTags.some((tag) => ['docker', 'kubernetes', 'aws', 'azure'].includes(tag))) {
      return 'devops'
    }

    return 'programming'
  }
}

export const stackOverflowService = new StackOverflowService()
