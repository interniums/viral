import { NextRequest, NextResponse } from 'next/server'
import { dataFetcherService } from '../../../lib/services/dataFetcher'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sort') || 'random'
    const sortOrder = searchParams.get('order') || 'desc'

    const topics = await dataFetcherService.fetchTrendingTopics(sortBy, sortOrder)

    return NextResponse.json({
      success: true,
      topics,
      count: topics.length,
      timestamp: new Date().toISOString(),
      cached: false,
      sort_by: sortBy,
      sort_order: sortOrder,
    })
  } catch (error) {
    console.error('Error in trending API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trending topics',
      },
      { status: 500 }
    )
  }
}
