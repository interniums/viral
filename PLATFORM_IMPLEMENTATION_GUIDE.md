# Platform Implementation Guide

This guide provides detailed code examples for implementing each platform in your viral trending topics app.

## Quick Start Implementation Order

### 🟢 Phase 1: Easy APIs (No Setup Required)

1. **Hacker News API** - Instant integration
2. **CoinGecko API** - Crypto trends
3. **Dev.to API** - Developer content
4. **Stack Overflow API** - Programming trends

### 🟡 Phase 2: Simple APIs (Basic Setup)

1. **GNews API** - Alternative news source
2. **Product Hunt API** - Startup trends
3. **The Guardian API** - Quality journalism
4. **IMDb API** - Entertainment trends

### 🔴 Phase 3: Advanced APIs (Complex Setup)

1. **Twitter/X API** - Social media trends
2. **Instagram API** - Visual content
3. **Facebook API** - Social trends
4. **Telegram API** - Channel content

---

## Implementation Examples

### 1. Hacker News API (No Setup Required)

```python
import requests
import json
from datetime import datetime

def fetch_hackernews_trending():
    """Fetch trending stories from Hacker News"""
    trending_topics = []

    try:
        # Get top story IDs
        top_stories_url = "https://hacker-news.firebaseio.com/v0/topstories.json"
        response = requests.get(top_stories_url)
        story_ids = response.json()[:50]  # Get top 50 stories

        for story_id in story_ids:
            # Get story details
            story_url = f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json"
            story_response = requests.get(story_url)
            story = story_response.json()

            if story and story.get('type') == 'story':
                topic = {
                    'platform': 'Hacker News',
                    'title': story.get('title', ''),
                    'description': f"Score: {story.get('score', 0)} | Comments: {story.get('descendants', 0)}",
                    'url': story.get('url', f"https://news.ycombinator.com/item?id={story_id}"),
                    'score': story.get('score', 0),
                    'engagement': story.get('score', 0) + story.get('descendants', 0),
                    'category': 'Technology',
                    'topic': 'technology',
                    'tags': ['hackernews', 'technology', 'programming'],
                    'author': story.get('by', 'Anonymous'),
                    'timestamp': datetime.fromtimestamp(story.get('time', 0)).isoformat()
                }
                trending_topics.append(topic)

        return trending_topics

    except Exception as e:
        print(f"❌ Error fetching Hacker News: {e}")
        return []
```

### 2. CoinGecko API (No Setup Required)

```python
import requests
from datetime import datetime

def fetch_coingecko_trending():
    """Fetch trending cryptocurrencies from CoinGecko"""
    trending_topics = []

    try:
        # Get trending coins
        url = "https://api.coingecko.com/api/v3/search/trending"
        response = requests.get(url)
        data = response.json()

        for coin in data.get('coins', [])[:20]:
            coin_data = coin.get('item', {})

            topic = {
                'platform': 'CoinGecko',
                'title': f"{coin_data.get('name', 'Unknown')} ({coin_data.get('symbol', '').upper()})",
                'description': f"Price: ${coin_data.get('price_btc', 0):.8f} BTC | Market Cap Rank: #{coin_data.get('market_cap_rank', 'N/A')}",
                'url': f"https://www.coingecko.com/en/coins/{coin_data.get('id', '')}",
                'score': coin_data.get('score', 0),
                'engagement': coin_data.get('score', 0),
                'category': 'Cryptocurrency',
                'topic': 'crypto',
                'tags': ['cryptocurrency', 'crypto', 'bitcoin', 'altcoin'],
                'author': 'CoinGecko',
                'timestamp': datetime.now().isoformat()
            }
            trending_topics.append(topic)

        return trending_topics

    except Exception as e:
        print(f"❌ Error fetching CoinGecko: {e}")
        return []
```

### 3. GNews API (Simple Setup)

