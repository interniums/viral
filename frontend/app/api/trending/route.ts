import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sort') || 'random'
    const sortOrder = searchParams.get('order') || 'desc'

    // Temporarily disabled due to Drizzle ORM issues
    // TODO: Fix dataFetcher service and re-enable
    const topics: any[] = []

    return NextResponse.json({
      success: true,
      topics,
      count: topics.length,
      timestamp: new Date().toISOString(),
      cached: false,
      sort_by: sortBy,
      sort_order: sortOrder,
      message: 'API temporarily disabled - fixing Drizzle ORM issues',
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
