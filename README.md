# Viral Trending Topics

A modern, real-time viral trending topics aggregator built with Next.js, Supabase, and GitHub Actions. Fetches data from Reddit, YouTube, and Google Trends to display the most viral content across the internet.

## Features

- **Real-time Trending Topics** - Live updates from multiple social platforms
- **Analytics Dashboard** - Trending metrics and insights with platform-specific stats
- **Modern UI/UX** - Beautiful, responsive design with dynamic filtering
- **Auto-refresh** - Automatic content updates every 15 minutes via GitHub Actions
- **Mobile Responsive** - Works perfectly on all devices
- **Smart Filtering** - Filter by platform, topic, and sort options
- **Serverless Architecture** - Built on Vercel with automatic scaling

### Data Sources

- **Reddit** - Trending posts from popular subreddits
- **YouTube** - Trending videos and content
- **Google Trends** - Trending searches and topics

## Tech Stack

- **Next.js 14** - Modern React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - PostgreSQL database with real-time features
- **GitHub Actions** - Automated cron jobs
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful, consistent icons

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)
- GitHub account (for cron jobs)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd viral
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   npm run setup
   # Edit .env.local with your API keys and Supabase credentials
   ```

4. **Set up Supabase database**

   - Create a Supabase project
   - Run the SQL script to create the `trending_topics` table
   - Add your Supabase credentials to `.env.local`

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
   npm i -g vercel
   vercel
   ```

2. **Set up GitHub Actions**

   - Add `VERCEL_URL` and `CRON_SECRET` to GitHub repository secrets
   - The cron job will run automatically every 15 minutes

3. **Configure environment variables**
   - Add all environment variables to Vercel
   - Ensure Supabase credentials are properly set

## Environment Variables

Required environment variables (see `env.example` for complete list):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

# API Keys
REDDIT_CLIENT_ID="your_reddit_client_id"
REDDIT_CLIENT_SECRET="your_reddit_client_secret"
YOUTUBE_API_KEY="your_youtube_api_key"

# Cron Jobs
CRON_SECRET="your_cron_secret"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
