# Supabase Setup Guide

This guide will help you set up Supabase for your Viral Trends application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `viral-trends` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## 3. Create the Database Table

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the following SQL to create the `trending_topics` table:

```sql
-- Create the trending_topics table
CREATE TABLE trending_topics (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  score INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  topic TEXT DEFAULT 'general',
  author TEXT DEFAULT 'Unknown',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_trending_topics_platform ON trending_topics(platform);
CREATE INDEX idx_trending_topics_timestamp ON trending_topics(timestamp);
CREATE INDEX idx_trending_topics_category ON trending_topics(category);

-- Create a unique constraint to prevent duplicates
CREATE UNIQUE INDEX idx_trending_topics_unique
ON trending_topics(platform, title, url)
WHERE url IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE trending_topics ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for this app)
CREATE POLICY "Allow all operations" ON trending_topics
FOR ALL USING (true);
```

## 4. Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
   ```

3. Add your API keys:
   ```env
   REDDIT_CLIENT_ID="your_reddit_client_id"
   REDDIT_CLIENT_SECRET="your_reddit_client_secret"
   YOUTUBE_API_KEY="your_youtube_api_key"
   CRON_SECRET="your_cron_secret"
   ```

## 5. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables in Vercel:
   - Go to your project settings
   - Navigate to **Environment Variables**
   - Add all the variables from your `.env.local`

## 6. Test the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Test the API endpoints:

   ```bash
   # Test trending topics
   curl http://localhost:3000/api/trending

   # Test stats
   curl http://localhost:3000/api/stats

   # Test manual update
   curl -X POST http://localhost:3000/api/update/trigger
   ```

## 7. Set Up GitHub Actions (Optional)

If you want to use GitHub Actions for cron jobs:

1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Add the following secrets:
   - `VERCEL_URL`: Your Vercel deployment URL
   - `CRON_SECRET`: Same value as in your environment variables

## 8. Database Management

### View Data

- Go to **Table Editor** in Supabase dashboard
- Select the `trending_topics` table
- View, edit, or delete records

### Monitor Usage

- Go to **Dashboard** → **Usage** to monitor:
  - Database requests
  - Storage usage
  - Bandwidth

### Backup

- Supabase automatically backs up your database
- You can also export data via SQL Editor

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**

   - Check that your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
   - Make sure you're using the "anon public" key, not the service role key

2. **"Table does not exist" error**

   - Run the SQL script above to create the table
   - Check that the table name is exactly `trending_topics`

3. **"RLS policy violation" error**

   - The SQL script above includes a policy that allows all operations
   - If you want more security, you can modify the RLS policies

4. **Environment variables not working**
   - Make sure you're using `NEXT_PUBLIC_` prefix for client-side variables
   - Restart your development server after changing environment variables

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

## Next Steps

Once Supabase is set up:

1. **Test the application** - Make sure all API endpoints work
2. **Set up monitoring** - Monitor your database usage
3. **Configure backups** - Set up automated backups if needed
4. **Scale as needed** - Upgrade your Supabase plan as your app grows
