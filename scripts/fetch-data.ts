import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Config for APIs
const API_CONFIG = {
  // Reddit
  REDDIT_CLIENT_ID: '3ZahbIbGMmmB_U8ep-sZDA',
  REDDIT_CLIENT_SECRET: 'pL2EnqMvAS822olqb57HMZEmsK5cJQ',
  REDDIT_USER_AGENT: 'viral_trending_bot/1.0',

  // YouTube
  YOUTUBE_API_KEY: 'AIzaSyDW92700__Hr6upXP9zJXb_wZ2aE3cpQ98',

  // GNews
  GNEWS_API_KEY: '67801d8b936dce29c1517795dddb3e37',

  // Product Hunt
  PRODUCT_HUNT_ACCESS_TOKEN: 'sE_UkyxhfwPanRNMfh9SUNMsqdfNg8KLuw-SioX35jg',

  // Twitch
  TWITCH_CLIENT_ID: '', // Add your Twitch client ID
  TWITCH_CLIENT_SECRET: '', // Add your Twitch client secret

  // Mastodon
  MASTODON_ACCESS_TOKEN: '6Dji0W_4UeJu1YD3pIWdKMT0nUzmR0l4M1LE9I2TB4Y',
  MASTODON_INSTANCE: 'mastodon.social',

  // Guardian
  GUARDIAN_API_KEY: '562b026c-5221-4e6d-bbf7-3b9a26018961',

  // GitHub Trending
  GITHUB_TRENDING_ENABLED: 'true',

  // APIs that work without auth
  HACKER_NEWS_ENABLED: 'true',
  STACK_OVERFLOW_ENABLED: 'true',
  COINGECKO_ENABLED: 'true',
  DEVTO_ENABLED: 'true',
  STEAM_ENABLED: 'true',
  BINANCE_ENABLED: 'true',
}

// Set environment variables
console.log('Setting environment variables...')
Object.entries(API_CONFIG).forEach(([key, value]) => {
  if (value) {
    process.env[key] = value
    console.log(`Set ${key}: ${value}`)
  }
})

// Import all services
import { RedditService } from '../lib/services/reddit'
import { YouTubeService } from '../lib/services/youtube'
import { GoogleTrendsService } from '../lib/services/googleTrends'
import { HackerNewsService } from '../lib/services/hackerNews'
import { GitHubTrendingService } from '../lib/services/githubTrending'
import { StackOverflowService } from '../lib/services/stackOverflow'
import { ProductHuntService } from '../lib/services/productHunt'
import { TwitchService } from '../lib/services/twitch'
import { MastodonService } from '../lib/services/mastodon'
import { GNewsService } from '../lib/services/gnews'
import { CoinGeckoService } from '../lib/services/coingecko'
import { DevToService } from '../lib/services/devto'
import { SteamService } from '../lib/services/steam'
import { GuardianService } from '../lib/services/guardian'
import { BinanceService } from '../lib/services/binance'
import { dataFetcherService } from '../lib/services/dataFetcher'

// Create service instances
const services = {
  redditService: new RedditService(),
  youtubeService: new YouTubeService(),
  googleTrendsService: new GoogleTrendsService(),
  hackerNewsService: new HackerNewsService(),
  githubTrendingService: new GitHubTrendingService(),
  stackOverflowService: new StackOverflowService(),
  productHuntService: new ProductHuntService(),
  twitchService: new TwitchService(),
  mastodonService: new MastodonService(),
  gnewsService: new GNewsService(),
  coinGeckoService: new CoinGeckoService(),
  devToService: new DevToService(),
  steamService: new SteamService(),
  guardianService: new GuardianService(),
  binanceService: new BinanceService(),
}

// Set services in dataFetcher
dataFetcherService.setServices(services)

async function fetchData() {
  console.log('\n🚀 Starting manual data fetch...')

  try {
    await dataFetcherService.updateDatabaseWithFreshData()
    console.log('✅ Data fetch completed successfully!')

    // Get stats after fetch
    const stats = await dataFetcherService.getStats()
    console.log('\n📊 Current Database Stats:')
    console.log(`Total topics (7 days): ${stats.total_topics_7d}`)
    console.log('\nPlatform distribution:')
    Object.entries(stats.platform_stats).forEach(([platform, count]) => {
      console.log(`${platform}: ${count} topics`)
    })

    // Get database size info
    const sizeInfo = await dataFetcherService.getDatabaseSize()
    console.log('\n💾 Database Size Info:')
    console.log(`Total records: ${sizeInfo.totalRecords}`)
    console.log(`Records older than ${sizeInfo.retentionDays} days: ${sizeInfo.oldRecords}`)
  } catch (error) {
    console.error('❌ Error during data fetch:', error)
  }
}

// Run the fetch
fetchData()
