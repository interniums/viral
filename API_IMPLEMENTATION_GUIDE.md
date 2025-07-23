# 🚀 Complete API Implementation Guide

This comprehensive guide covers **30+ APIs** to transform your viral trending topics application into a powerful content aggregation platform with diverse data sources from across the internet.

## 📋 **API Categories Overview**

### ✅ **Already Implemented (9 APIs)**

- **Original 3**: Reddit, YouTube, Google Trends
- **New 6**: Hacker News, GitHub Trending, Stack Overflow, Product Hunt, Twitch, Mastodon

### 🔄 **New APIs to Implement (30+ APIs)**

## 1. 📱 **Social Media Platforms**

### **Twitter/X API v2**

- **Status**: ⚠️ Currently restricted (requires paid plan)
- **Setup**: Developer account + API keys
- **Features**: Trending topics, hashtags, viral tweets
- **Rate Limits**: Varies by plan (free tier very limited)
- **Cost**: Free tier available, paid plans required for production

### **TikTok API**

- **Status**: 🔑 Requires developer account
- **Setup**: TikTok for Developers registration
- **Features**: Trending videos, hashtags, viral content
- **Rate Limits**: Varies by plan
- **Cost**: Free tier available

### **LinkedIn API**

- **Status**: 🔑 Requires LinkedIn Developer account
- **Setup**: LinkedIn Marketing API access
- **Features**: Trending business topics, industry news
- **Rate Limits**: Varies by plan
- **Cost**: Free tier available

## 2. 📰 **News & Media Platforms**

### **GNews API** ✅ **Ready to Implement**

- **URL**: https://gnews.io/
- **Features**: Breaking news, trending articles, topic-specific news
- **Rate Limits**: 100 requests/day (free), 1,000/day (paid)
- **Cost**: Free tier available, $49/month for higher limits

### **MediaStack API** ✅ **Ready to Implement**

- **URL**: https://mediastack.com/
- **Features**: Live news, historical data, 75+ languages
- **Rate Limits**: 500 requests/month (free), unlimited (paid)
- **Cost**: Free tier available, $19.99/month for unlimited

### **NewsData.io** ✅ **Ready to Implement**

- **URL**: https://newsdata.io/
- **Features**: Global news, sentiment analysis, categorization
- **Rate Limits**: 200 requests/day (free), 1,000/day (paid)
- **Cost**: Free tier available, $99/month for higher limits

### **The Guardian API** ✅ **Ready to Implement**

- **URL**: https://open-platform.theguardian.com/
- **Features**: High-quality journalism, categorized content
- **Rate Limits**: 500 requests/day (free)
- **Cost**: Free

## 3. 🔗 **Content Aggregation Platforms**

### **Indie Hackers API** ✅ **Ready to Implement**

- **URL**: https://indiehackers.com/api
- **Features**: Startup stories, business insights
- **Rate Limits**: Not specified
- **Cost**: Free

## 4. 💻 **Specialized Content Platforms**

### **Dev.to API** ✅ **Ready to Implement**

- **URL**: https://docs.forem.com/
- **Features**: Developer articles, tech tutorials, programming trends
- **Rate Limits**: Not specified
- **Cost**: Free

### **Medium API** ✅ **Ready to Implement**

- **URL**: https://medium.com/developers
- **Features**: Articles, stories, trending content
- **Rate Limits**: Varies
- **Cost**: Free

## 5. 💰 **Crypto & Finance Platforms**

### **CoinGecko API** ✅ **Ready to Implement**

- **URL**: https://www.coingecko.com/en/api
- **Features**: Cryptocurrency trends, market data, crypto news
- **Rate Limits**: 50 calls/minute (free)
- **Cost**: Free

### **CoinMarketCap API** 🔑 **Requires API Key**

- **URL**: https://coinmarketcap.com/api/
- **Features**: Crypto market data, trending coins
- **Rate Limits**: 10,000 calls/month (free)
- **Cost**: Free tier available, paid plans for higher limits

### **Alpha Vantage API** 🔑 **Requires API Key**

- **URL**: https://www.alphavantage.co/
- **Features**: Stock market data, financial news, economic indicators
- **Rate Limits**: 5 API calls per minute (free)
- **Cost**: Free tier available, $49.99/month for higher limits

