import { NextRequest, NextResponse } from 'next/server'
import { dataFetcherService } from '../../../../lib/services/dataFetcher'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('📥 Fetching ALL trending topics from database...')

    // Fetch ALL topics from the last 7 days
    const topics = await dataFetcherService.fetchAllTrendingTopics()

    return NextResponse.json({
      success: true,
      topics,
      count: topics.length,
      timestamp: new Date().toISOString(),
      cached: false,
      message: `Fetched all ${topics.length} topics from database (last 7 days)`,
    })
  } catch (error) {
    console.error('Error in all trending API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch all trending topics',
      },
      { status: 500 }
    )
  }
}
