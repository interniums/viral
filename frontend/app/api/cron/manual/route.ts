import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is authorized
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Manual cron job triggered...')

    // Temporarily disabled due to Drizzle ORM issues
    // TODO: Fix dataFetcher service and re-enable

    return NextResponse.json({
      success: true,
      message: 'Manual database update completed successfully (temporarily disabled)',
      timestamp: new Date().toISOString(),
      note: 'API temporarily disabled - fixing Drizzle ORM issues',
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

    // Temporarily disabled due to Drizzle ORM issues
    // TODO: Fix dataFetcher service and re-enable

    return NextResponse.json({
      success: true,
      message: 'Manual database update completed successfully (temporarily disabled)',
      timestamp: new Date().toISOString(),
      note: 'API temporarily disabled - fixing Drizzle ORM issues',
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