```python
import os
import requests
from datetime import datetime

def fetch_gnews_trending():
    """Fetch trending news from GNews API"""
    trending_topics = []

    api_key = os.getenv('GNEWS_API_KEY')
    if not api_key:
        print("❌ GNews API key not found")
        return []

    try:
        # Get top headlines
        url = f"https://gnews.io/api/v4/top-headlines"
        params = {
            'token': api_key,
            'lang': 'en',
            'country': 'us',
            'max': 50
        }

        response = requests.get(url, params=params)
        data = response.json()

        for article in data.get('articles', []):
            topic = {
                'platform': 'GNews',
                'title': article.get('title', ''),
                'description': article.get('description', ''),
                'url': article.get('url', ''),
                'score': 100,
                'engagement': 100,
                'category': article.get('source', {}).get('name', 'News'),
                'topic': 'news',
                'tags': ['news', 'headlines', 'breaking'],
                'author': article.get('source', {}).get('name', 'Unknown'),
                'timestamp': article.get('publishedAt', datetime.now().isoformat())
            }
            trending_topics.append(topic)

        return trending_topics

    except Exception as e:
        print(f"❌ Error fetching GNews: {e}")
        return []
```

### 4. Dev.to API (No Setup Required)

```python
import requests
from datetime import datetime

def fetch_devto_trending():
    """Fetch trending articles from Dev.to"""
    trending_topics = []

    try:
        # Get trending articles
        url = "https://dev.to/api/articles"
        params = {
            'top': '1',  # Get top articles
            'per_page': 50
        }

        response = requests.get(url, params=params)
        articles = response.json()

        for article in articles:
            topic = {
                'platform': 'Dev.to',
                'title': article.get('title', ''),
                'description': article.get('description', ''),
                'url': article.get('url', ''),
                'score': article.get('public_reactions_count', 0),
                'engagement': article.get('public_reactions_count', 0) + article.get('comments_count', 0),
                'category': 'Programming',
                'topic': 'programming',
                'tags': ['programming', 'development', 'tech'] + article.get('tag_list', []),
                'author': article.get('user', {}).get('name', 'Unknown'),
                'timestamp': article.get('published_at', datetime.now().isoformat())
            }
            trending_topics.append(topic)

        return trending_topics

    except Exception as e:
        print(f"❌ Error fetching Dev.to: {e}")
        return []
```

### 5. Product Hunt API (Simple Setup)

```python
import os
import requests
from datetime import datetime

def fetch_producthunt_trending():
    """Fetch trending products from Product Hunt"""
    trending_topics = []

    api_key = os.getenv('PRODUCTHUNT_API_KEY')
    if not api_key:
        print("❌ Product Hunt API key not found")
        return []

    try:
        # Get today's top products
        url = "https://api.producthunt.com/v2/api/graphql"
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

        query = """
        {
          posts(first: 20, order: VOTES) {
            edges {
              node {
                id
                name
                tagline
                url
                votesCount
                commentsCount
                user {
                  name
                }
                topics {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
        """

        response = requests.post(url, json={'query': query}, headers=headers)
        data = response.json()

        for edge in data.get('data', {}).get('posts', {}).get('edges', []):
            product = edge.get('node', {})
            topics = [topic['node']['name'] for topic in product.get('topics', {}).get('edges', [])]

            topic = {
                'platform': 'Product Hunt',
                'title': product.get('name', ''),
                'description': product.get('tagline', ''),
                'url': product.get('url', ''),
                'score': product.get('votesCount', 0),
                'engagement': product.get('votesCount', 0) + product.get('commentsCount', 0),
                'category': 'Product',
                'topic': 'startup',
                'tags': ['product', 'startup', 'innovation'] + topics,
                'author': product.get('user', {}).get('name', 'Unknown'),
                'timestamp': datetime.now().isoformat()
            }
            trending_topics.append(topic)

        return trending_topics

    except Exception as e:
        print(f"❌ Error fetching Product Hunt: {e}")
        return []
```

### 6. Twitter/X API (Advanced Setup)

