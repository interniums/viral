"""
Google Trends API Integration
Fetches trending searches and related data from Google Trends
"""

import time
from datetime import datetime, timedelta
from pytrends.request import TrendReq
import random

class GoogleTrendsAPI:
    def __init__(self):
        """Initialize Google Trends API client"""
        try:
            self.pytrends = TrendReq(hl='en-US', tz=360, timeout=(10, 25), retries=2, backoff_factor=0.1)
            print("✅ Google Trends API initialized successfully")
        except Exception as e:
            print(f"❌ Google Trends API initialization failed: {e}")
            self.pytrends = None

    def get_trending_searches(self, country='US', limit=50):
        """Get trending searches for a specific country"""
        if not self.pytrends:
            return []
        
        try:
            print(f"🔍 Fetching Google Trends for {country}...")
            
            # Get trending searches
            trending_searches = self.pytrends.trending_searches(pn=country)
            
            if trending_searches.empty:
                print("❌ No trending searches found")
                return []
            
            # Convert to list and limit results
            trends = trending_searches[0].tolist()[:limit]
            print(f"✅ Found {len(trends)} trending searches")
            
            return trends
            
        except Exception as e:
            print(f"❌ Error fetching trending searches: {e}")
            return []

    def get_interest_over_time(self, keywords, timeframe='today 12-m'):
        """Get interest over time for specific keywords"""
        if not self.pytrends:
            return []
        
        try:
            print(f"📈 Fetching interest over time for: {keywords}")
            
            # Build payload
            self.pytrends.build_payload(keywords, cat=0, timeframe=timeframe, geo='', gprop='')
            
            # Get interest over time
            interest_data = self.pytrends.interest_over_time()
            
            if interest_data.empty:
                print("❌ No interest data found")
                return []
            
            # Process the data
            results = []
            for keyword in keywords:
                if keyword in interest_data.columns:
                    avg_interest = interest_data[keyword].mean()
                    max_interest = interest_data[keyword].max()
                    recent_interest = interest_data[keyword].iloc[-1] if len(interest_data) > 0 else 0
                    
                    results.append({
                        'keyword': keyword,
                        'avg_interest': int(avg_interest),
                        'max_interest': int(max_interest),
                        'recent_interest': int(recent_interest),
                        'trend': 'rising' if recent_interest > avg_interest else 'falling'
                    })
            
            print(f"✅ Processed interest data for {len(results)} keywords")
            return results
            
        except Exception as e:
            print(f"❌ Error fetching interest over time: {e}")
            return []

    def get_related_queries(self, keyword, limit=10):
        """Get related queries for a specific keyword"""
        if not self.pytrends:
            return []
        
        try:
            print(f"🔗 Fetching related queries for: {keyword}")
            
            # Build payload
            self.pytrends.build_payload([keyword], cat=0, timeframe='today 12-m', geo='', gprop='')
            
            # Get related queries
            related_queries = self.pytrends.related_queries()
            
            if not related_queries or keyword not in related_queries:
                print("❌ No related queries found")
                return []
            
            # Get top and rising queries
            top_queries = related_queries[keyword]['top']
            rising_queries = related_queries[keyword]['rising']
            
            results = []
            
            # Add top queries
            if top_queries is not None and not top_queries.empty:
                for _, row in top_queries.head(limit//2).iterrows():
                    results.append({
                        'query': row['query'],
                        'value': int(row['value']),
                        'type': 'top'
                    })
            
            # Add rising queries
            if rising_queries is not None and not rising_queries.empty:
                for _, row in rising_queries.head(limit//2).iterrows():
                    results.append({
                        'query': row['query'],
                        'value': int(row['value']),
                        'type': 'rising'
                    })
            
            print(f"✅ Found {len(results)} related queries")
            return results
            
        except Exception as e:
            print(f"❌ Error fetching related queries: {e}")
            return []

    def get_trending_topics(self, country='US', limit=100):
        """Get trending topics formatted for the app"""
        if not self.pytrends:
            return []
        
        try:
            print(f"🔥 Fetching Google Trends trending topics for {country}...")
            
            # Get trending searches
            trending_searches = self.get_trending_searches(country, limit)
            
            if not trending_searches:
                return []
            
            topics = []
            
            for i, search_term in enumerate(trending_searches):
                # Add delay to avoid rate limiting
                if i > 0 and i % 5 == 0:
                    time.sleep(1)
                
                try:
                    # Get related queries for context
                    related = self.get_related_queries(search_term, 5)
                    
                    # Create topic object
                    topic = {
                        'platform': 'Google Trends',
                        'title': search_term,
                        'description': f"Trending search on Google - {search_term}",
                        'url': f"https://www.google.com/search?q={search_term.replace(' ', '+')}",
                        'score': 100 - (i * 2),  # Score based on position
                        'engagement': 100 - (i * 2),
                        'category': 'Trending Search',
                        'topic': self._detect_topic_category(search_term),
                        'tags': ['google-trends', 'trending', 'search'],
                        'author': 'Google Trends',
                        'timestamp': datetime.now().isoformat()
                    }
                    
                    # Add related queries as additional context
                    if related:
                        topic['related_queries'] = [r['query'] for r in related[:3]]
                    
                    topics.append(topic)
                    
                except Exception as e:
                    print(f"❌ Error processing trend '{search_term}': {e}")
                    continue
            
            print(f"✅ Generated {len(topics)} Google Trends topics")
            return topics
            
        except Exception as e:
            print(f"❌ Error fetching Google Trends topics: {e}")
            return []

    def _detect_topic_category(self, search_term):
        """Detect topic category based on search term"""
        search_lower = search_term.lower()
        
        # Crypto topics
        crypto_keywords = ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'defi', 'nft', 'token', 'coin']
        if any(keyword in search_lower for keyword in crypto_keywords):
            return 'crypto'
        
        # Sports topics
        sports_keywords = ['sports', 'nba', 'nfl', 'soccer', 'tennis', 'formula1', 'football', 'basketball', 'baseball']
        if any(keyword in search_lower for keyword in sports_keywords):
            return 'sports'
        
        # Technology topics
        tech_keywords = ['technology', 'tech', 'ai', 'artificial intelligence', 'machine learning', 'software', 'app']
        if any(keyword in search_lower for keyword in tech_keywords):
            return 'technology'
        
        # Entertainment topics
        entertainment_keywords = ['movie', 'film', 'celebrity', 'actor', 'actress', 'tv show', 'series']
        if any(keyword in search_lower for keyword in entertainment_keywords):
            return 'entertainment'
        
        # Politics topics
        politics_keywords = ['politics', 'election', 'president', 'government', 'policy']
        if any(keyword in search_lower for keyword in politics_keywords):
            return 'politics'
        
        # Gaming topics
        gaming_keywords = ['game', 'gaming', 'esports', 'xbox', 'playstation', 'nintendo']
        if any(keyword in search_lower for keyword in gaming_keywords):
            return 'gaming'
        
        return 'general'

# Global instance
google_trends_client = None

def init_google_trends():
    """Initialize Google Trends client"""
    global google_trends_client
    try:
        google_trends_client = GoogleTrendsAPI()
        return google_trends_client
    except Exception as e:
        print(f"❌ Google Trends initialization failed: {e}")
        return None

def fetch_google_trends_trending():
    """Fetch trending topics from Google Trends"""
    if not google_trends_client:
        print("❌ Google Trends client not available")
        return []
    
    return google_trends_client.get_trending_topics() 