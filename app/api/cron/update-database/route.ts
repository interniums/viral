import { NextResponse } from 'next/server'
import { dataFetcherService } from '@/lib/services'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// This endpoint is called by GitHub Actions cron job
// Runs every 15 minutes via GitHub Actions workflow
export async function GET(request: Request) {
  try {
    // Verify the request is from GitHub Actions
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.CRON_SECRET || 'f53c3c0208ca022e360f2622dc5a9a3049275841a92324b9bf4eda05008bcbd5'

    if (authHeader !== `Bearer ${expectedSecret}`) {
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

    // Run database cleanup (every 24 hours)
    const now = new Date()
    const shouldCleanup = now.getHours() === 2 && now.getMinutes() < 15 // Run cleanup around 2 AM

    if (shouldCleanup) {
      console.log('🧹 Running scheduled database cleanup...')
      const cleanupResult = await dataFetcherService.cleanupOldData()

      if (cleanupResult.error) {
        console.error('❌ Cleanup failed:', cleanupResult.error)
      } else {
        console.log(`✅ Cleanup completed - deleted ${cleanupResult.deletedCount} old records`)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Cron endpoint is working - database updated successfully',
      timestamp: new Date().toISOString(),
      source: 'github-actions',
      cleanup: shouldCleanup ? 'scheduled' : 'skipped',
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