```python
import os
import tweepy
from datetime import datetime

def init_twitter():
    """Initialize Twitter API client"""
    try:
        api_key = os.getenv('TWITTER_API_KEY')
        api_secret = os.getenv('TWITTER_API_SECRET')
        access_token = os.getenv('TWITTER_ACCESS_TOKEN')
        access_token_secret = os.getenv('TWITTER_ACCESS_TOKEN_SECRET')

        if not all([api_key, api_secret, access_token, access_token_secret]):
            print("❌ Twitter API credentials not found")
            return None

        auth = tweepy.OAuthHandler(api_key, api_secret)
        auth.set_access_token(access_token, access_token_secret)
        api = tweepy.API(auth, wait_on_rate_limit=True)

        return api

    except Exception as e:
        print(f"❌ Error initializing Twitter API: {e}")
        return None

def fetch_twitter_trending():
    """Fetch trending topics from Twitter"""
    trending_topics = []

    api = init_twitter()
    if not api:
        return []

    try:
        # Get trending topics (worldwide)
        trends = api.get_place_trends(1)  # 1 = worldwide

        for trend in trends[0]['trends'][:20]:
            topic = {
                'platform': 'Twitter',
                'title': trend['name'],
                'description': f"Trending on Twitter with {trend['tweet_volume']} tweets" if trend['tweet_volume'] else "Trending on Twitter",
                'url': trend['url'],
                'score': trend['tweet_volume'] or 0,
                'engagement': trend['tweet_volume'] or 0,
                'category': 'Social Media',
                'topic': 'social',
                'tags': ['twitter', 'trending', 'social'],
                'author': 'Twitter',
                'timestamp': datetime.now().isoformat()
            }
            trending_topics.append(topic)

        return trending_topics

    except Exception as e:
        print(f"❌ Error fetching Twitter trending: {e}")
        return []
```

### 7. Telegram API (Medium Setup)

```python
import os
import asyncio
from telegram import Bot
from datetime import datetime

def fetch_telegram_trending():
    """Fetch trending content from Telegram channels"""
    trending_topics = []

    bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
    channels = os.getenv('TELEGRAM_CHANNELS', '').split(',')

    if not bot_token:
        print("❌ Telegram bot token not found")
        return []

    try:
        bot = Bot(token=bot_token)

        for channel in channels:
            if not channel.strip():
                continue

            try:
                # Get recent messages from channel
                messages = bot.get_updates(limit=10)

                for message in messages:
                    if message.channel_post:
                        post = message.channel_post
                        topic = {
                            'platform': 'Telegram',
                            'title': post.text[:100] if post.text else 'Media Post',
                            'description': post.text[100:300] if post.text and len(post.text) > 100 else '',
                            'url': f"https://t.me/{channel}/{post.message_id}",
                            'score': post.forward_count or 0,
                            'engagement': (post.forward_count or 0) + (post.reply_count or 0),
                            'category': 'Social Media',
                            'topic': 'social',
                            'tags': ['telegram', 'social', 'messaging'],
                            'author': channel,
                            'timestamp': post.date.isoformat() if post.date else datetime.now().isoformat()
                        }
                        trending_topics.append(topic)

            except Exception as e:
                print(f"❌ Error fetching from Telegram channel {channel}: {e}")
                continue

        return trending_topics

    except Exception as e:
        print(f"❌ Error fetching Telegram trending: {e}")
        return []
```

---

## Integration into Your App

### 1. Add New Fetch Functions to app.py

```python
# Add these imports at the top of app.py
import requests
import tweepy
from telegram import Bot

# Add new fetch functions
def fetch_hackernews_trending():
    # Implementation from above
    pass

def fetch_coingecko_trending():
    # Implementation from above
    pass

def fetch_gnews_trending():
    # Implementation from above
    pass

# Add more fetch functions as needed...

# Update the main fetch function
def update_database_with_fresh_data():
    """Background task to fetch fresh data from APIs and update database"""
    print("🔄 Starting scheduled database update...")

    try:
        fresh_data = []

        # Existing platforms
        if reddit_client:
            fresh_data.extend(fetch_reddit_trending())

        if news_client:
            fresh_data.extend(fetch_news_trending())

        if youtube_client:
            fresh_data.extend(fetch_youtube_trending())

        # New platforms
        fresh_data.extend(fetch_hackernews_trending())
        fresh_data.extend(fetch_coingecko_trending())
        fresh_data.extend(fetch_gnews_trending())
        fresh_data.extend(fetch_devto_trending())
        fresh_data.extend(fetch_producthunt_trending())

        # Save all fresh data
        for topic in fresh_data:
            save_trending_topic(**topic)

        print(f"✅ Updated database with {len(fresh_data)} new topics")

    except Exception as e:
        print(f"❌ Error updating database: {e}")
```

### 2. Update Frontend Platform Filter

