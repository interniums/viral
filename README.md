# Viral Trending Topics Website

A real-time viral trending topics aggregator that fetches data from multiple social platforms including Reddit, YouTube, News, Instagram, Facebook, and Telegram to display the most viral content across the internet.

## Features

- 🔥 **Real-time Trending Topics** - Live updates from multiple social platforms
- 📊 **Analytics Dashboard** - Trending metrics and insights with platform-specific stats
- 🎨 **Modern UI/UX** - Beautiful, responsive design with dynamic filtering
- 🔄 **Auto-refresh** - Automatic content updates every 5 minutes
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🚀 **Fast Performance** - Optimized React components with memoization
- 🎯 **Smart Filtering** - Filter by platform, topic, and sort options
- 📈 **Dynamic Loading** - Load more content with infinite scroll
- 🎨 **Customizable UI** - Flexible platform and topic selection
- ⚡ **Optimized Backend** - Clean, efficient Python code with proper error handling

### Currently Active

- **Reddit** - Trending posts from popular subreddits
- **YouTube** - Trending videos and content
- **News** - Breaking news and trending articles

### Coming Soon (Placeholder APIs)

- **Instagram** - Trending posts and hashtags
- **Facebook** - Viral posts and trending content
- **Telegram** - Popular channels and trending topics

## Tech Stack

### Backend

- **Python Flask** - High-performance API server
- **Reddit API (PRAW)** - Trending subreddits and posts
- **YouTube Data API v3** - Trending videos and content
- **News API** - Breaking news and trending articles
- **SQLite** - Efficient data storage with automatic cleanup
- **APScheduler** - Background task scheduling for data updates
- **Cache Manager** - Intelligent caching for better performance

### Frontend

- **Next.js 13+** - Modern React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - Optimized state management with useCallback and useMemo
- **Lucide React** - Beautiful, consistent icons
- **Responsive Design** - Mobile-first approach

## Quick Start

### Option 1: Automated Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd viral
   ```

2. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your API keys (see API Keys section below)
   ```

4. **Start the backend**

   ```bash
   python app.py
   ```

5. **Set up and start the frontend** (in a new terminal)

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Open your browser**
   ```
   Backend API: http://localhost:5000
   Frontend: http://localhost:3000
   ```

### Option 2: Manual Setup

1. **Backend Setup**

   ```bash
   # Install Python dependencies
   pip install -r requirements.txt

   # Create environment file
   cp env.example .env
   # Edit .env with your API keys

   # Start backend server
   python app.py
   ```

2. **Frontend Setup**

   ```bash
   # Navigate to frontend directory
   cd frontend

   # Install Node.js dependencies
   npm install

   # Start development server
   npm run dev
   ```

## API Keys Setup Guide

This guide provides detailed instructions for setting up API keys for all supported platforms.

### Required APIs (Core Functionality)

#### Reddit API Setup

**Step 1: Create Reddit App**

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in the details:
   - **Name**: `Viral Trending Topics` (or any name you prefer)
   - **App Type**: Select "script"
   - **Description**: `API for fetching trending topics`
   - **About URL**: Leave blank or add your website
   - **Redirect URI**: `http://localhost:5000/callback` (for development)
4. Click "Create App"

**Step 2: Get Credentials**

- **Client ID**: The string under your app name (looks like: `abc123def456`)
- **Client Secret**: Click "secret" to reveal (looks like: `ghi789jkl012`)

**Step 3: Add to Environment**

```env
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
```

**Rate Limits**: 60 requests per minute (free)

---

#### News API Setup

**Step 1: Sign Up**

1. Go to https://newsapi.org/
2. Click "Get API Key"
3. Fill in registration form
4. Verify your email address

**Step 2: Get API Key**

- Your API key will be displayed on the dashboard
- It looks like: `1234567890abcdef1234567890abcdef`

**Step 3: Add to Environment**

```env
NEWS_API_KEY=your_api_key_here
```

**Rate Limits**: 1,000 requests per day (free tier)

---

### Optional APIs (Enhanced Features)

#### YouTube Data API v3 Setup

**Step 1: Create Google Cloud Project**

