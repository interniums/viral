from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
import threading
import sqlite3
from datetime import datetime, timedelta
import praw
from dotenv import load_dotenv

from cache_manager import cache_manager, CACHE_KEYS
from youtube_api import init_youtube
from google_trends_api import init_google_trends, fetch_google_trends_trending
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

# Load environment variables
load_dotenv()

# Constants
MAX_TOPICS_PER_PLATFORM = 200
MAX_DESCRIPTION_LENGTH = 200
MAX_TOTAL_TOPICS = 500
MAX_DATABASE_FETCH = 1000
ENGAGEMENT_SCORE_DIVISOR = 1000
DATABASE_RETENTION_DAYS = 7
FLASK_PORT = 5000
FLASK_HOST = '0.0.0.0'

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'default-secret-key')
CORS(app)

# Database setup
def init_db():
    conn = sqlite3.connect('viral_trends.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS trending_topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            url TEXT,
            score INTEGER DEFAULT 0,
            engagement INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            category TEXT,
            tags TEXT,
            topic TEXT,
            author TEXT,
            UNIQUE(platform, title, url)
        )
    ''')
    
    # Add topic column if it doesn't exist (for existing databases)
    try:
        cursor.execute('ALTER TABLE trending_topics ADD COLUMN topic TEXT')
    except:
        pass  # Column already exists
    
    # Add author column if it doesn't exist (for existing databases)
    try:
        cursor.execute('ALTER TABLE trending_topics ADD COLUMN author TEXT')
    except:
        pass  # Column already exists
    
    # Add unique constraint if it doesn't exist (for existing databases)
    try:
        cursor.execute('CREATE UNIQUE INDEX IF NOT EXISTS idx_platform_title_url ON trending_topics(platform, title, url)')
    except:
        pass  # Index already exists
    
    conn.commit()
    conn.close()

def cleanup_database_duplicates():
    """Remove existing duplicates from the database"""
    conn = sqlite3.connect('viral_trends.db')
    cursor = conn.cursor()
    
    try:
        print("🧹 Cleaning up database duplicates...")
        
        # Get total count before cleanup
        cursor.execute('SELECT COUNT(*) FROM trending_topics')
        total_before = cursor.fetchone()[0]
        print(f"📊 Total records before cleanup: {total_before}")
        
        # Remove duplicates keeping the one with highest engagement
        cursor.execute('''
            DELETE FROM trending_topics 
            WHERE id NOT IN (
                SELECT MIN(id) 
                FROM trending_topics 
                GROUP BY platform, title, url
            )
        ''')
        
        # Get total count after cleanup
        cursor.execute('SELECT COUNT(*) FROM trending_topics')
        total_after = cursor.fetchone()[0]
        
        removed_count = total_before - total_after
        print(f"📊 Total records after cleanup: {total_after}")
        print(f"🗑️ Removed {removed_count} duplicate records")
        
        conn.commit()
        
    except Exception as e:
        print(f"❌ Error cleaning up duplicates: {e}")
        conn.rollback()
    finally:
        conn.close()

# Initialize Reddit API
def init_reddit():
    try:
        reddit = praw.Reddit(
            client_id=os.getenv('REDDIT_CLIENT_ID'),
            client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
            user_agent=os.getenv('REDDIT_USER_AGENT', 'viral_trending_bot/1.0')
        )
        return reddit
    except Exception as e:
        print(f"Reddit API initialization failed: {e}")
        return None

# Initialize Twitter API
# Twitter API disabled - removed dead code



# Initialize YouTube API
def init_youtube():
    try:
        api_key = os.getenv('YOUTUBE_API_KEY')
        if not api_key:
            print("YouTube API key not found")
            return None
        
        # Use the imported init_youtube function from youtube_api module
        from youtube_api import init_youtube as youtube_init
        return youtube_init()
    except Exception as e:
        print(f"YouTube API initialization failed: {e}")
        return None

# Global variables for API clients
reddit_client = init_reddit()
youtube_client = init_youtube()
google_trends_client = init_google_trends()

def detect_topic_category(platform, title):
    """Detect topic category based on platform and title"""
    platform_lower = platform.lower()
    title_lower = title.lower()
    
    # Crypto topics
    crypto_keywords = ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'defi', 'nft', 'token', 'coin']
    if any(keyword in platform_lower for keyword in crypto_keywords) or any(keyword in title_lower for keyword in crypto_keywords):
        return 'crypto'
    
    # Sports topics
    sports_keywords = ['sports', 'nba', 'nfl', 'soccer', 'tennis', 'formula1', 'football', 'basketball', 'baseball']
    if any(keyword in platform_lower for keyword in sports_keywords) or any(keyword in title_lower for keyword in sports_keywords):
        return 'sports'
    
    # Finance topics
    finance_keywords = ['finance', 'investing', 'stocks', 'wallstreet', 'economy', 'market', 'trading']
    if any(keyword in platform_lower for keyword in finance_keywords) or any(keyword in title_lower for keyword in finance_keywords):
        return 'finance'
    
    # Culture topics
    culture_keywords = ['movies', 'music', 'art', 'books', 'television', 'fashion', 'culture', 'photography']
    if any(keyword in platform_lower for keyword in culture_keywords) or any(keyword in title_lower for keyword in culture_keywords):
        return 'culture'
    
    # Memes & Humor topics
    meme_keywords = ['memes', 'funny', 'humor', 'jokes', 'dank', 'viral']
    if any(keyword in platform_lower for keyword in meme_keywords) or any(keyword in title_lower for keyword in meme_keywords):
        return 'memes'
    
    # Gaming topics
    gaming_keywords = ['gaming', 'game', 'esports', 'pcgaming', 'xbox', 'playstation', 'nintendo']
    if any(keyword in platform_lower for keyword in gaming_keywords) or any(keyword in title_lower for keyword in gaming_keywords):
        return 'gaming'
    
    # Technology topics
    tech_keywords = ['technology', 'tech', 'science', 'innovation', 'ai', 'machine learning']
    if any(keyword in platform_lower for keyword in tech_keywords) or any(keyword in title_lower for keyword in tech_keywords):
        return 'technology'
    
    # Politics topics
    politics_keywords = ['politics', 'worldnews', 'government', 'election']
    if any(keyword in platform_lower for keyword in politics_keywords) or any(keyword in title_lower for keyword in politics_keywords):
        return 'politics'
    
    # Lifestyle topics
    lifestyle_keywords = ['food', 'cooking', 'travel', 'health', 'fitness', 'lifestyle']
    if any(keyword in platform_lower for keyword in lifestyle_keywords) or any(keyword in title_lower for keyword in lifestyle_keywords):
        return 'lifestyle'
    
    return 'general'

def save_trending_topic(platform, title, description, url, score, engagement, category, tags, topic=None, author=None, timestamp=None):
    """Save a trending topic to the database"""
    if not timestamp:
        timestamp = datetime.now().isoformat()
    if not topic:
        topic = 'general'
    if not author:
        author = 'Unknown'
    
    conn = sqlite3.connect('viral_trends.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT OR REPLACE INTO trending_topics 
        (platform, title, description, url, score, engagement, category, tags, topic, author, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (platform, title, description, url, score, engagement, category, json.dumps(tags), topic, author, timestamp))
    
    conn.commit()
    conn.close()

def fetch_reddit_trending():
    """Fetch trending topics from Reddit with fallback to database"""
    trending_topics = []
    seen_titles = set()  # Track seen titles to avoid duplicates
    
    # Try to fetch from Reddit API first
    if reddit_client:
        try:
            print("🔴 Fetching from Reddit API...")
            # Get trending posts from multiple subreddits
            subreddits = [
                'trending', 'popular', 'all', 'technology', 'science',
                'sports', 'gaming', 'movies', 'music', 'books', 'food',
                'cryptocurrency', 'wallstreetbets', 'investing', 'personalfinance'
            ]
            
            for subreddit in subreddits:
                try:
                    subreddit_posts = reddit_client.subreddit(subreddit).hot(limit=20)
                    for post in subreddit_posts:
                        # Avoid duplicates
                        if post.title not in seen_titles:
                            # Detect topic based on subreddit and title
                            topic_category = detect_topic_category(subreddit, post.title)
                            
                            topic = {
                                'platform': 'Reddit',
                                'title': post.title,
                                'description': post.selftext[:200] if post.selftext else f"Reddit post from r/{subreddit}",
                                'url': f"https://reddit.com{post.permalink}",
                                'score': post.score,
                                'engagement': post.score + (post.num_comments * 2),
                                'category': f"r/{subreddit}",
                                'topic': topic_category,
                                'tags': ['reddit', subreddit, topic_category],
                                'author': post.author.name if post.author else 'Anonymous',
                                'timestamp': datetime.fromtimestamp(post.created_utc).isoformat()
                            }
                            trending_topics.append(topic)
                            seen_titles.add(post.title)
                            
                            if len(trending_topics) >= MAX_TOPICS_PER_PLATFORM:  # Limit to 200 Reddit posts
                                break
                                
                except Exception as e:
                    print(f"Error fetching from r/{subreddit}: {e}")
                    continue
                    
                if len(trending_topics) >= MAX_TOPICS_PER_PLATFORM:
                    break
                    
            print(f"✅ Fetched {len(trending_topics)} unique Reddit posts from API")
            
        except Exception as e:
            print(f"❌ Reddit API failed: {e}")
            print("🔄 Falling back to database...")
    
    # If API failed or we need more data, get from database
    if len(trending_topics) < MAX_TOPICS_PER_PLATFORM:
        try:
            print("📦 Fetching Reddit data from database...")
            conn = sqlite3.connect('viral_trends.db')
            cursor = conn.cursor()
            
            # Get recent Reddit posts from database (last DATABASE_RETENTION_DAYS days)
            week_ago = datetime.now() - timedelta(days=DATABASE_RETENTION_DAYS)
            cursor.execute('''
                SELECT title, description, url, score, engagement, category, tags, timestamp, topic, author
                FROM trending_topics
                WHERE platform = 'Reddit' AND timestamp > ?
                ORDER BY engagement DESC
                LIMIT ?
            ''', (week_ago, MAX_TOPICS_PER_PLATFORM - len(trending_topics)))
            
            db_posts = cursor.fetchall()
            conn.close()
            
            for post in db_posts:
                # Avoid duplicates
                if post[0] not in seen_titles:
                    topic = {
                        'platform': 'Reddit',
                        'title': post[0],
                        'description': post[1] or '',
                        'url': post[2],
                        'score': post[3],
                        'engagement': post[4],
                        'category': post[5],
                        'tags': json.loads(post[6]) if post[6] else [],
                        'topic': post[8] or 'general',
                        'author': post[9] if len(post) > 9 else 'Anonymous',
                        'timestamp': post[7]
                    }
                    trending_topics.append(topic)
                    seen_titles.add(post[0])
                    
                    if len(trending_topics) >= MAX_TOPICS_PER_PLATFORM:
                        break
                        
            print(f"📦 Added {len(db_posts)} Reddit posts from database")
            
        except Exception as e:
            print(f"❌ Database fallback failed: {e}")
    
    print(f"📊 Total unique Reddit posts: {len(trending_topics)}")
    return trending_topics

# Twitter API disabled - removed dead code



def fetch_youtube_trending():
    """Fetch trending topics from YouTube with fallback to database"""
    trending_topics = []
    seen_titles = set()  # Track seen titles to avoid duplicates
    
    # Try to fetch from YouTube API first
    if youtube_client:
        try:
            print("📺 Fetching from YouTube API...")
            # Get trending videos from multiple regions
            regions = ['US', 'GB', 'CA', 'AU']
            
            for region in regions:
                try:
                    # Get trending videos from each region
                    request = youtube_client.videos().list(
                        part='snippet,statistics',
                        chart='mostPopular',
                        regionCode=region,
                        maxResults=50,
                        videoCategoryId='0'  # All categories
                    )
                    
                    response = request.execute()
                    
                    for video in response.get('items', []):
                        # Avoid duplicates
                        if video['snippet']['title'] not in seen_titles:
                            snippet = video['snippet']
                            statistics = video.get('statistics', {})
                            
                            # Calculate engagement score
                            view_count = int(statistics.get('viewCount', 0))
                            like_count = int(statistics.get('likeCount', 0))
                            comment_count = int(statistics.get('commentCount', 0))
                            engagement = view_count + (like_count * 10) + (comment_count * 50)
                            
                            # Detect topic based on title and description
                            video_text = f"{snippet['title']} {snippet.get('description', '')}"
                            topic_category = detect_topic_category('youtube', video_text)
                            
                            video_tags = ['youtube', 'video', 'trending', region.lower()]
                            
                            topic = {
                                'platform': 'YouTube',
                                'title': snippet['title'],
                                'description': snippet['description'][:MAX_DESCRIPTION_LENGTH] if snippet['description'] else 'Trending video on YouTube',
                                'url': f"https://www.youtube.com/watch?v={video['id']}",
                                'score': engagement // ENGAGEMENT_SCORE_DIVISOR,
                                'engagement': engagement,
                                'category': snippet.get('categoryId', 'Video'),
                                'topic': topic_category,
                                'tags': video_tags,
                                'author': snippet.get('channelTitle', 'Unknown Channel'),
                                'timestamp': snippet['publishedAt']
                            }
                            trending_topics.append(topic)
                            seen_titles.add(snippet['title'])
                            
                            if len(trending_topics) >= MAX_TOPICS_PER_PLATFORM:  # Limit to 200 YouTube videos
                                break
                                
                except Exception as e:
                    print(f"Error fetching from YouTube region {region}: {e}")
                    continue
                    
                if len(trending_topics) >= MAX_TOPICS_PER_PLATFORM:
                    break
                    
            print(f"✅ Fetched {len(trending_topics)} unique YouTube videos from API")
            
        except Exception as e:
            print(f"❌ YouTube API failed: {e}")
            print("🔄 Falling back to database...")
    
    # If API failed or we need more data, get from database
    if len(trending_topics) < MAX_TOPICS_PER_PLATFORM:
        try:
            print("📦 Fetching YouTube data from database...")
            conn = sqlite3.connect('viral_trends.db')
            cursor = conn.cursor()
            
            # Get recent YouTube videos from database (last DATABASE_RETENTION_DAYS days)
            week_ago = datetime.now() - timedelta(days=DATABASE_RETENTION_DAYS)
            cursor.execute('''
                SELECT title, description, url, score, engagement, category, tags, timestamp, topic, author
                FROM trending_topics
                WHERE platform = 'YouTube' AND timestamp > ?
                ORDER BY RANDOM()
                LIMIT ?
            ''', (week_ago, MAX_TOPICS_PER_PLATFORM - len(trending_topics)))
            
            db_videos = cursor.fetchall()
            conn.close()
            
            for video in db_videos:
                # Avoid duplicates
                if video[0] not in seen_titles:
                    topic = {
                        'platform': 'YouTube',
                        'title': video[0],
                        'description': video[1] or '',
                        'url': video[2],
                        'score': video[3],
                        'engagement': video[4],
                        'category': video[5],
                        'tags': json.loads(video[6]) if video[6] else [],
                        'topic': video[8] or 'general',
                        'author': video[9] if len(video) > 9 else 'Unknown Channel',
                        'timestamp': video[7]
                    }
                    trending_topics.append(topic)
                    seen_titles.add(video[0])
                    
                    if len(trending_topics) >= MAX_TOPICS_PER_PLATFORM:
                        break
                        
            print(f"📦 Added {len(db_videos)} YouTube videos from database")
            
        except Exception as e:
            print(f"❌ Database fallback failed: {e}")
    
    print(f"📊 Total unique YouTube videos: {len(trending_topics)}")
    return trending_topics

def update_database_with_fresh_data():
    """Background task to fetch fresh data from APIs and update database"""
    print("🔄 Starting scheduled database update...")
    
    try:
        # Fetch fresh data from all platforms
        fresh_data = []
        
        # 1. Fetch fresh Reddit data
        print("🔴 Fetching fresh Reddit data...")
        if reddit_client:
            try:
                subreddits = ['trending', 'popular', 'all', 'technology']
                seen_titles = set()
                
                for subreddit in subreddits:
                    try:
                        subreddit_posts = reddit_client.subreddit(subreddit).hot(limit=10)
                        for post in subreddit_posts:
                            if post.title not in seen_titles:
                                topic_category = detect_topic_category(subreddit, post.title)
                                topic = {
                                    'platform': 'Reddit',
                                    'title': post.title,
                                    'description': post.selftext[:200] if post.selftext else f"Reddit post from r/{subreddit}",
                                    'url': f"https://reddit.com{post.permalink}",
                                    'score': post.score,
                                    'engagement': post.score + (post.num_comments * 2),
                                    'category': f"r/{subreddit}",
                                    'topic': topic_category,
                                    'tags': ['reddit', subreddit, topic_category],
                                    'author': post.author.name if post.author else 'Anonymous',
                                    'timestamp': datetime.fromtimestamp(post.created_utc).isoformat()
                                }
                                fresh_data.append(topic)
                                seen_titles.add(post.title)
                                
                                if len(fresh_data) >= 50:  # Limit fresh Reddit data
                                    break
                    except Exception as e:
                        print(f"Error fetching from r/{subreddit}: {e}")
                        continue
                        
                print(f"🔴 Fetched {len([d for d in fresh_data if d['platform'] == 'Reddit'])} fresh Reddit posts")
                
            except Exception as e:
                print(f"❌ Reddit API failed in background task: {e}")
        
        # 2. Fetch fresh Google Trends data
        print("🔥 Fetching fresh Google Trends data...")
        if google_trends_client:
            try:
                google_trends_data = fetch_google_trends_trending()
                fresh_data.extend(google_trends_data)
                print(f"🔥 Fetched {len(google_trends_data)} fresh Google Trends topics")
            except Exception as e:
                print(f"❌ Google Trends API failed in background task: {e}")
        
        # 3. Fetch fresh YouTube data
        print("📺 Fetching fresh YouTube data...")
        if youtube_client:
            try:
                # Get trending videos from US region
                request = youtube_client.videos().list(
                    part='snippet,statistics',
                    chart='mostPopular',
                    regionCode='US',
                    maxResults=20,
                    videoCategoryId='0'
                )
                
                response = request.execute()
                
                for video in response.get('items', []):
                    snippet = video['snippet']
                    statistics = video.get('statistics', {})
                    
                    view_count = int(statistics.get('viewCount', 0))
                    like_count = int(statistics.get('likeCount', 0))
                    comment_count = int(statistics.get('commentCount', 0))
                    engagement = view_count + (like_count * 10) + (comment_count * 50)
                    
                    video_tags = ['youtube', 'video', 'trending', 'us']
                    detected_topic = detect_topic_category('youtube', f"{snippet['title']} {snippet.get('description', '')}")
                    
                    topic = {
                        'platform': 'YouTube',
                        'title': snippet['title'],
                        'description': snippet['description'][:200] if snippet['description'] else 'Trending video on YouTube',
                        'url': f"https://www.youtube.com/watch?v={video['id']}",
                        'score': engagement // 1000,
                        'engagement': engagement,
                        'category': snippet.get('categoryId', 'Video'),
                        'tags': video_tags,
                        'topic': detected_topic,
                        'author': snippet.get('channelTitle', 'Unknown Channel'),
                        'timestamp': snippet['publishedAt']
                    }
                    fresh_data.append(topic)
                    
                print(f"📺 Fetched {len([d for d in fresh_data if d['platform'] == 'YouTube'])} fresh YouTube videos")
                
            except Exception as e:
                print(f"❌ YouTube API failed in background task: {e}")
        
        # 4. Fetch fresh Instagram data
        print("📸 Fetching fresh Instagram data...")
        try:
            instagram_data = fetch_instagram_trending()
            fresh_data.extend(instagram_data)
            print(f"📸 Fetched {len(instagram_data)} fresh Instagram posts")
        except Exception as e:
            print(f"❌ Instagram API failed in background task: {e}")
        
        # 5. Fetch fresh Facebook data
        print("📘 Fetching fresh Facebook data...")
        try:
            facebook_data = fetch_facebook_trending()
            fresh_data.extend(facebook_data)
            print(f"📘 Fetched {len(facebook_data)} fresh Facebook posts")
        except Exception as e:
            print(f"❌ Facebook API failed in background task: {e}")
        
        # 6. Fetch fresh Telegram data
        print("📱 Fetching fresh Telegram data...")
        try:
            telegram_data = fetch_telegram_trending()
            fresh_data.extend(telegram_data)
            print(f"📱 Fetched {len(telegram_data)} fresh Telegram posts")
        except Exception as e:
            print(f"❌ Telegram API failed in background task: {e}")
        
        # 4. Update database with fresh data
        if fresh_data:
            print(f"💾 Updating database with {len(fresh_data)} fresh items...")
            conn = sqlite3.connect('viral_trends.db')
            cursor = conn.cursor()
            
            # Remove old data (older than DATABASE_RETENTION_DAYS days) to keep database fresh
            week_ago = datetime.now() - timedelta(days=DATABASE_RETENTION_DAYS)
            cursor.execute('DELETE FROM trending_topics WHERE timestamp < ?', (week_ago,))
            deleted_count = cursor.rowcount
            print(f"🗑️ Removed {deleted_count} old items from database")
            
            # Insert fresh data
            for topic in fresh_data:
                try:
                    cursor.execute('''
                        INSERT OR REPLACE INTO trending_topics 
                        (platform, title, description, url, score, engagement, category, tags, timestamp, topic, author)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        topic['platform'],
                        topic['title'],
                        topic['description'],
                        topic['url'],
                        topic['score'],
                        topic['engagement'],
                        topic['category'],
                        json.dumps(topic['tags']),
                        topic['timestamp'],
                        topic['topic'],
                        topic.get('author', 'Unknown')
                    ))
                except Exception as e:
                    print(f"Error inserting topic {topic['title']}: {e}")
                    continue
            
            conn.commit()
            conn.close()
            
            # Update global last update time
            global last_db_update
            last_db_update = datetime.now().isoformat()
            
            # Clear cache to force fresh data on next request
            cache_manager.clear_cache()
            print("🧹 Cache cleared for fresh data")
            
            print(f"✅ Database updated successfully with {len(fresh_data)} fresh items")
            print(f"🕒 Last database update: {last_db_update}")
        else:
            print("⚠️ No fresh data fetched - keeping existing database")
            
    except Exception as e:
        print(f"❌ Background update failed: {e}")

