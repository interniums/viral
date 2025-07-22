import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized
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

    return NextResponse.json({
      success: true,
      message: 'GitHub Actions cron job test successful!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    })
  } catch (error) {
    console.error('❌ Test endpoint error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Test endpoint failed',
      },
      { status: 500 }
    )
  }
}
