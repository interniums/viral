import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // Get the most recent timestamp from the database
    const { data: result, error } = await supabase
      .from('trending_topics')
      .select('timestamp')
      .order('timestamp', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error fetching last update:', error)
      const now = new Date()
      return NextResponse.json({
        success: true,
        last_update: now.toISOString(),
        formatted: now.toLocaleString(),
      })
    }

    const lastUpdate = result?.[0]?.timestamp || new Date()

    return NextResponse.json({
      success: true,
      last_update: lastUpdate,
      formatted: new Date(lastUpdate).toLocaleString(),
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
