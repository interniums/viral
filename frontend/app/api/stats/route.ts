import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Temporarily disabled due to Drizzle ORM issues
    // TODO: Fix dataFetcher service and re-enable
    const stats = {
      total_topics: 0,
      platforms: {},
      categories: {},
      last_update: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      ...stats,
      cached: false,
      message: 'API temporarily disabled - fixing Drizzle ORM issues',
    })
  } catch (error) {
    console.error('Error in stats API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats',
      },
      { status: 500 }
    )
  }
}