1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Enter project name: `Viral Trending Topics`
4. Click "Create"

**Step 2: Enable YouTube Data API**

1. In your project, go to "APIs & Services" → "Library"
2. Search for "YouTube Data API v3"
3. Click on it and press "Enable"

**Step 3: Create API Credentials**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Optional) Click "Restrict Key" to limit usage

**Step 4: Add to Environment**

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

**Rate Limits**: 10,000 requests per day (free tier)

---

## Complete Platform Integration Guide

This comprehensive guide covers all possible platforms you can integrate into your viral trending topics app, organized by category and implementation difficulty.

### Social Media Platforms

#### Twitter/X API Setup

**Step 1: Create Twitter Developer Account**

1. Go to https://developer.twitter.com/
2. Click "Apply for a developer account"
3. Complete the application process
4. Wait for approval (can take 1-3 days)

**Step 2: Create App**

1. In developer portal, click "Create App"
2. Fill in app details:
   - **App Name**: `Viral Trending Topics`
   - **Description**: `API for fetching trending topics and viral content`
3. Click "Create"

**Step 3: Get API Credentials**

1. Go to "Keys and Tokens" tab
2. Note down your **API Key** and **API Secret**
3. Generate **Access Token** and **Access Token Secret**

**Step 4: Add to Environment**

```env
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
TWITTER_BEARER_TOKEN=your_bearer_token
```

**Rate Limits**: Varies by plan (free tier: 500,000 tweets/month)

---

#### Instagram API Setup

**Step 1: Create Meta Developer Account**

1. Go to https://developers.facebook.com/
2. Click "Get Started"
3. Complete account verification (phone number required)
4. Accept terms and conditions

**Step 2: Create Facebook App**

1. Click "Create App" in developer dashboard
2. Choose "Consumer" as app type
3. Fill in app details:
   - **App Name**: `Viral Trending Topics`
   - **Contact Email**: Your email
   - **Business Account**: Skip for now
4. Click "Create App"

**Step 3: Add Instagram Basic Display**

1. In app dashboard, click "Add Product"
2. Find "Instagram Basic Display"
3. Click "Set Up"
4. Configure settings:
   - **Client OAuth Settings**: Add `http://localhost:5000/instagram/callback`
   - **Deauthorize Callback URL**: `http://localhost:5000/instagram/deauthorize`
   - **Data Deletion Request URL**: `http://localhost:5000/instagram/data-deletion`

**Step 4: Get API Credentials**

1. Go to "Instagram Basic Display" → "Basic Display"
2. Note down your **Instagram App ID**
3. Click "Generate" next to **Instagram App Secret**

**Step 5: Add to Environment**

```env
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
```

**Important Notes**:

- Requires app review for production use
- Development mode allows limited testing
- Business accounts have different API access

---

#### Facebook API Setup

**Step 1: Use Existing Meta Developer Account**

- Use the same developer account from Instagram setup
- Or create new one at https://developers.facebook.com/

**Step 2: Create Facebook App**

1. Click "Create App" in developer dashboard
2. Choose "Consumer" as app type
3. Fill in app details (same as Instagram setup)
4. Click "Create App"

**Step 3: Add Facebook Login**

1. In app dashboard, click "Add Product"
2. Find "Facebook Login"
3. Click "Set Up"
4. Configure settings:
   - **Valid OAuth Redirect URIs**: `http://localhost:5000/facebook/callback`
   - **Client OAuth Login**: Enable
   - **Web OAuth Login**: Enable

**Step 4: Get API Credentials**

1. Go to "Settings" → "Basic"
2. Note down your **App ID**
3. Click "Show" next to **App Secret**

**Step 5: Add to Environment**

