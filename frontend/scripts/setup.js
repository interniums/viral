#!/usr/bin/env node

/**
 * Setup Script for Viral Trending Topics
 * Helps with initial project setup
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Viral Trending Topics...')

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...')

  const envContent = `# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# API Keys
REDDIT_CLIENT_ID="your_reddit_client_id"
REDDIT_CLIENT_SECRET="your_reddit_client_secret"
REDDIT_USER_AGENT="viral_trending_bot/1.0"

YOUTUBE_API_KEY="your_youtube_api_key"

# Cron Job Security
CRON_SECRET="your_cron_secret_key"

# Next.js
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
`

  fs.writeFileSync(envPath, envContent)
  console.log('✅ Created .env.local file')
  console.log('⚠️ Please update the environment variables with your actual values')
} else {
  console.log('✅ .env.local already exists')
}

// Check if SQLite database exists for migration
const sqlitePath = path.join(__dirname, '..', '..', 'viral_trends.db')
if (fs.existsSync(sqlitePath)) {
  console.log('📦 Found SQLite database for migration')
  console.log('💡 Run "npm run migrate-data" to migrate data to PostgreSQL')
} else {
  console.log('⚠️ No SQLite database found for migration')
  console.log('💡 You can start fresh with the new PostgreSQL database')
}

console.log('\n📋 Next steps:')
console.log('1. Update .env.local with your actual values')
console.log('2. Create a Vercel Postgres database')
console.log('3. Run: npm run db:generate')
console.log('4. Run: npm run db:migrate')
console.log('5. (Optional) Run: npm run migrate-data')
console.log('6. Run: npm run dev')
console.log('\n🎉 Setup complete!')
