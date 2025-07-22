# Viral Trending Topics

A modern, real-time viral trending topics aggregator built with Next.js, Vercel Postgres, and GitHub Actions. Fetches data from Reddit, YouTube, and Google Trends to display the most viral content across the internet.

## 🚀 Features

- 🔥 **Real-time Trending Topics** - Live updates from multiple social platforms
- 📊 **Analytics Dashboard** - Trending metrics and insights with platform-specific stats
- 🎨 **Modern UI/UX** - Beautiful, responsive design with dynamic filtering
- 🔄 **Auto-refresh** - Automatic content updates every 15 minutes via GitHub Actions
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🚀 **Fast Performance** - Optimized React components with memoization
- 🎯 **Smart Filtering** - Filter by platform, topic, and sort options
- 📈 **Dynamic Loading** - Load more content with infinite scroll
- 🎨 **Customizable UI** - Flexible platform and topic selection
- ⚡ **Serverless Architecture** - Built on Vercel with automatic scaling

### Currently Active

- **Reddit** - Trending posts from popular subreddits
- **YouTube** - Trending videos and content
- **Google Trends** - Trending searches and topics

## 🛠️ Tech Stack

### Full-Stack Next.js Application

- **Next.js 14** - Modern React framework with App Router
- **TypeScript** - Type-safe development
- **Vercel Postgres** - Managed PostgreSQL database
- **Drizzle ORM** - Type-safe database queries
- **GitHub Actions** - Automated cron jobs (free)
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful, consistent icons
- **Swiper** - Touch slider for stats cards
- **Responsive Design** - Mobile-first approach

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account (for deployment)
- GitHub account (for cron jobs)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd viral/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   # Edit .env.local with your API keys and database URL
   ```

4. **Set up database**

   ```bash
   # Generate database migrations
   npm run db:generate

   # Run migrations (after setting up Vercel Postgres)
   npm run db:migrate
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

### Production Deployment

1. **Deploy to Vercel**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

2. **Set up GitHub Actions**

   - Add `VERCEL_URL` and `CRON_SECRET` to GitHub repository secrets
   - Enable GitHub Actions workflow for cron jobs

3. **Configure Vercel Postgres**
   - Create Postgres database in Vercel dashboard
   - Add `DATABASE_URL` to Vercel environment variables

See `MIGRATION_README.md` for detailed setup instructions.

## 🔑 API Keys Setup

### Required APIs

#### Reddit API

1. Go to https://www.reddit.com/prefs/apps
2. Create a new app (type: "script")
3. Get your Client ID and Client Secret
4. Add to `.env.local`:
   ```env
   REDDIT_CLIENT_ID=your_client_id
   REDDIT_CLIENT_SECRET=your_client_secret
   REDDIT_USER_AGENT=your_app_name/1.0
   ```

#### YouTube Data API

1. Go to https://console.cloud.google.com/
2. Create a project and enable YouTube Data API v3
3. Create API credentials
4. Add to `.env.local`:
   ```env
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

### Environment Variables

Create a `.env.local` file with all required variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Reddit API
REDDIT_CLIENT_ID="your_client_id"
REDDIT_CLIENT_SECRET="your_client_secret"
REDDIT_USER_AGENT="your_app_name/1.0"

# YouTube API
YOUTUBE_API_KEY="your_youtube_api_key"

# Cron Jobs (GitHub Actions)
CRON_SECRET="your_cron_secret"

# Next.js
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

See `env.example` for the complete list of variables.

## 📚 Documentation

- **[Migration Guide](frontend/MIGRATION_README.md)** - Complete migration documentation
- **[Vercel Postgres Setup](frontend/VERCEL_POSTGRES_SETUP.md)** - Database setup guide
- **[Environment Variables](frontend/env.example)** - All required environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