```env
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

**Important Notes**:

- Requires app review for production use
- Development mode allows limited testing
- Different permissions needed for different features

---

#### TikTok API Setup

**Step 1: Create TikTok Developer Account**

1. Go to https://developers.tiktok.com/
2. Click "Register" and create account
3. Complete email verification

**Step 2: Create App**

1. In developer portal, click "Create App"
2. Fill in app details:
   - **App Name**: `Viral Trending Topics`
   - **App Description**: `API for fetching trending videos and content`
3. Click "Create"

**Step 3: Get API Credentials**

1. Go to "App Management" → "App Info"
2. Note down your **Client Key** and **Client Secret**
3. Generate access tokens as needed

**Step 4: Add to Environment**

```env
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_ACCESS_TOKEN=your_access_token
```

**Rate Limits**: Varies by plan

---

#### LinkedIn API Setup

**Step 1: Create LinkedIn Developer Account**

1. Go to https://www.linkedin.com/developers/
2. Click "Create App"
3. Fill in app details:
   - **App Name**: `Viral Trending Topics`
   - **LinkedIn Page**: Your company page (optional)
4. Click "Create App"

**Step 2: Get API Credentials**

1. Go to "Auth" tab
2. Note down your **Client ID** and **Client Secret**
3. Add redirect URLs: `http://localhost:5000/linkedin/callback`

**Step 3: Add to Environment**

```env
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

**Rate Limits**: Varies by plan

---

#### Telegram API Setup

**Step 1: Create Telegram Bot**

1. Open Telegram app or web
2. Search for "@BotFather"
3. Start a chat with BotFather
4. Send `/newbot` command
5. Follow instructions:
   - Enter bot name: `Viral Trending Bot`
   - Enter bot username: `viral_trending_bot` (must end with 'bot')
6. BotFather will give you a bot token

**Step 2: Get Channel Access**

1. **For Public Channels**: No additional setup needed
2. **For Private Channels**:
   - Add your bot as an admin to the channel
   - Note down channel username or ID

**Step 3: Test Bot**

1. Send `/start` to your bot
2. Verify bot responds correctly

**Step 4: Add to Environment**

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNELS=channel1,channel2,channel3
```

**Important Notes**:

- Bot tokens are free
- No strict rate limits
- Follow Telegram's usage guidelines
- Respect channel privacy settings

---

### News & Media Platforms

#### GNews API Setup (Alternative to News API)

**Step 1: Sign Up**

1. Go to https://gnews.io/
2. Click "Get API Key"
3. Fill in registration form
4. Verify your email address

**Step 2: Get API Key**

- Your API key will be displayed on the dashboard
- It looks like: `1234567890abcdef1234567890abcdef`

**Step 3: Add to Environment**

```env
GNEWS_API_KEY=your_gnews_api_key_here
```

**Rate Limits**: 100 requests/day (free), 1,000/day (paid)
**Cost**: Free tier available, $49/month for higher limits

---

#### MediaStack API Setup

**Step 1: Sign Up**

1. Go to https://mediastack.com/
2. Click "Get Free API Key"
3. Fill in registration form
4. Verify your email address

**Step 2: Get API Key**

- Your API key will be displayed on the dashboard
- It looks like: `1234567890abcdef1234567890abcdef`

**Step 3: Add to Environment**

```env
MEDIASTACK_API_KEY=your_mediastack_api_key_here
```

**Rate Limits**: 500 requests/month (free), unlimited (paid)
**Cost**: Free tier available, $19.99/month for unlimited

---

#### NewsData.io Setup

**Step 1: Sign Up**

1. Go to https://newsdata.io/
2. Click "Get API Key"
3. Fill in registration form
4. Verify your email address

**Step 2: Get API Key**

- Your API key will be displayed on the dashboard
- It looks like: `pub_1234567890abcdef1234567890abcdef`

**Step 3: Add to Environment**

```env
NEWSDATA_API_KEY=your_newsdata_api_key_here
```

**Rate Limits**: 200 requests/day (free), 1,000/day (paid)
**Cost**: Free tier available, $99/month for higher limits

---

#### The Guardian API Setup

**Step 1: Sign Up**

1. Go to https://open-platform.theguardian.com/
2. Click "Get a key"
3. Fill in registration form
4. Verify your email address

**Step 2: Get API Key**

- Your API key will be displayed on the dashboard
- It looks like: `12345678-1234-1234-1234-123456789012`

**Step 3: Add to Environment**

```env
GUARDIAN_API_KEY=your_guardian_api_key_here
```

**Rate Limits**: 500 requests/day (free)
**Cost**: Free

---

### Content Aggregation Platforms

