import { NextRequest, NextResponse } from 'next/server'
import { dataFetcherService } from '@/lib/services/dataFetcher'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Verify the request has the correct secret (same as cron jobs)
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.CRON_SECRET

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🧹 Starting manual database cleanup...')

    // Perform the cleanup
    const result = await dataFetcherService.cleanupOldData()

    if (result.error) {
      console.error('❌ Cleanup failed:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          deletedCount: result.deletedCount,
        },
        { status: 500 }
      )
    }

    console.log(`✅ Cleanup completed successfully - deleted ${result.deletedCount} records`)

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Successfully deleted ${result.deletedCount} old records`,
    })
  } catch (error) {
    console.error('❌ Error in cleanup endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify the request has the correct secret
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.CRON_SECRET

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get database size information
    const dbSize = await dataFetcherService.getDatabaseSize()

    return NextResponse.json({
      success: true,
      data: dbSize,
      message: `Database contains ${dbSize.totalRecords} total records, ${dbSize.oldRecords} old records (older than ${dbSize.retentionDays} days)`,
    })
  } catch (error) {
    console.error('❌ Error getting database size:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
