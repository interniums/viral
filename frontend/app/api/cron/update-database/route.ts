import { NextResponse } from 'next/server'
import { dataFetcherService } from '../../../../lib/services/dataFetcher'

// This is a Next.js cron job that runs every 15 minutes
// Configure in vercel.json or use Vercel Cron Jobs
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('⏰ Cron job triggered - updating database...')

    // Run the database update
    await dataFetcherService.updateDatabaseWithFreshData()

    return NextResponse.json({
      success: true,
      message: 'Database update completed successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Cron job failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Database update failed',
      },
      { status: 500 }
    )
  }
}