#### Hacker News API Setup

**Step 1: No Registration Required**

- Hacker News API is completely free and open
- No API key required
- No registration needed

**Step 2: Add to Environment**

```env
# No API key needed for Hacker News
HACKER_NEWS_ENABLED=true
```

**Rate Limits**: No official limits
**Cost**: Free

---

#### Product Hunt API Setup

**Step 1: Sign Up**

1. Go to https://api.producthunt.com/
2. Click "Get API Key"
3. Fill in registration form
4. Verify your email address

**Step 2: Get API Key**

- Your API key will be displayed on the dashboard
- It looks like: `12345678-1234-1234-1234-123456789012`

**Step 3: Add to Environment**

```env
PRODUCTHUNT_API_KEY=your_producthunt_api_key_here
```

**Rate Limits**: 1,000 requests/day (free)
**Cost**: Free

---

#### Indie Hackers API Setup

**Step 1: No Registration Required**

- Indie Hackers API is free and open
- No API key required
- No registration needed

**Step 2: Add to Environment**

```env
# No API key needed for Indie Hackers
INDIE_HACKERS_ENABLED=true
```

**Rate Limits**: Not specified
**Cost**: Free

---

### Specialized Content Platforms

#### Dev.to API Setup

**Step 1: No Registration Required**

- Dev.to API is completely free and open
- No API key required
- No registration needed

**Step 2: Add to Environment**

```env
# No API key needed for Dev.to
DEVTO_ENABLED=true
```

**Rate Limits**: Not specified
**Cost**: Free

---

#### Medium API Setup

**Step 1: Sign Up**

1. Go to https://medium.com/developers
2. Click "Get Started"
3. Fill in registration form
4. Verify your email address

**Step 2: Get API Key**

- Your API key will be displayed on the dashboard
- It looks like: `1234567890abcdef1234567890abcdef`

**Step 3: Add to Environment**

```env
MEDIUM_API_KEY=your_medium_api_key_here
```

**Rate Limits**: Varies
**Cost**: Free

---

#### Stack Overflow API Setup

**Step 1: No Registration Required**

- Stack Overflow API is free and open
- No API key required for basic usage
- Registration recommended for higher limits

**Step 2: Add to Environment**

```env
# No API key needed for basic Stack Overflow usage
STACKOVERFLOW_ENABLED=true
# Optional: Add API key for higher limits
STACKOVERFLOW_API_KEY=your_stackoverflow_api_key_here
```

**Rate Limits**: 10,000 requests/day (free)
**Cost**: Free

---

### Crypto & Finance Platforms

#### CoinGecko API Setup

**Step 1: No Registration Required**

- CoinGecko API is completely free and open
- No API key required
- No registration needed

**Step 2: Add to Environment**

```env
# No API key needed for CoinGecko
COINGECKO_ENABLED=true
```

**Rate Limits**: 50 calls/minute (free)
**Cost**: Free

---

#### CoinMarketCap API Setup

**Step 1: Sign Up**

1. Go to https://coinmarketcap.com/api/
2. Click "Get API Key"
3. Fill in registration form
4. Verify your email address

**Step 2: Get API Key**

- Your API key will be displayed on the dashboard
- It looks like: `12345678-1234-1234-1234-123456789012`

**Step 3: Add to Environment**

```env
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
```

**Rate Limits**: 10,000 calls/month (free)
**Cost**: Free tier available, paid plans for higher limits

---

#### Alpha Vantage API Setup

**Step 1: Sign Up**

1. Go to https://www.alphavantage.co/
2. Click "Get Your Free API Key"
3. Fill in registration form
4. Verify your email address

**Step 2: Get API Key**

- Your API key will be displayed on the dashboard
- It looks like: `1234567890ABCDEF`

**Step 3: Add to Environment**

```env
ALPHA_VANTAGE_API_KEY=your_alphavantage_api_key_here
```

**Rate Limits**: 5 API calls per minute (free)
**Cost**: Free tier available, $49.99/month for higher limits

---

### Entertainment & Culture Platforms

#### Spotify Web API Setup

**Step 1: Create Spotify Developer Account**

