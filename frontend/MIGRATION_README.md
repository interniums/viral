# Viral Trending Topics - Next.js Migration

This project has been migrated from a Python Flask backend to a full Next.js stack with Vercel Postgres, Drizzle ORM, and Next.js cron jobs.

## 🚀 Migration Overview

### What Changed

- **Backend**: Python Flask → Next.js API Routes
- **Database**: SQLite → Vercel Postgres with Drizzle ORM
- **Scheduling**: APScheduler → Next.js Cron Jobs
- **Deployment**: Self-hosted → Vercel (serverless)

### What Stayed the Same

- **Frontend**: React/Next.js (unchanged)
- **UI/UX**: Exact same design and functionality
- **API Endpoints**: Same response format and behavior
- **Data Sources**: Reddit, YouTube, Google Trends APIs

## 🛠️ Tech Stack

### New Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Vercel Postgres (managed PostgreSQL by Vercel)
- **ORM**: Drizzle ORM
- **Caching**: In-memory cache (can be upgraded to Redis)
- **Scheduling**: Vercel Cron Jobs
- **Deployment**: Vercel
- **Language**: TypeScript

### Database Options

#### Vercel Postgres (Recommended)

- **What**: Vercel's own managed PostgreSQL service
- **Pros**: Native Vercel integration, automatic connection pooling, built-in monitoring
- **Cons**: Vendor lock-in to Vercel ecosystem
- **Best for**: Simple to medium complexity apps, Vercel deployment

#### Supabase (Alternative)

- **What**: Open-source Firebase alternative with PostgreSQL
- **Pros**: More features (auth, real-time, storage), can be self-hosted
- **Cons**: Additional service to manage, more complex setup
- **Best for**: Complex apps needing auth, real-time features

#### Other Options

- **Neon**: Serverless PostgreSQL with branching
- **Railway**: Simple PostgreSQL hosting
- **PlanetScale**: MySQL (compatible with Drizzle)

### API Integrations

- **Reddit**: OAuth2 API
- **YouTube**: Data API v3
- **Google Trends**: Demo data (can be upgraded to real API)

## 📁 Project Structure

```
frontend/
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── trending/           # Trending topics endpoints
│   │   ├── stats/              # Statistics endpoint
│   │   ├── last-update/        # Last update endpoint
│   │   ├── update/             # Manual update trigger
│   │   └── cron/               # Cron jobs
│   ├── page.tsx                # Main page (unchanged)
│   └── layout.tsx              # Layout (unchanged)
├── components/                 # React components (unchanged)
├── lib/
│   ├── db/                     # Database configuration
│   │   ├── index.ts            # Drizzle client
│   │   └── schema.ts           # Database schema
│   ├── services/               # API services
│   │   ├── reddit.ts           # Reddit API service
│   │   ├── youtube.ts          # YouTube API service
│   │   ├── googleTrends.ts     # Google Trends service
│   │   └── dataFetcher.ts      # Main data fetcher
│   ├── cache.ts                # Cache manager
│   └── utils/
│       └── topicDetection.ts   # Topic detection logic
├── types/                      # TypeScript types (unchanged)
├── drizzle.config.ts           # Drizzle configuration
├── vercel.json                 # Vercel configuration
└── package.json                # Dependencies
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Copy `env.example` to `.env.local` and fill in your values:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# API Keys
REDDIT_CLIENT_ID="your_reddit_client_id"
REDDIT_CLIENT_SECRET="your_reddit_client_secret"
REDDIT_USER_AGENT="viral_trending_bot/1.0"
YOUTUBE_API_KEY="your_youtube_api_key"

# Cron Job Security
CRON_SECRET="your_cron_secret_key"
```

### 3. Database Setup

```bash
# Generate migration
npm run db:generate

# Run migration
npm run db:migrate

# Open Drizzle Studio (optional)
npm run db:studio
```

### 4. Development