# Schedule the background task to run every 15 minutes
scheduler = BackgroundScheduler()
scheduler.add_job(
    func=update_database_with_fresh_data,
    trigger=IntervalTrigger(minutes=15),
    id='update_database',
    name='Update database with fresh API data',
    replace_existing=True
)
scheduler.start()
print("⏰ Background scheduler started - database will update every 15 minutes")

# Global variable to track last database update
last_db_update = None

# API Routes
@app.route('/api/trending', methods=['GET'])
def get_trending():
    """Get current trending topics with caching and sorting"""
    try:
        # Get sorting parameters from query string
        sort_by = request.args.get('sort', 'random')  # random, engagement, date
        sort_order = request.args.get('order', 'desc')  # asc, desc
        
        # Check cache first
        cached_data = cache_manager.get_cached_data(CACHE_KEYS['trending_topics'])
        if cached_data:
            cache_info = cache_manager.get_cache_info(CACHE_KEYS['trending_topics'])
            print(f"📦 Serving {len(cached_data['topics'])} topics from cache")
            
            # Apply sorting to cached data
            topics = cached_data['topics'].copy()
            if sort_by == 'engagement':
                topics.sort(key=lambda x: x['engagement'], reverse=(sort_order == 'desc'))
            elif sort_by == 'date':
                topics.sort(key=lambda x: x['timestamp'], reverse=(sort_order == 'desc'))
            # If sort_by is 'random', keep the random order from cache
            
            return jsonify({
                'success': True,
                'topics': topics,
                'count': len(topics),
                'timestamp': cached_data['timestamp'],
                'cached': True,
                'cache_ttl_minutes': cache_info['ttl_minutes'],
                'sort_by': sort_by,
                'sort_order': sort_order
            })
        
        # If no cache, fetch from database
        conn = sqlite3.connect('viral_trends.db')
        cursor = conn.cursor()
        
        # Get topics from last DATABASE_RETENTION_DAYS days with balanced platform distribution
        week_ago = datetime.now() - timedelta(days=DATABASE_RETENTION_DAYS)
        
        # Get top topics from each platform separately to ensure balanced distribution
        all_topics = []
        seen_titles = set()  # Track seen titles to avoid duplicates
        
        # Get top MAX_DATABASE_FETCH from each platform to ensure we have enough data
        for platform in ['Reddit', 'YouTube', 'Google Trends']:
            cursor.execute('''
                SELECT platform, title, description, url, score, engagement, category, tags, timestamp, topic, author
                FROM trending_topics
                WHERE platform = ? AND timestamp > ?
                ORDER BY RANDOM()
                LIMIT ?
            ''', (platform, week_ago, MAX_DATABASE_FETCH))
            
            platform_topics = []
            for row in cursor.fetchall():
                # Avoid duplicates by title
                if row[1] not in seen_titles:
                    topic = {
                        'platform': row[0],
                        'title': row[1],
                        'description': row[2],
                        'url': row[3],
                        'score': row[4],
                        'engagement': row[5],
                        'category': row[6],      # Fixed: was row[7]
                        'tags': json.loads(row[7]) if row[7] else [],  # Fixed: was row[8]
                        'timestamp': row[8],     # Fixed: was row[9]
                        'topic': row[9] or 'general',  # Fixed: was row[10]
                        'author': row[10] if len(row) > 10 else 'Unknown'  # Fixed: was row[11]
                    }
                    platform_topics.append(topic)
                    seen_titles.add(row[1])
            
            all_topics.extend(platform_topics)
            print(f"Added {len(platform_topics)} unique {platform} topics")
        
        # Apply sorting based on parameters
        if sort_by == 'engagement':
            all_topics.sort(key=lambda x: x['engagement'], reverse=(sort_order == 'desc'))
        elif sort_by == 'date':
            all_topics.sort(key=lambda x: x['timestamp'], reverse=(sort_order == 'desc'))
        else:  # random
            random.shuffle(all_topics)
        
        # Limit to top MAX_TOTAL_TOPICS for performance
        topics = all_topics[:MAX_TOTAL_TOPICS]
        
        conn.close()
        
        # Cache the results (always cache with random order for future use)
        cache_data = {
            'topics': all_topics[:MAX_TOTAL_TOPICS],  # Cache with random order
            'timestamp': datetime.now().isoformat()
        }
        cache_manager.set_cached_data(CACHE_KEYS['trending_topics'], cache_data)
        
        return jsonify({
            'success': True,
            'topics': topics,
            'count': len(topics),
            'timestamp': cache_data['timestamp'],
            'cached': False,
            'sort_by': sort_by,
            'sort_order': sort_order
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/trending/<platform>', methods=['GET'])
def get_platform_trending(platform):
    """Get trending topics from specific platform with sorting"""
    try:
        # Get sorting parameters from query string
        sort_by = request.args.get('sort', 'random')  # random, engagement, date
        sort_order = request.args.get('order', 'desc')  # asc, desc
        
        conn = sqlite3.connect('viral_trends.db')
        cursor = conn.cursor()
        
        # Debug: Check total count for platform
        cursor.execute('SELECT COUNT(*) FROM trending_topics WHERE platform = ?', (platform,))
        total_count = cursor.fetchone()[0]
        print(f"🔍 Debug: Total {platform} topics in DB: {total_count}")
        
        # Build SQL query based on sorting parameters
        if sort_by == 'engagement':
            order_clause = 'ORDER BY engagement DESC' if sort_order == 'desc' else 'ORDER BY engagement ASC'
        elif sort_by == 'date':
            order_clause = 'ORDER BY timestamp DESC' if sort_order == 'desc' else 'ORDER BY timestamp ASC'
        else:  # random
            order_clause = 'ORDER BY RANDOM()'
        
        # Use SQLite date filtering (same as stats endpoint)
        cursor.execute(f'''
            SELECT platform, title, description, url, score, engagement, category, tags, timestamp, topic, author
            FROM trending_topics
            WHERE platform = ? AND timestamp > datetime('now', '-7 days')
            {order_clause}
            LIMIT 200
        ''', (platform,))
        
        topics = []
        seen_titles = set()  # Track seen titles to avoid duplicates
        seen_urls = set()    # Track seen URLs as additional deduplication
        
        for row in cursor.fetchall():
            title = row[1]
            url = row[3]
            
            # Skip if we've seen this title or URL before
            if title in seen_titles or url in seen_urls:
                continue
                
            topics.append({
                'platform': row[0],
                'title': title,
                'description': row[2],
                'url': url,
                'score': row[4],
                'engagement': row[5],
                'category': row[6],      # Fixed: was row[7]
                'tags': json.loads(row[7]) if row[7] else [],  # Fixed: was row[8]
                'timestamp': row[8],     # Fixed: was row[9]
                'topic': row[9] or 'general',  # Fixed: was row[10]
                'author': row[10] if len(row) > 10 else 'Unknown'  # Fixed: was row[11]
            })
            seen_titles.add(title)
            seen_urls.add(url)
        
        print(f"🔍 Debug: {platform} topics after deduplication: {len(topics)}")
        
        conn.close()
        
        return jsonify({
            'success': True,
            'platform': platform,
            'topics': topics,
            'count': len(topics),
            'sort_by': sort_by,
            'sort_order': sort_order
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/trending/topic/<topic>', methods=['GET'])
def get_topic_trending(topic):
    """Get trending topics by specific topic with sorting"""
    try:
        # Get sorting parameters from query string
        sort_by = request.args.get('sort', 'random')  # random, engagement, date
        sort_order = request.args.get('order', 'desc')  # asc, desc
        
        conn = sqlite3.connect('viral_trends.db')
        cursor = conn.cursor()
        
        week_ago = datetime.now() - timedelta(days=DATABASE_RETENTION_DAYS)
        
        # Build SQL query based on sorting parameters
        if sort_by == 'engagement':
            order_clause = 'ORDER BY engagement DESC' if sort_order == 'desc' else 'ORDER BY engagement ASC'
        elif sort_by == 'date':
            order_clause = 'ORDER BY timestamp DESC' if sort_order == 'desc' else 'ORDER BY timestamp ASC'
        else:  # random
            order_clause = 'ORDER BY RANDOM()'
        
        cursor.execute(f'''
            SELECT platform, title, description, url, score, engagement, category, tags, timestamp, topic, author
            FROM trending_topics
            WHERE topic = ? AND timestamp > ?
            {order_clause}
            LIMIT 200
        ''', (topic, week_ago))
        
        topics = []
        seen_titles = set()  # Track seen titles to avoid duplicates
        seen_urls = set()    # Track seen URLs as additional deduplication
        
        for row in cursor.fetchall():
            title = row[1]
            url = row[3]
            
            # Skip if we've seen this title or URL before
            if title in seen_titles or url in seen_urls:
                continue
                
            topics.append({
                'platform': row[0],
                'title': title,
                'description': row[2],
                'url': url,
                'score': row[4],
                'engagement': row[5],
                'category': row[6],      # Fixed: was row[7]
                'tags': json.loads(row[7]) if row[7] else [],  # Fixed: was row[8]
                'timestamp': row[8],     # Fixed: was row[9]
                'topic': row[9] or 'general',  # Fixed: was row[10]
                'author': row[10] if len(row) > 10 else 'Unknown'  # Fixed: was row[11]
            })
            seen_titles.add(title)
            seen_urls.add(url)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'topic': topic,
            'topics': topics,
            'count': len(topics),
            'sort_by': sort_by,
            'sort_order': sort_order
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/topics', methods=['GET'])
def get_available_topics():
    """Get list of available topics based on current trending data"""
    try:
        # First try to get from cache (same as /api/trending)
        cached_data = cache_manager.get_cached_data(CACHE_KEYS['trending_topics'])
        if cached_data:
            # Count topics from cached data
            topic_counts = {}
            for topic in cached_data['topics']:
                topic_name = topic.get('topic', 'general')
                topic_counts[topic_name] = topic_counts.get(topic_name, 0) + 1
            
            # Convert to list format
            topics = [{'topic': topic, 'count': count} for topic, count in topic_counts.items()]
            topics.sort(key=lambda x: x['count'], reverse=True)
            
            return jsonify({
                'success': True,
                'topics': topics
            })
        
        # If no cache, use the same fallback logic as /api/trending
        conn = sqlite3.connect('viral_trends.db')
        cursor = conn.cursor()
        
        week_ago = datetime.now() - timedelta(days=DATABASE_RETENTION_DAYS)
        
        # Get top topics from each platform separately (same logic as /api/trending)
        all_topics = []
        seen_titles = set()
        
        for platform in ['Reddit', 'YouTube']:
            cursor.execute('''
                SELECT platform, title, description, url, score, engagement, category, tags, timestamp, topic, author
                FROM trending_topics
                WHERE platform = ? AND timestamp > ?
                ORDER BY RANDOM()
                LIMIT 200
            ''', (platform, week_ago))
            
            for row in cursor.fetchall():
                # Avoid duplicates by title (same logic as /api/trending)
                if row[1] not in seen_titles:
                    all_topics.append({
                        'platform': row[0],
                        'title': row[1],
                        'description': row[2],
                        'url': row[3],
                        'score': row[4],
                        'engagement': row[5],
                        'category': row[6],      # Fixed: was row[7]
                        'tags': json.loads(row[7]) if row[7] else [],  # Fixed: was row[8]
                        'timestamp': row[8],     # Fixed: was row[9]
                        'topic': row[9] or 'general',  # Fixed: was row[10]
                        'author': row[10] if len(row) > 10 else 'Unknown'  # Fixed: was row[11]
                    })
                    seen_titles.add(row[1])
        
        # Count topics from the same dataset
        topic_counts = {}
        for topic in all_topics:
            topic_name = topic['topic']
            topic_counts[topic_name] = topic_counts.get(topic_name, 0) + 1
        
        # Convert to list format
        topics = [{'topic': topic, 'count': count} for topic, count in topic_counts.items()]
        topics.sort(key=lambda x: x['count'], reverse=True)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'topics': topics
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get trending statistics from database"""
    try:
        conn = sqlite3.connect('viral_trends.db')
        cursor = conn.cursor()
        
        # Platform distribution (last 7 days)
        cursor.execute('''
            SELECT platform, COUNT(*) as count
            FROM trending_topics
            WHERE timestamp > datetime('now', '-7 days')
            GROUP BY platform
        ''')
        
        platform_stats = {row[0]: row[1] for row in cursor.fetchall()}
        
        # Top categories (last 7 days)
        cursor.execute('''
            SELECT category, COUNT(*) as count
            FROM trending_topics
            WHERE timestamp > datetime('now', '-7 days')
            GROUP BY category
            ORDER BY count DESC
            LIMIT 10
        ''')
        
        category_stats = {row[0]: row[1] for row in cursor.fetchall()}
        
        # Total topics in database (all time)
        cursor.execute('SELECT COUNT(*) FROM trending_topics')
        total_topics_all_time = cursor.fetchone()[0]
        
        conn.close()
        
        # Calculate total from platform stats
        total_topics_7d = sum(platform_stats.values())
        
        return jsonify({
            'success': True,
            'platform_stats': platform_stats,
            'category_stats': category_stats,
            'total_topics_7d': total_topics_7d,
            'total_topics_all_time': total_topics_all_time,
            'cached': False
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/cache/status', methods=['GET'])
def get_cache_status():
    """Get cache status information"""
    try:
        cache_status = {}
        for key_name, cache_key in CACHE_KEYS.items():
            cache_info = cache_manager.get_cache_info(cache_key)
            cache_status[key_name] = {
                'exists': cache_info['exists'],
                'ttl_seconds': cache_info['ttl_seconds'],
                'ttl_minutes': cache_info['ttl_minutes']
            }
        
        return jsonify({
            'success': True,
            'cache_status': cache_status,
            'cache_type': 'redis' if cache_manager.redis_client else 'memory'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/cache/clear', methods=['POST'])
def clear_cache():
    """Clear all cache"""
    try:
        cache_manager.clear_cache()
        return jsonify({
            'success': True,
            'message': 'Cache cleared successfully'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/update/trigger', methods=['POST'])
def trigger_update():
    """Manually trigger background database update"""
    try:
        # Run update in background thread
        thread = threading.Thread(target=update_database_with_fresh_data)
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'success': True,
            'message': 'Background update triggered successfully',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/scheduler/status', methods=['GET'])
def scheduler_status():
    """Get scheduler status and next run time"""
    try:
        job = scheduler.get_job('update_database')
        if job:
            return jsonify({
                'success': True,
                'scheduler_running': scheduler.running,
                'job_id': job.id,
                'job_name': job.name,
                'next_run': job.next_run_time.isoformat() if job.next_run_time else None,
                'last_run': job.next_run_time.isoformat() if hasattr(job, 'last_run_time') and job.last_run_time else None
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Background job not found'
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/last-update', methods=['GET'])
def get_last_update():
    """Get the timestamp of the last database update"""
    try:
        global last_db_update
        
        # If we have a global last update time, use it
        if last_db_update:
            return jsonify({
                'success': True,
                'last_update': last_db_update,
                'formatted': datetime.fromisoformat(last_db_update.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S')
            })
        
        # Fallback to database query
        conn = sqlite3.connect('viral_trends.db')
        cursor = conn.cursor()
        
        # Get the most recent timestamp from the database
        cursor.execute('''
            SELECT MAX(timestamp) as last_update
            FROM trending_topics
        ''')
        
        result = cursor.fetchone()
        conn.close()
        
        if result and result[0]:
            # Initialize the global variable with the database timestamp
            last_db_update = result[0]
            return jsonify({
                'success': True,
                'last_update': result[0],
                'formatted': datetime.fromisoformat(result[0].replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S')
            })
        else:
            # If no data in database, use current time
            last_db_update = datetime.now().isoformat()
            return jsonify({
                'success': True,
                'last_update': last_db_update,
                'formatted': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/trending/all', methods=['GET'])
def get_all_trending():
    """Get ALL trending topics from last 7 days (for progressive loading) with sorting"""
    try:
        # Get sorting parameters from query string
        sort_by = request.args.get('sort', 'random')  # random, engagement, date
        sort_order = request.args.get('order', 'desc')  # asc, desc
        
        # Check cache first for all data
        cached_data = cache_manager.get_cached_data(CACHE_KEYS['all_trending_topics'])
        if cached_data:
            cache_info = cache_manager.get_cache_info(CACHE_KEYS['all_trending_topics'])
            print(f"📦 Serving {len(cached_data['topics'])} ALL topics from cache")
            
            # Apply sorting to cached data
            topics = cached_data['topics'].copy()
            if sort_by == 'engagement':
                topics.sort(key=lambda x: x['engagement'], reverse=(sort_order == 'desc'))
            elif sort_by == 'date':
                topics.sort(key=lambda x: x['timestamp'], reverse=(sort_order == 'desc'))
            # If sort_by is 'random', keep the random order from cache
            
            return jsonify({
                'success': True,
                'topics': topics,
                'count': len(topics),
                'timestamp': cached_data['timestamp'],
                'cached': True,
                'cache_ttl_minutes': cache_info['ttl_minutes'],
                'sort_by': sort_by,
                'sort_order': sort_order
            })
        
        # If no cache, fetch ALL data from database
        conn = sqlite3.connect('viral_trends.db')
        cursor = conn.cursor()
        
        # Get ALL topics from last DATABASE_RETENTION_DAYS days (no limit)
        week_ago = datetime.now() - timedelta(days=DATABASE_RETENTION_DAYS)
        
        # Build SQL query based on sorting parameters
        if sort_by == 'engagement':
            order_clause = 'ORDER BY engagement DESC' if sort_order == 'desc' else 'ORDER BY engagement ASC'
        elif sort_by == 'date':
            order_clause = 'ORDER BY timestamp DESC' if sort_order == 'desc' else 'ORDER BY timestamp ASC'
        else:  # random
            order_clause = 'ORDER BY RANDOM()'
        
        cursor.execute(f'''
            SELECT platform, title, description, url, score, engagement, category, tags, timestamp, topic, author
            FROM trending_topics
            WHERE timestamp > ?
            {order_clause}
        ''', (week_ago,))
        
        all_topics = []
        seen_titles = set()  # Track seen titles to avoid duplicates
        seen_urls = set()
        
        for row in cursor.fetchall():
            title = row[1]
            url = row[3]
            
            # Skip if we've seen this title or URL before
            if title in seen_titles or url in seen_urls:
                continue
                
            topic = {
                'platform': row[0],      # platform
                'title': title,          # title
                'description': row[2],   # description
                'url': url,              # url
                'score': row[4],         # score
                'engagement': row[5],    # engagement
                'category': row[6],      # category (was row[7] before)
                'tags': json.loads(row[7]) if row[7] else [],  # tags (was row[8] before)
                'timestamp': row[8],     # timestamp (was row[9] before)
                'topic': row[9] or 'general',  # topic (was row[10] before)
                'author': row[10] if len(row) > 10 else 'Unknown'  # author (was row[11] before)
            }
            all_topics.append(topic)
            seen_titles.add(title)
            seen_urls.add(url)
        
        conn.close()
        
        print(f"📊 Fetched {len(all_topics)} unique ALL topics from database (removed duplicates)")
        
        # Cache the ALL results (always cache with random order for future use)
        cache_data = {
            'topics': all_topics,
            'timestamp': datetime.now().isoformat()
        }
        cache_manager.set_cached_data(CACHE_KEYS['all_trending_topics'], cache_data)
        
        return jsonify({
            'success': True,
            'topics': all_topics,
            'count': len(all_topics),
            'timestamp': cache_data['timestamp'],
            'cached': False,
            'sort_by': sort_by,
            'sort_order': sort_order
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/database/cleanup', methods=['POST'])
def trigger_database_cleanup():
    """Trigger database cleanup to remove old data"""
    try:
        # Run cleanup in a separate thread to avoid blocking
        thread = threading.Thread(target=cleanup_database_duplicates)
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'success': True,
            'message': 'Database cleanup triggered successfully',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Platform APIs disabled - removed dead code

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Clean up existing duplicates
    cleanup_database_duplicates()
    
    # Run initial database update
    print("🚀 Starting initial database update...")
    update_database_with_fresh_data()
    
    # Start the background scheduler
    print("⏰ Background scheduler is running - database will update every 15 minutes")
    
    # Run the Flask app
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=True) 