1. Go to https://developer.spotify.com/
2. Click "Log In" and create account
3. Complete email verification

**Step 2: Create App**

1. In developer dashboard, click "Create App"
2. Fill in app details:
   - **App Name**: `Viral Trending Topics`
   - **App Description**: `API for fetching trending music and playlists`
3. Click "Create"

**Step 3: Get API Credentials**

1. Go to "Settings" tab
2. Note down your **Client ID** and **Client Secret**
3. Add redirect URIs: `http://localhost:5000/spotify/callback`

**Step 4: Add to Environment**

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

**Rate Limits**: Varies
**Cost**: Free

---

#### IMDb API Setup

**Step 1: Sign Up**

1. Go to https://imdb-api.com/
2. Click "Get API Key"
3. Fill in registration form
4. Verify your email address

**Step 2: Get API Key**

- Your API key will be displayed on the dashboard
- It looks like: `k_1234567890`

**Step 3: Add to Environment**

```env
IMDB_API_KEY=your_imdb_api_key_here
```

**Rate Limits**: 100 requests/day (free)
**Cost**: Free tier available, paid plans for higher limits

---

#### Steam Web API Setup

**Step 1: No Registration Required**

- Steam Web API is free and open
- No API key required
- No registration needed

**Step 2: Add to Environment**

```env
# No API key needed for Steam
STEAM_ENABLED=true
```

**Rate Limits**: Not specified
**Cost**: Free

---

### Real-time Data Platforms

#### WebSocket APIs Setup

**Step 1: Binance WebSocket**

```env
BINANCE_WEBSOCKET_ENABLED=true
BINANCE_WEBSOCKET_URL=wss://stream.binance.com:9443/ws/btcusdt@trade
```

**Step 2: Twitter Streaming API**

```env
TWITTER_STREAMING_ENABLED=true
TWITTER_STREAMING_RULES=your_streaming_rules
```

**Step 3: Reddit WebSocket (via Reddit API)**

```env
REDDIT_STREAMING_ENABLED=true
```

**Rate Limits**: Varies by platform
**Cost**: Usually free for basic usage

---

### Implementation Priority Guide

#### 🟢 Easy to Implement (Recommended First)

1. **Hacker News API** - No setup required, instant integration
2. **GNews API** - Simple REST API, good alternative to News API
3. **CoinGecko API** - No setup required, crypto trends
4. **Dev.to API** - No setup required, developer content
5. **Stack Overflow API** - No setup required, programming trends

#### 🟡 Medium Difficulty

1. **Product Hunt API** - Requires registration but simple setup
2. **The Guardian API** - Free, good quality journalism
3. **Spotify Web API** - OAuth flow required
4. **IMDb API** - Simple REST API
5. **Steam Web API** - No setup required

#### 🔴 Advanced (Requires More Setup)

1. **Twitter/X API** - Requires developer approval
2. **Instagram API** - Requires Meta developer account and app review
3. **Facebook API** - Requires Meta developer account and app review
4. **TikTok API** - Requires developer account
5. **LinkedIn API** - Requires developer account
6. **Telegram API** - Bot setup required
7. **WebSocket APIs** - Real-time data handling

---

### Complete Environment File Template

Create a `.env` file in the root directory with all your API keys:

```env
# Required APIs (Core Functionality)
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
NEWS_API_KEY=your_news_api_key
YOUTUBE_API_KEY=your_youtube_api_key

# Social Media Platforms
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
TWITTER_BEARER_TOKEN=your_bearer_token

INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_ACCESS_TOKEN=your_access_token

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNELS=channel1,channel2,channel3

# News & Media Platforms
GNEWS_API_KEY=your_gnews_api_key
MEDIASTACK_API_KEY=your_mediastack_api_key
NEWSDATA_API_KEY=your_newsdata_api_key
GUARDIAN_API_KEY=your_guardian_api_key

# Content Aggregation Platforms
PRODUCTHUNT_API_KEY=your_producthunt_api_key
HACKER_NEWS_ENABLED=true
INDIE_HACKERS_ENABLED=true

# Specialized Content Platforms
MEDIUM_API_KEY=your_medium_api_key
DEVTO_ENABLED=true
STACKOVERFLOW_ENABLED=true
STACKOVERFLOW_API_KEY=your_stackoverflow_api_key

# Crypto & Finance Platforms
COINGECKO_ENABLED=true
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
ALPHA_VANTAGE_API_KEY=your_alphavantage_api_key

# Entertainment & Culture Platforms
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
IMDB_API_KEY=your_imdb_api_key
STEAM_ENABLED=true

# Real-time Data Platforms
BINANCE_WEBSOCKET_ENABLED=true
BINANCE_WEBSOCKET_URL=wss://stream.binance.com:9443/ws/btcusdt@trade
TWITTER_STREAMING_ENABLED=true
REDDIT_STREAMING_ENABLED=true

# Flask Configuration
FLASK_SECRET_KEY=your_random_secret_key_here
FLASK_ENV=development
```

