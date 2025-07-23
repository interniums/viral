import { NextRequest, NextResponse } from 'next/server'
import { dataFetcherService } from '../../../../lib/services/dataFetcher'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sort') || 'random'
    const sortOrder = searchParams.get('order') || 'desc'
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500) // Cap at 500 items per request
    const offset = parseInt(searchParams.get('offset') || '0')

    const topics = await dataFetcherService.fetchTrendingTopics(sortBy, sortOrder, limit, offset)

    // Get total count for better pagination
    const totalCount = await dataFetcherService.getTotalTopicsCount()

    return NextResponse.json({
      success: true,
      topics,
      count: topics.length,
      total_count: totalCount,
      timestamp: new Date().toISOString(),
      cached: false,
      sort_by: sortBy,
      sort_order: sortOrder,
      pagination: {
        limit,
        offset,
        has_more: offset + topics.length < totalCount,
      },
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
