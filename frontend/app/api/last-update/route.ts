import { NextResponse } from 'next/server'
import { db, trendingTopics } from '../../../lib/db'

export async function GET() {
  try {
    // Get the most recent timestamp from the database
    const result = await db
      .select({ timestamp: trendingTopics.timestamp })
      .from(trendingTopics)
      .orderBy(trendingTopics.timestamp.desc())
      .limit(1)

    const lastUpdate = result[0]?.timestamp || new Date()

    return NextResponse.json({
      success: true,
      last_update: lastUpdate.toISOString(),
      formatted: lastUpdate.toLocaleString(),
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
