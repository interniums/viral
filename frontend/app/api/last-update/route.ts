import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Temporarily disabled due to Drizzle ORM issues
    // TODO: Fix database connection and re-enable
    const now = new Date()

    return NextResponse.json({
      success: true,
      last_update: now.toISOString(),
      formatted: now.toLocaleString(),
      message: 'API temporarily disabled - fixing database connection',
    })
  } catch (error) {
    console.error('Error in last-update API:', error)
    const now = new Date()
    return NextResponse.json({
      success: true,
      last_update: now.toISOString(),
      formatted: now.toLocaleString(),
    })
  }
}
