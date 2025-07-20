'use client'

import { useState, useEffect } from 'react'
import TrendingCard from '../../components/TrendingCard'
import { Topic } from '../../types'

export default function TestPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  // Demo data to test platform icons and author display
  const demoTopics: Topic[] = [
    {
      platform: 'Reddit',
      title: 'Amazing Reddit Post with Author',
      description: 'This is a test Reddit post to show the platform icon and author information.',
      url: 'https://reddit.com/test',
      score: 1000,
      engagement: 1500,
      category: 'r/test',
      tags: ['reddit', 'test', 'demo'],
      timestamp: new Date().toISOString(),
      topic: 'general',
      author: 'reddit_user_123',
    },
    {
      platform: 'YouTube',
      title: 'Trending YouTube Video',
      description: 'This is a test YouTube video to show the platform icon and channel name.',
      url: 'https://youtube.com/watch?v=test',
      score: 5000,
      engagement: 7500,
      category: 'Video',
      tags: ['youtube', 'video', 'trending'],
      timestamp: new Date().toISOString(),
      topic: 'general',
      author: 'Amazing Channel',
    },
    {
      platform: 'News',
      title: 'Breaking News Article',
      description: 'This is a test news article to show the platform icon and author information.',
      url: 'https://news.com/test',
      score: 100,
      engagement: 200,
      category: 'Breaking News',
      tags: ['news', 'breaking', 'demo'],
      timestamp: new Date().toISOString(),
      topic: 'politics',
      author: 'John Smith',
    },
  ]

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/trending')
        const data = await response.json()
        if (data.success) {
          setTopics(data.topics.slice(0, 5))
        } else {
          // Fallback to demo data if API fails
          setTopics(demoTopics)
        }
      } catch (error) {
        console.error('Error fetching topics:', error)
        // Fallback to demo data
        setTopics(demoTopics)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Page - Platform Icons & Authors</h1>

      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <TrendingCard key={index} topic={topic} rank={index + 1} />
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-semibold mb-4">Debug Info:</h2>
            <pre className="text-sm overflow-auto">{JSON.stringify(topics, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  )
}
