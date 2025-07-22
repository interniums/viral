#!/usr/bin/env node

/**
 * Data Migration Script
 * Migrates data from SQLite to PostgreSQL
 *
 * Usage:
 * 1. Copy your viral_trends.db to the frontend directory
 * 2. Set up your DATABASE_URL in .env.local
 * 3. Run: node scripts/migrate-data.js
 */

const sqlite3 = require('sqlite3').verbose()
const { drizzle } = require('drizzle-orm/postgres-js')
const postgres = require('postgres')
const { trendingTopics } = require('../lib/db/schema')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

async function migrateData() {
  console.log('🚀 Starting data migration from SQLite to PostgreSQL...')

  // Check if SQLite database exists
  const fs = require('fs')
  const sqlitePath = '../viral_trends.db'

  if (!fs.existsSync(sqlitePath)) {
    console.error('❌ SQLite database not found at:', sqlitePath)
    console.log('Please copy your viral_trends.db file to the frontend directory')
    process.exit(1)
  }

  // Check DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables')
    console.log('Please set DATABASE_URL in .env.local')
    process.exit(1)
  }

  try {
    // Connect to SQLite
    console.log('📦 Connecting to SQLite database...')
    const sqliteDb = new sqlite3.Database(sqlitePath)

    // Connect to PostgreSQL
    console.log('🐘 Connecting to PostgreSQL database...')
    const client = postgres(process.env.DATABASE_URL)
    const db = drizzle(client, { schema: { trendingTopics } })

    // Read data from SQLite
    console.log('📖 Reading data from SQLite...')
    const sqliteData = await new Promise((resolve, reject) => {
      sqliteDb.all(
        `
        SELECT platform, title, description, url, score, engagement, 
               category, tags, timestamp, topic, author
        FROM trending_topics
        ORDER BY timestamp DESC
      `,
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        }
      )
    })

    console.log(`📊 Found ${sqliteData.length} records in SQLite`)

    if (sqliteData.length === 0) {
      console.log('⚠️ No data to migrate')
      return
    }

    // Transform data for PostgreSQL
    console.log('🔄 Transforming data...')
    const transformedData = sqliteData.map((row) => ({
      platform: row.platform,
      title: row.title,
      description: row.description,
      url: row.url,
      score: row.score || 0,
      engagement: row.engagement || 0,
      category: row.category,
      tags: row.tags ? JSON.parse(row.tags) : [],
      topic: row.topic || 'general',
      author: row.author || 'Unknown',
      timestamp: new Date(row.timestamp),
    }))

    // Insert data into PostgreSQL
    console.log('💾 Inserting data into PostgreSQL...')
    let insertedCount = 0
    let skippedCount = 0

    for (const record of transformedData) {
      try {
        await db.insert(trendingTopics).values(record).onConflictDoNothing()
        insertedCount++

        if (insertedCount % 100 === 0) {
          console.log(`✅ Inserted ${insertedCount} records...`)
        }
      } catch (error) {
        if (error.code === '23505') {
          // Unique constraint violation
          skippedCount++
        } else {
          console.error('❌ Error inserting record:', error)
        }
      }
    }

    // Close connections
    sqliteDb.close()
    await client.end()

    console.log('🎉 Migration completed!')
    console.log(`✅ Inserted: ${insertedCount} records`)
    console.log(`⏭️ Skipped (duplicates): ${skippedCount} records`)
    console.log(`📊 Total processed: ${sqliteData.length} records`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateData().catch(console.error)
