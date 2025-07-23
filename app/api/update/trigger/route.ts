import { NextResponse } from 'next/server'
import { dataFetcherService } from '../../../../lib/services/dataFetcher'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Run update in background (fire and forget)
    dataFetcherService.updateDatabaseWithFreshData().catch((error) => {
      console.error('Background update failed:', error)
    })

    return NextResponse.json({
      success: true,
      message: 'Background update triggered successfully',
      timestamp: new Date().toISOString(),
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
