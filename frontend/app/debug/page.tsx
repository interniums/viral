'use client'

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [stats, setStats] = useState<any>(null)
  const [topics, setTopics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch stats
        const statsResponse = await fetch('/api/stats')
        const statsData = await statsResponse.json()
        setStats(statsData)

        // Fetch topics
        const topicsResponse = await fetch('/api/trending/all')
        const topicsData = await topicsResponse.json()
        setTopics(topicsData)

        console.log('Debug - Stats:', statsData)
        console.log('Debug - Topics count:', topicsData.topics?.length || 0)
        console.log('Debug - YouTube count from stats:', statsData.platform_stats?.YouTube || 0)

        const youtubeTopics = topicsData.topics?.filter((t: any) => t.platform === 'YouTube') || []
        console.log('Debug - YouTube topics count:', youtubeTopics.length)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Debug - Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading debug data...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Stats API Response</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(stats, null, 2)}</pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Topics API Response</h2>
          <div className="mb-4">
            <p>
              <strong>Total topics:</strong> {topics?.topics?.length || 0}
            </p>
            <p>
              <strong>YouTube from stats:</strong> {stats?.platform_stats?.YouTube || 0}
            </p>
            <p>
              <strong>YouTube from topics:</strong>{' '}
              {topics?.topics?.filter((t: any) => t.platform === 'YouTube').length || 0}
            </p>
          </div>
          <pre className="text-sm overflow-auto max-h-96">{JSON.stringify(topics?.topics?.slice(0, 5), null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