## 6. 🎵 **Entertainment & Culture Platforms**

### **Spotify Web API** 🔑 **Requires OAuth Setup**

- **URL**: https://developer.spotify.com/
- **Features**: Trending music, playlists, artist news
- **Rate Limits**: Varies
- **Cost**: Free

### **Steam Web API** ✅ **Ready to Implement**

- **URL**: https://developer.valvesoftware.com/wiki/Steam_Web_API
- **Features**: Gaming trends, popular games, gaming news
- **Rate Limits**: Not specified
- **Cost**: Free

### **The Guardian API** ✅ **Ready to Implement**

- **URL**: https://open-platform.theguardian.com/
- **Features**: High-quality journalism, categorized content
- **Rate Limits**: 500 requests/day (free)
- **Cost**: Free

### **Binance API** ✅ **Ready to Implement**

- **URL**: https://binance-docs.github.io/apidocs/spot/en/
- **Features**: Cryptocurrency trading data, market trends
- **Rate Limits**: 1200 requests/minute (free)
- **Cost**: Free

## 🚀 **Implementation Priority**

### **Phase 1: No Setup Required (Immediate)**

1. **GNews API** - High-quality news content
2. **MediaStack API** - Multi-language news
3. **The Guardian API** - Premium journalism
4. **Indie Hackers API** - Startup content
5. **Dev.to API** - Developer content
6. **CoinGecko API** - Crypto trends
7. **Steam Web API** - Gaming trends
8. **Binance API** - Real-time crypto trading data

### **Phase 2: API Key Required**

1. **NewsData.io** - Advanced news with sentiment
2. **CoinMarketCap API** - Crypto market data
3. **Alpha Vantage API** - Financial data

### **Phase 3: Complex Setup**

1. **Twitter/X API** - Social media trends
2. **TikTok API** - Video content
3. **LinkedIn API** - Business content
4. **Medium API** - Article content
5. **Spotify Web API** - Music trends

## 📊 **Expected Results After Full Implementation**

- **35+ data sources** instead of 3
- **10x more content** variety
- **50+ categories** for better filtering
- **Global coverage** across all major platforms
- **Real-time data** from multiple sources
- **Diverse audience** appeal

## 🔧 **Integration Steps**

### Step 1: Update Data Fetcher Service

Add the new services to your main data fetcher:

```typescript
// lib/services/dataFetcher.ts
import { hackerNewsService } from './hackerNews'
import { githubTrendingService } from './githubTrending'
import { stackOverflowService } from './stackOverflow'
import { productHuntService } from './productHunt'
import { twitchService } from './twitch'
import { mastodonService } from './mastodon'
import { gnewsService } from './gnews'
import { coinGeckoService } from './coingecko'
import { devToService } from './devto'
import { steamService } from './steam'
import { guardianService } from './guardian'
import { binanceService } from './binance'

export class DataFetcherService {
  async updateDatabaseWithFreshData(): Promise<void> {
    try {
      // Existing services
      const redditTopics = await redditService.fetchTrendingTopics()
      const youtubeTopics = await youtubeService.fetchTrendingTopics()
      const googleTrendsTopics = await googleTrendsService.fetchTrendingTopics()

      // New services (Phase 1 - No setup required)
      const hackerNewsTopics = await hackerNewsService.fetchTrendingTopics()
      const githubTopics = await githubTrendingService.fetchTrendingTopics()
      const stackOverflowTopics = await stackOverflowService.fetchTrendingTopics()
      const productHuntTopics = await productHuntService.fetchTrendingTopics()
      const twitchTopics = await twitchService.fetchTrendingTopics()
      const mastodonTopics = await mastodonService.fetchTrendingTopics()
      const gnewsTopics = await gnewsService.fetchTrendingTopics()
      const coinGeckoTopics = await coinGeckoService.fetchTrendingTopics()
      const devToTopics = await devToService.fetchTrendingTopics()
      const steamTopics = await steamService.fetchTrendingTopics()
      const guardianTopics = await guardianService.fetchTrendingTopics()
      const binanceTopics = await binanceService.fetchTrendingTopics()

      // Combine all topics
      const allTopics = [
        ...redditTopics,
        ...youtubeTopics,
        ...googleTrendsTopics,
        ...hackerNewsTopics,
        ...githubTopics,
        ...stackOverflowTopics,
        ...productHuntTopics,
        ...twitchTopics,
        ...mastodonTopics,
        ...gnewsTopics,
        ...coinGeckoTopics,
        ...devToTopics,
        ...steamTopics,
        ...guardianTopics,
        ...binanceTopics,
      ]

      // Insert into database
      // ... existing database logic
    } catch (error) {
      console.error('Error updating database:', error)
    }
  }
}
```

