#!/usr/bin/env python3
"""
YouTube Data API Integration
"""

import os
from datetime import datetime, timedelta
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import json

# Constants
DATABASE_RETENTION_DAYS = 7
MAX_DESCRIPTION_LENGTH = 200
ENGAGEMENT_SCORE_DIVISOR = 1000

def init_youtube():
    """Initialize YouTube API client"""
    try:
        api_key = os.getenv('YOUTUBE_API_KEY')
        if not api_key:
            print("YouTube API key not found")
            return None
        
        youtube = build('youtube', 'v3', developerKey=api_key)
        return youtube
    except Exception as e:
        print(f"YouTube API initialization failed: {e}")
        return None

def detect_youtube_topic(title, description, tags):
    """Detect topic category for YouTube video based on title, description, and tags"""
    text = f"{title} {description} {' '.join(tags)}".lower()
    
    # Topic detection patterns
    topic_patterns = {
        'crypto': ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'nft', 'defi', 'cryptocurrency', 'wallet', 'mining'],
        'sports': ['sports', 'football', 'basketball', 'soccer', 'tennis', 'golf', 'nfl', 'nba', 'mlb', 'nhl', 'championship', 'tournament', 'game', 'match'],
        'finance': ['finance', 'money', 'investment', 'stock', 'market', 'trading', 'economy', 'business', 'profit', 'revenue', 'earnings'],
        'technology': ['tech', 'technology', 'ai', 'artificial intelligence', 'machine learning', 'programming', 'software', 'app', 'gadget', 'review', 'tutorial'],
        'gaming': ['game', 'gaming', 'playstation', 'xbox', 'nintendo', 'steam', 'esports', 'streamer', 'gamer', 'walkthrough', 'review'],
        'culture': ['culture', 'art', 'music', 'movie', 'film', 'celebrity', 'fashion', 'lifestyle', 'travel', 'food', 'cooking', 'recipe'],
        'politics': ['politics', 'government', 'election', 'president', 'congress', 'policy', 'law', 'breaking'],
        'memes': ['meme', 'funny', 'comedy', 'humor', 'joke', 'viral', 'trending', 'tiktok', 'reaction']
    }
    
    for topic, keywords in topic_patterns.items():
        if any(keyword in text for keyword in keywords):
            return topic
    
    return 'general'

def fetch_youtube_trending(youtube_client, save_trending_topic):
    """Fetch trending videos from YouTube using Data API with database fallback"""
    trending_topics = []
    
    # First, try to get data from database
    try:
        print("📺 Checking database for recent YouTube videos...")
        import sqlite3
        from datetime import datetime, timedelta
        
        conn = sqlite3.connect('viral_trends.db')
        cursor = conn.cursor()
        
        # Get recent YouTube videos from database (last DATABASE_RETENTION_DAYS days)
        week_ago = datetime.now() - timedelta(days=DATABASE_RETENTION_DAYS)
        cursor.execute('''
            SELECT title, description, url, score, engagement, category, tags, timestamp, topic
            FROM trending_topics
            WHERE platform = 'YouTube' AND timestamp > ?
            ORDER BY engagement DESC
            LIMIT 200
        ''', (week_ago,))
        
        db_videos = cursor.fetchall()
        conn.close()
        
        if db_videos:
            print(f"📺 Found {len(db_videos)} recent YouTube videos in database")
            for video in db_videos:
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
                    'timestamp': video[7]
                }
                trending_topics.append(topic)
                
                if len(trending_topics) >= 200:
                    break
                    
            print(f"📺 Using {len(trending_topics)} YouTube videos from database")
            return trending_topics
            
    except Exception as e:
        print(f"❌ Database check failed: {e}")
    
    # If no database data, try YouTube API
    if not youtube_client:
        print("YouTube client not available")
        return []
    
    try:
        # Get trending videos from different regions
        regions = ['US', 'GB', 'CA', 'AU']
        
        for region in regions:
            try:
                print(f"Fetching YouTube trending for region: {region}")
                
                # Get trending videos - fetch 50 per region to reach 200 total
                request = youtube_client.videos().list(
                    part='snippet,statistics',
                    chart='mostPopular',
                    regionCode=region,
                    maxResults=50,
                    videoCategoryId='0'  # All categories
                )
                
                response = request.execute()
                
                for i, video in enumerate(response.get('items', [])):
                    snippet = video['snippet']
                    statistics = video.get('statistics', {})
                    
                    # Calculate engagement score
                    view_count = int(statistics.get('viewCount', 0))
                    like_count = int(statistics.get('likeCount', 0))
                    comment_count = int(statistics.get('commentCount', 0))
                    engagement = view_count + (like_count * 10) + (comment_count * 50)
                    
                    # Detect topic based on title, description, and tags
                    video_tags = ['youtube', 'video', 'trending', region.lower()]
                    detected_topic = detect_youtube_topic(snippet['title'], snippet['description'], video_tags)
                    
                    topic = {
                        'platform': 'YouTube',
                        'title': snippet['title'],
                                                    'description': snippet['description'][:MAX_DESCRIPTION_LENGTH] if snippet['description'] else 'Trending video on YouTube',
                        'url': f"https://www.youtube.com/watch?v={video['id']}",
                                                    'score': engagement // ENGAGEMENT_SCORE_DIVISOR,  # Convert to manageable score
                        'engagement': engagement,
                        'category': snippet.get('categoryId', 'Video'),
                        'tags': video_tags,
                        'topic': detected_topic,
                        'timestamp': snippet['publishedAt']
                    }
                    
                    trending_topics.append(topic)
                    
                    # Remove timestamp before saving to database
                    topic_for_db = {k: v for k, v in topic.items() if k != 'timestamp'}
                    save_trending_topic(**topic_for_db)
                
                print(f"Found {len(response.get('items', []))} trending videos for {region}")
                
            except HttpError as e:
                print(f"YouTube API error for region {region}: {e}")
                continue
            except Exception as e:
                print(f"Error fetching YouTube trending for region {region}: {e}")
                continue
        
        if not trending_topics:
            print("No YouTube videos found - creating demo data")
            # Create demo YouTube data as fallback
            demo_videos = [
                "Amazing Street Food Tour in Tokyo",
                "How to Build a Sustainable Home",
                "Mind-blowing Magic Tricks Revealed",
                "SpaceX Launch Live Stream",
                "Best Travel Destinations 2024"
            ]
            
            for i, title in enumerate(demo_videos):
                # Detect topic for demo videos
                detected_topic = detect_youtube_topic(title, 'Trending video on YouTube', ['youtube', 'video', 'trending'])
                
                topic = {
                    'platform': 'YouTube',
                    'title': title,
                    'description': 'Trending video on YouTube',
                    'url': 'https://youtube.com/watch?v=demo',
                    'score': 100 - i * 10,
                    'engagement': 100 - i * 10,
                    'category': 'Video',
                    'tags': ['youtube', 'video', 'trending'],
                    'topic': detected_topic,
                    'timestamp': datetime.now().isoformat()
                }
                trending_topics.append(topic)
                topic_for_db = {k: v for k, v in topic.items() if k != 'timestamp'}
                save_trending_topic(**topic_for_db)
        
        return trending_topics
        
    except Exception as e:
        print(f"Error fetching YouTube trending: {e}")
        return [] 