```typescript
// Update frontend/components/PlatformFilter.tsx
const platforms = [
  { key: 'Reddit', label: 'Reddit', icon: '🔴' },
  { key: 'YouTube', label: 'YouTube', icon: '📺' },
  { key: 'News', label: 'News', icon: '📰' },
  { key: 'Hacker News', label: 'Hacker News', icon: '💻' },
  { key: 'CoinGecko', label: 'CoinGecko', icon: '₿' },
  { key: 'Dev.to', label: 'Dev.to', icon: '👨‍💻' },
  { key: 'Product Hunt', label: 'Product Hunt', icon: '🚀' },
  { key: 'GNews', label: 'GNews', icon: '📡' },
  { key: 'Twitter', label: 'Twitter', icon: '🐦' },
  { key: 'Telegram', label: 'Telegram', icon: '📱' },
  { key: 'Instagram', label: 'Instagram', icon: '📸' },
  { key: 'Facebook', label: 'Facebook', icon: '📘' },
]
```

### 3. Add New API Routes

```python
# Add these routes to app.py

@app.route('/api/trending/hackernews', methods=['GET'])
def get_hackernews_trending():
    """Get trending topics from Hacker News"""
    try:
        topics = fetch_hackernews_trending()
        return jsonify({
            'success': True,
            'platform': 'Hacker News',
            'topics': topics,
            'count': len(topics)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/trending/coingecko', methods=['GET'])
def get_coingecko_trending():
    """Get trending cryptocurrencies from CoinGecko"""
    try:
        topics = fetch_coingecko_trending()
        return jsonify({
            'success': True,
            'platform': 'CoinGecko',
            'topics': topics,
            'count': len(topics)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Add more platform-specific routes as needed...
```

---

## Testing Your Implementations

### 1. Test Individual APIs

```python
# Create a test script: test_apis.py
import os
from dotenv import load_dotenv

load_dotenv()

def test_api(api_name, fetch_function):
    print(f"🧪 Testing {api_name}...")
    try:
        results = fetch_function()
        print(f"✅ {api_name}: {len(results)} results")
        if results:
            print(f"   Sample: {results[0]['title'][:50]}...")
        return True
    except Exception as e:
        print(f"❌ {api_name}: {e}")
        return False

# Test each API
test_api("Hacker News", fetch_hackernews_trending)
test_api("CoinGecko", fetch_coingecko_trending)
test_api("GNews", fetch_gnews_trending)
test_api("Dev.to", fetch_devto_trending)
```

### 2. Monitor Rate Limits

```python
import time
from functools import wraps

def rate_limit(max_calls, time_window):
    """Decorator to implement rate limiting"""
    def decorator(func):
        calls = []

        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()
            calls[:] = [call for call in calls if now - call < time_window]

            if len(calls) >= max_calls:
                sleep_time = time_window - (now - calls[0])
                if sleep_time > 0:
                    time.sleep(sleep_time)

            calls.append(now)
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Use the decorator
@rate_limit(max_calls=50, time_window=60)  # 50 calls per minute
def fetch_coingecko_trending():
    # Implementation...
    pass
```

---

## Production Considerations

### 1. Error Handling

```python
def safe_fetch(fetch_function, platform_name):
    """Safely execute fetch functions with error handling"""
    try:
        return fetch_function()
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error fetching {platform_name}: {e}")
        return []
    except Exception as e:
        print(f"❌ Unexpected error fetching {platform_name}: {e}")
        return []
```

### 2. Caching

```python
from cache_manager import cache_manager

def fetch_with_cache(fetch_function, cache_key, ttl_minutes=15):
    """Fetch data with caching"""
    cached_data = cache_manager.get_cached_data(cache_key)
    if cached_data:
        return cached_data

    fresh_data = fetch_function()
    cache_manager.set_cached_data(cache_key, fresh_data, ttl_minutes)
    return fresh_data
```

### 3. Monitoring

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log_api_usage(platform, success, response_time):
    """Log API usage for monitoring"""
    logger.info(f"API Usage - Platform: {platform}, Success: {success}, Time: {response_time}ms")
```

This implementation guide provides you with everything you need to add new platforms to your viral trending topics app. Start with the easy APIs and gradually add more complex ones as you become comfortable with the implementation patterns.