### Step 2: Update Environment Variables

Add these to your `.env.local`:

```env
# Product Hunt API
PRODUCT_HUNT_ACCESS_TOKEN="your_product_hunt_token"

# Twitch API
TWITCH_CLIENT_ID="your_twitch_client_id"
TWITCH_CLIENT_SECRET="your_twitch_client_secret"

# Mastodon API
MASTODON_ACCESS_TOKEN="your_mastodon_token"

# GNews API
GNEWS_API_KEY="your_gnews_api_key"

# CoinMarketCap API
COINMARKETCAP_API_KEY="your_coinmarketcap_api_key"

# Alpha Vantage API
ALPHA_VANTAGE_API_KEY="your_alpha_vantage_api_key"

# Guardian API
GUARDIAN_API_KEY="your_guardian_api_key"

```

### Step 3: Update Platform Icons

Add icons for new platforms in `components/PlatformIcon.tsx`:

```typescript
// Add these cases to your switch statement
case 'Hacker News':
  return <HackerNewsIcon className={className} />
case 'GitHub':
  return <GitHubIcon className={className} />
case 'Stack Overflow':
  return <StackOverflowIcon className={className} />
case 'Product Hunt':
  return <ProductHuntIcon className={className} />
case 'Twitch':
  return <TwitchIcon className={className} />
case 'Mastodon':
  return <MastodonIcon className={className} />
case 'GNews':
  return <NewsIcon className={className} />
case 'CoinGecko':
  return <CryptoIcon className={className} />
case 'Dev.to':
  return <DevIcon className={className} />
case 'Steam':
  return <SteamIcon className={className} />
case 'The Guardian':
  return <GuardianIcon className={className} />
case 'Binance':
  return <BinanceIcon className={className} />
```

### Step 4: Update Constants

Add new platforms to `lib/constants.ts`:

```typescript
export const APP_CONFIG = {
  DEFAULT_PLATFORMS: [
    'Reddit',
    'YouTube',
    'Google Trends',
    'Hacker News',
    'GitHub',
    'Stack Overflow',
    'Product Hunt',
    'Twitch',
    'Mastodon',
    'GNews',
    'CoinGecko',
    'Dev.to',
    'Steam',
    'The Guardian',
    'Binance',
  ],
  // ... rest of config
} as const

export const PLATFORM_COLORS = {
  // ... existing colors
  'Hacker News': 'orange',
  GitHub: 'gray',
  'Stack Overflow': 'orange',
  'Product Hunt': 'red',
  Twitch: 'purple',
  Mastodon: 'blue',
  GNews: 'green',
  CoinGecko: 'yellow',
  'Dev.to': 'purple',
  Steam: 'blue',
  'The Guardian': 'orange',
  Binance: 'yellow',
} as const
```

## 🔑 **API Setup Instructions**

### **Phase 1: No Setup Required (Immediate)**

#### **Hacker News API**

- ✅ **No setup required** - Completely free and open
- **Rate Limits**: None
- **Data Quality**: High - real tech news and discussions

#### **GitHub Trending API**

- ✅ **No setup required** - Public API
- **Rate Limits**: None
- **Data Quality**: High - real trending repositories

#### **Stack Overflow API**

- ✅ **No setup required** - Public API
- **Rate Limits**: 10,000 requests/day
- **Data Quality**: High - real programming questions

#### **CoinGecko API**

- ✅ **No setup required** - Public API
- **Rate Limits**: 50 calls/minute
- **Data Quality**: High - real crypto market data

#### **Dev.to API**

