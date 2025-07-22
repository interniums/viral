import { NextRequest, NextResponse } from 'next/server'
import { dataFetcherService } from '../../../../lib/services/dataFetcher'

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
