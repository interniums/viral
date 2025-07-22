#!/usr/bin/env node

/**
 * Setup Script for Viral Trending Topics
 * Helps with initial project setup
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Viral Trending Topics with Supabase...')

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...')

  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

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
  console.log('💡 You can manually migrate data to Supabase if needed')
} else {
  console.log('⚠️ No SQLite database found for migration')
  console.log('💡 You can start fresh with the new Supabase database')
}

console.log('\n📋 Next steps:')
console.log('1. Update .env.local with your Supabase credentials')
console.log('2. Create a Supabase project at https://supabase.com')
console.log('3. Run the SQL script from SUPABASE_SETUP.md in your Supabase SQL Editor')
console.log('4. Test the connection: npm run dev')
console.log('5. Deploy to Vercel with your environment variables')
console.log('\n📖 See SUPABASE_SETUP.md for detailed instructions')
console.log('\n🎉 Setup complete!')