- ✅ **No setup required** - Public API
- **Rate Limits**: Not specified
- **Data Quality**: High - real developer articles

#### **Steam API**

- ✅ **No setup required** - Public API
- **Rate Limits**: Not specified (reasonable usage)
- **Data Quality**: High - real gaming trends and statistics
- **Features**:
  - Popular games and playtime data
  - Gaming category detection (FPS, MOBA, RPG, etc.)
  - Steam store integration
  - Real-time gaming trends

#### **Binance API**

- ✅ **No setup required** - Public API
- **Rate Limits**: 1200 requests/minute (free)
- **Data Quality**: High - real-time cryptocurrency trading data
- **Features**:
  - 24hr trading statistics
  - Top gainers and losers
  - Real-time price movements
  - Trading volume analysis
  - Crypto category detection (major, DeFi, meme coins)

### **Phase 2: API Key Required (Recommended)**

#### **Product Hunt API** ✅ **Already Configured**

- 🔑 **Requires setup**:
  1. Go to [Product Hunt Developers](https://api.producthunt.com/v2/docs)
  2. Create an account and get access token
  3. Add `PRODUCT_HUNT_ACCESS_TOKEN` to environment variables
- **Rate Limits**: 1,000 requests/day
- **Data Quality**: High - real product launches

#### **GNews API**

- 🔑 **Requires setup**:
  1. Go to https://gnews.io/
  2. Click "Get API Key" or "Sign Up"
  3. Create a free account
  4. Copy your API key
  5. Add to `.env.local`:
     ```env
     GNEWS_API_KEY="your_gnews_api_key"
     ```
- **Rate Limits**: 100 requests/day (free)
- **Data Quality**: High - professional news content

#### **CoinMarketCap API**

- 🔑 **Requires setup**:
  1. Go to https://coinmarketcap.com/api/
  2. Click "Get Your Free API Key"
  3. Create an account
  4. Verify your email
  5. Copy your API key
  6. Add to `.env.local`:
     ```env
     COINMARKETCAP_API_KEY="your_coinmarketcap_api_key"
     ```
- **Rate Limits**: 10,000 calls/month (free)
- **Data Quality**: High - professional crypto data

#### **Guardian API**

- 🔑 **Requires setup**:
  1. Go to https://open-platform.theguardian.com/
  2. Click "Get an API key"
  3. Create a free account
  4. Copy your API key
  5. Add to `.env.local`:
     ```env
     GUARDIAN_API_KEY="your_guardian_api_key"
     ```
- **Rate Limits**: 500 requests/day (free)
- **Data Quality**: High - premium journalism content

#### **Steam API Setup Guide**

- ✅ **No API Key Required** - Completely free and open
- **Setup Steps**:
  1. **No registration needed** - Steam API is public
  2. **Direct access** - Use the service immediately
  3. **Rate limits** - Be respectful, no official limits
  4. **Data sources**:
     - Steam App List API
     - Game statistics and playtime
     - Popular games data
- **Features Available**:
  - Trending games detection
  - Gaming category classification
  - Playtime-based scoring
  - Steam store links
- **Demo Data**: Includes fallback data for popular games
- **Categories**: FPS, MOBA, battle-royale, sandbox, RPG, strategy, simulation

#### **Binance API Setup Guide**

- ✅ **No API Key Required** - Public market data API
- **Setup Steps**:
  1. **No registration needed** - Public API access
  2. **Direct access** - Use the service immediately
  3. **Rate limits** - 1200 requests/minute (generous)
  4. **Data sources**:
     - 24hr ticker statistics
     - Real-time price data
     - Trading volume information
- **Features Available**:
  - Real-time crypto trading data
  - Price movement analysis
  - Volume-based engagement scoring
  - Crypto category detection
- **Demo Data**: Includes fallback data for major cryptocurrencies
- **Categories**: Major crypto, DeFi, meme coins, trending, declining
- **Trading Pairs**: Focuses on USDT pairs for consistency

#### **Alpha Vantage API**

- 🔑 **Requires setup**:
  1. Go to https://www.alphavantage.co/
  2. Click "Get Your Free API Key Today"
  3. Fill out the registration form
  4. Copy your API key
  5. Add to `.env.local`:
     ```env
     ALPHA_VANTAGE_API_KEY="your_alpha_vantage_api_key"
     ```
- **Rate Limits**: 5 API calls per minute (free)
- **Data Quality**: High - financial market data

### **Phase 3: Complex Setup (Optional)**

#### **Twitch API**

- 🔑 **Requires setup**:
  1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
  2. Create a new application
  3. Get Client ID and Client Secret
  4. Add `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET` to environment variables
- **Rate Limits**: Unlimited (with reasonable usage)
- **Data Quality**: High - real gaming trends

#### **Mastodon API**

- 🔑 **Requires setup**:
  1. Create account on any Mastodon instance (e.g., mastodon.social)
  2. Go to Settings → Development → New Application
  3. Get access token
  4. Add `MASTODON_ACCESS_TOKEN` to environment variables
- **Rate Limits**: Unlimited (with reasonable usage)
- **Data Quality**: Medium - decentralized social media content

#### **Twitter/X API v2**

- ⚠️ **Currently restricted** - Requires paid plan
- **Cost**: $100/month minimum for basic access
- **Setup**: Complex developer approval process
- **Rate Limits**: Varies by plan (free tier very limited)

## 📊 **Data Categories & Topics**

### **New Categories Added:**

- `artificial-intelligence` - AI/ML content
- `cryptocurrency` - Crypto/blockchain
- `startups` - Startup news and funding
- `security` - Security and privacy
- `programming` - General programming
- `frontend` - Frontend development
- `backend` - Backend development
- `mobile` - Mobile development
- `database` - Database technologies
- `devops` - DevOps and infrastructure
- `open-source` - Open source projects
- `products` - Product launches
- `gaming` - Gaming content
- `entertainment` - Entertainment streams
- `moba` - MOBA games
- `sandbox` - Sandbox games
- `battle-royale` - Battle royale games
- `fps` - First-person shooters
- `social-media` - Social media trends
- `environment` - Environmental topics
- `technology` - General technology

### **New Topics Added:**

- `technology` - Tech news and trends
- `open-source` - Open source projects
- `programming` - Programming discussions
- `products` - Product launches
- `gaming` - Gaming content
- `social-media` - Social media trends

## 🎯 **Benefits of Each API**

### **Hacker News**

- **Strengths**: High-quality tech news, real developer insights
- **Use Case**: Tech professionals, developers, startup founders
- **Content**: Breaking tech news, startup stories, programming discussions

### **GitHub Trending**

- **Strengths**: Real-time open source trends, language popularity
- **Use Case**: Developers, open source contributors
- **Content**: Popular repositories, new frameworks, developer tools

### **Stack Overflow**

- **Strengths**: Programming problem-solving, technology adoption
- **Use Case**: Developers, technical teams
- **Content**: Programming questions, technology discussions, best practices

### **Product Hunt**

- **Strengths**: Product launches, startup ecosystem
- **Use Case**: Entrepreneurs, product managers, early adopters
- **Content**: New products, startup launches, innovation trends

### **Twitch**

- **Strengths**: Gaming trends, live content
- **Use Case**: Gamers, content creators, entertainment seekers
- **Content**: Popular games, live streams, gaming culture

### **Mastodon**

- **Strengths**: Decentralized social media, privacy-focused
- **Use Case**: Privacy-conscious users, tech enthusiasts
- **Content**: Social media trends, privacy discussions, tech culture

## 🚀 **Quick Start Implementation**

### **Phase 1: Immediate Implementation (No Setup)**

These APIs work immediately without any setup:

```typescript
// Already implemented and working:
- Hacker News ✅
- GitHub Trending ✅
- Stack Overflow ✅
- CoinGecko ✅
- Dev.to ✅
- Steam ✅
- Binance ✅
- Product Hunt ✅ (with your API key)
```

### **Phase 2: Add API Keys (Recommended)**

Get these API keys for better data quality:

1. **GNews API** - High-quality news content
2. **Guardian API** - Premium journalism content
3. **CoinMarketCap API** - Professional crypto data
4. **Alpha Vantage API** - Financial market data

### **Phase 3: Advanced Setup (Optional)**

These require more complex setup but provide unique content:

1. **Twitch API** - Gaming trends
2. **Mastodon API** - Decentralized social media
3. **Twitter/X API** - Social media trends (paid)

## 📊 **Expected Results by Phase**

### **Phase 1 (Current)**

- **15 data sources** (12 implemented + 3 existing)
- **5x more content** variety
- **Demo data fallbacks** ensure reliability

### **Phase 2 (With API Keys)**

- **18 data sources**
- **Real-time data** from news and crypto
- **Professional quality** content

### **Phase 3 (Full Implementation)**

- **22+ data sources**
- **Comprehensive coverage** across all platforms
- **Maximum content variety**

## 🔧 **Testing Your Setup**

### **Test Individual APIs**

```bash
# Test Product Hunt (already working)
node -e "
require('dotenv').config({path: '.env.local'})
const { productHuntService } = require('./lib/services/productHunt')
productHuntService.fetchTrendingTopics(3).then(console.log)
"

# Test GNews (after adding API key)
node -e "
require('dotenv').config({path: '.env.local'})
const { gnewsService } = require('./lib/services/gnews')
gnewsService.fetchTrendingTopics(3).then(console.log)
"

# Test Steam API (no setup required)
node -e "
const { steamService } = require('./lib/services/steam')
steamService.fetchTrendingTopics(3).then(console.log)
"

# Test Binance API (no setup required)
node -e "
const { binanceService } = require('./lib/services/binance')
binanceService.fetchTrendingTopics(3).then(console.log)
"

# Test Guardian API (after adding API key)
node -e "
require('dotenv').config({path: '.env.local'})
const { guardianService } = require('./lib/services/guardian')
guardianService.fetchTrendingTopics(3).then(console.log)
"
```

### **Test All APIs**

```bash
# Run comprehensive test
node test_all_apis.js
```

## 🚀 **Deployment Notes**

1. **Environment Variables**: Add all new API keys to Vercel
2. **Rate Limits**: Monitor usage, especially for Stack Overflow and Product Hunt
3. **Error Handling**: All services include fallback to demo data
4. **Performance**: Services run in parallel for faster data fetching
5. **Caching**: Existing cache system works with all new services

## 💡 **Pro Tips**

1. **Start with Phase 1** - Get immediate results
2. **Add API keys gradually** - Don't overwhelm yourself
3. **Monitor rate limits** - Stay within free tiers
4. **Use demo data** - Fallbacks ensure app always works
5. **Test thoroughly** - Verify each API before full integration

## 🗄️ **Database Management**

### **Automatic Data Cleanup**

Your database automatically maintains a **7-day retention period**:

- **Retention Period**: 7 days (configurable in `dataFetcher.ts`)
- **Automatic Cleanup**: Runs daily at 2 AM via cron job
- **Manual Cleanup**: Available via API endpoint
- **Size Monitoring**: Track database size and old records

### **Cleanup Features**

- **Scheduled Cleanup**: Daily automatic cleanup during cron jobs
- **Manual Cleanup**: `POST /api/cleanup` endpoint
- **Size Monitoring**: `GET /api/cleanup` endpoint
- **Batch Processing**: Efficient deletion in batches
- **Error Handling**: Graceful error handling and logging

### **Testing Cleanup**

```bash
# Test database cleanup functionality
node scripts/test-cleanup.js

# Manual cleanup via curl
curl -X POST http://localhost:3000/api/cleanup \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Check database size
curl -X GET http://localhost:3000/api/cleanup \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### **Configuration**

```typescript
// In lib/services/dataFetcher.ts
const CLEANUP_CONFIG = {
  RETENTION_DAYS: 7, // Keep data for 7 days
  BATCH_SIZE: 1000, // Delete in batches
  CLEANUP_INTERVAL_HOURS: 24, // Run daily
} as const
```

## 🔄 **Next Steps**

1. **Test each service** individually
2. **Monitor rate limits** and adjust fetching frequency
3. **Add platform-specific filtering** in the UI
4. **Implement analytics** to track which platforms perform best
5. **Consider adding more APIs** based on user feedback

---

**Ready to implement?** Begin with Phase 1 APIs that require no setup, then gradually add API keys for enhanced functionality!
