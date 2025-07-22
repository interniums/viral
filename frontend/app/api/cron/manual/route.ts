import { NextRequest, NextResponse } from 'next/server'
import { dataFetcherService } from '../../../../lib/services/dataFetcher'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is authorized
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Manual cron job triggered...')

    // Run the database update
    await dataFetcherService.updateDatabaseWithFreshData()

    return NextResponse.json({
      success: true,
      message: 'Manual database update completed successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Manual cron job failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Manual database update failed',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Manual cron job triggered (GET)...')

    // Run the database update
    await dataFetcherService.updateDatabaseWithFreshData()

    return NextResponse.json({
      success: true,
      message: 'Manual database update completed successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Manual cron job failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Manual database update failed',
      },
      { status: 500 }
    )
  }
}
