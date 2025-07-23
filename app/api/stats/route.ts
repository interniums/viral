import { NextResponse } from 'next/server'
import { dataFetcherService } from '../../../lib/services/dataFetcher'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const stats = await dataFetcherService.getStats()

    return NextResponse.json({
      success: true,
      ...stats,
      cached: false,
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
