import { NextResponse } from 'next/server'
import { dataFetcherService } from '../../../../lib/services/dataFetcher'

// This endpoint is called by GitHub Actions cron job
// Runs every 15 minutes via GitHub Actions workflow
export async function GET(request: Request) {
  try {
    // Verify the request is from GitHub Actions
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Invalid or missing CRON_SECRET',
        },
        { status: 401 }
      )
    }

    console.log('⏰ GitHub Actions cron job triggered - updating database...')

    // Run the database update
    await dataFetcherService.updateDatabaseWithFreshData()

    return NextResponse.json({
      success: true,
      message: 'Cron endpoint is working - database updated successfully',
      timestamp: new Date().toISOString(),
      source: 'github-actions',
    })
  } catch (error) {
    console.error('❌ GitHub Actions cron job failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Cron endpoint failed',
        source: 'github-actions',
      },
      { status: 500 }
    )
  }
}