### API Rate Limits & Costs Summary

| Platform           | Setup Difficulty | Free Tier  | Rate Limit | Production Cost  |
| ------------------ | ---------------- | ---------- | ---------- | ---------------- |
| **Reddit**         | Easy             | ✅ Free    | 60/min     | Free             |
| **News API**       | Easy             | ✅ Free    | 1K/day     | $449/month       |
| **YouTube**        | Medium           | ✅ Free    | 10K/day    | $5/1000 requests |
| **Hacker News**    | Easy             | ✅ Free    | No limit   | Free             |
| **GNews**          | Easy             | ✅ Free    | 100/day    | $49/month        |
| **CoinGecko**      | Easy             | ✅ Free    | 50/min     | Free             |
| **Dev.to**         | Easy             | ✅ Free    | Flexible   | Free             |
| **Stack Overflow** | Easy             | ✅ Free    | 10K/day    | Free             |
| **Product Hunt**   | Medium           | ✅ Free    | 1K/day     | Free             |
| **The Guardian**   | Easy             | ✅ Free    | 500/day    | Free             |
| **Spotify**        | Medium           | ✅ Free    | Variable   | Free             |
| **IMDb**           | Easy             | ✅ Free    | 100/day    | $99/month        |
| **Steam**          | Easy             | ✅ Free    | Flexible   | Free             |
| **Twitter/X**      | Hard             | ⚠️ Limited | Variable   | $100/month       |
| **Instagram**      | Hard             | ⚠️ Limited | Variable   | $0-200+/month    |
| **Facebook**       | Hard             | ⚠️ Limited | Variable   | $0-200+/month    |
| **TikTok**         | Hard             | ⚠️ Limited | Variable   | $0-200+/month    |
| **LinkedIn**       | Medium           | ⚠️ Limited | Variable   | $0-200+/month    |
| **Telegram**       | Medium           | ✅ Free    | Flexible   | Free             |
| **CoinMarketCap**  | Easy             | ✅ Free    | 10K/month  | $29/month        |
| **Alpha Vantage**  | Easy             | ✅ Free    | 5/min      | $49.99/month     |
| **MediaStack**     | Easy             | ✅ Free    | 500/month  | $19.99/month     |
| **NewsData.io**    | Easy             | ✅ Free    | 200/day    | $99/month        |

### Implementation Tips

1. **Start with Easy APIs**: Begin with Hacker News, GNews, CoinGecko, and Dev.to
2. **Test Each Integration**: Verify each API works before moving to the next
3. **Monitor Rate Limits**: Implement proper rate limiting and caching
4. **Error Handling**: Add robust error handling for each API
5. **Gradual Rollout**: Add platforms one by one to test stability
6. **Backup Data**: Always have fallback data sources
7. **Cost Management**: Monitor API usage to avoid unexpected costs

### Troubleshooting Common Issues

1. **API Key Issues**: Double-check API keys and ensure they're active
2. **Rate Limiting**: Implement exponential backoff for rate-limited requests
3. **CORS Issues**: Ensure proper CORS configuration for web requests
4. **Authentication**: Follow OAuth flows correctly for social media APIs
5. **Data Format**: Handle different response formats from various APIs
6. **Network Issues**: Implement retry logic for failed requests
7. **App Review**: For Meta platforms, be patient with app review process