```bash
npm run dev
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Database Setup

#### Option 1: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database
3. Choose "Postgres" and select your plan
4. Copy the connection string to `DATABASE_URL`
5. Run migrations: `npm run db:migrate`

#### Option 2: Supabase (Alternative)

1. Create a Supabase project at https://supabase.com
2. Go to Settings → Database
3. Copy the connection string to `DATABASE_URL`
4. Run migrations: `npm run db:migrate`

#### Option 3: Other PostgreSQL Providers

- **Neon**: https://neon.tech
- **Railway**: https://railway.app
- **PlanetScale**: https://planetscale.com (MySQL, but compatible)

### Cron Jobs

Cron jobs are configured via GitHub Actions:

- Runs every 15 minutes via GitHub Actions workflow
- Updates database with fresh data from APIs
- Requires `CRON_SECRET` environment variable
- See `CRON_JOBS_GUIDE.md` for setup instructions

## 🔄 API Endpoints

All endpoints maintain the same interface as the Python version:

### GET `/api/trending`

- Query params: `sort` (random|engagement|date), `order` (asc|desc)
- Returns: Trending topics with sorting

### GET `/api/trending/all`

- Same as `/api/trending` but returns all topics

### GET `/api/stats`

- Returns: Platform and category statistics

### GET `/api/last-update`

- Returns: Last database update timestamp

### POST `/api/update/trigger`

- Triggers: Manual database update

### GET `/api/cron/update-database`

- Internal: Cron job endpoint (requires auth)

## 📊 Data Flow

1. **GitHub Actions Cron Job** (every 15 minutes):

   - Triggers via GitHub Actions workflow
   - Fetches fresh data from Reddit, YouTube, Google Trends
   - Saves to PostgreSQL database
   - Clears cache

2. **API Requests**:

   - Check cache first
   - Fall back to database
   - Apply sorting/filtering
   - Return formatted data

3. **Frontend**:
   - Fetches data from API endpoints
   - Applies filters and sorting
   - Displays trending topics

## 🔧 Configuration

### Database Schema

```typescript
// lib/db/schema.ts
export const trendingTopics = pgTable('trending_topics', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url'),
  score: integer('score').default(0),
  engagement: integer('engagement').default(0),
  timestamp: timestamp('timestamp').defaultNow(),
  category: text('category'),
  tags: jsonb('tags').$type<string[]>(),
  topic: text('topic').default('general'),
  author: text('author').default('Unknown'),
})
```

### Cache Configuration

```typescript
// lib/cache.ts
export class CacheManager {
  private cacheDuration = 900 // 15 minutes
  // In-memory cache with TTL
}
```

## 🚨 Important Notes

### Migration Considerations

1. **Data Migration**: Existing SQLite data needs to be migrated to PostgreSQL
2. **API Keys**: Ensure all API keys are properly configured
3. **Rate Limits**: Monitor API rate limits for Reddit and YouTube
4. **Cron Jobs**: Verify GitHub Actions workflow is running

### Performance Improvements

- **Database**: PostgreSQL provides better performance than SQLite
- **Caching**: In-memory cache reduces database queries
- **Serverless**: Automatic scaling with Vercel
- **CDN**: Global edge network for faster loading

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Database**: Monitor PostgreSQL connection pool
- **API Limits**: Track Reddit/YouTube API usage
- **Cron Jobs**: Check Vercel function logs

## 🔮 Future Enhancements

### Possible Upgrades

1. **Redis Cache**: Replace in-memory cache with Redis
2. **Real Google Trends**: Integrate with SerpAPI or similar
3. **More Platforms**: Add Twitter, Instagram, TikTok
4. **Analytics**: Add detailed analytics dashboard
5. **Real-time**: WebSocket updates for live data

### Scaling Considerations

- **Database**: Consider read replicas for high traffic
- **Caching**: Implement Redis for distributed caching
- **CDN**: Use Vercel Edge Functions for global performance
- **Monitoring**: Add comprehensive logging and alerting

## 📝 Migration Checklist

- [x] Database schema migration (SQLite → PostgreSQL)
- [x] API routes migration (Flask → Next.js)
- [x] Data fetching services (Python → TypeScript)
- [x] Cron jobs setup (APScheduler → Vercel Cron)
- [x] Environment configuration
- [x] Deployment setup (Vercel)
- [x] Cache implementation
- [x] Error handling
- [x] TypeScript types
- [ ] Data migration script
- [ ] Performance testing
- [ ] Monitoring setup
- [ ] Documentation updates

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection**: Check `DATABASE_URL` format
2. **API Keys**: Verify all API keys are valid
3. **Cron Jobs**: Check Vercel function logs
4. **Caching**: Clear cache if data seems stale
5. **Rate Limits**: Monitor API usage

### Debug Commands

```bash
# Check database connection
npm run db:studio

# Generate new migration
npm run db:generate

# Run migrations
npm run db:migrate

# Check Vercel logs
vercel logs
```

## 📞 Support

For issues or questions about the migration:

1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints individually
4. Review database schema and migrations
