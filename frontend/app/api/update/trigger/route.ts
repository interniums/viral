import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Temporarily disabled due to Drizzle ORM issues
    // TODO: Fix dataFetcher service and re-enable

    return NextResponse.json({
      success: true,
      message: 'Background update triggered successfully (temporarily disabled)',
      timestamp: new Date().toISOString(),
      note: 'API temporarily disabled - fixing Drizzle ORM issues',
    })
  } catch (error) {
    console.error('Error triggering update:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to trigger update',
      },
      { status: 500 }
    )
  }
}
