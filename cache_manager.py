#!/usr/bin/env python3
"""
In-Memory Cache Manager for Viral Trending Topics
Handles caching of trending data to prevent API rate limit issues
"""

import json
import time
from datetime import datetime, timedelta

# Constants
CACHE_DURATION_SECONDS = 900  # 15 minutes in seconds (match DB update frequency)

class CacheManager:
    def __init__(self):
        self.cache_duration = CACHE_DURATION_SECONDS  # 15 minutes in seconds (match DB update frequency)
        self.memory_cache = {}
        print("✅ Using in-memory cache (15 minute TTL - matches DB updates)")
    
    def get_cached_data(self, key):
        """Get data from cache"""
        if key in self.memory_cache:
            data, timestamp = self.memory_cache[key]
            if time.time() - timestamp < self.cache_duration:
                return data
        
        return None
    
    def set_cached_data(self, key, data):
        """Set data in cache"""
        self.memory_cache[key] = (data, time.time())
    
    def is_cache_valid(self, key):
        """Check if cache is still valid"""
        cached_data = self.get_cached_data(key)
        return cached_data is not None
    
    def get_cache_info(self, key):
        """Get cache information"""
        if key in self.memory_cache:
            data, timestamp = self.memory_cache[key]
            elapsed = time.time() - timestamp
            remaining = max(0, self.cache_duration - elapsed)
            return {
                'exists': remaining > 0,
                'ttl_seconds': int(remaining),
                'ttl_minutes': int(remaining // 60)
            }
        
        return {'exists': False, 'ttl_seconds': 0, 'ttl_minutes': 0}
    
    def clear_cache(self, key=None):
        """Clear cache"""
        if key:
            if key in self.memory_cache:
                del self.memory_cache[key]
        else:
            # Clear all cache
            self.memory_cache.clear()
            print("🗑️ All cache cleared")

# Global cache manager instance
cache_manager = CacheManager()

# Cache keys
CACHE_KEYS = {
    'trending_topics': 'viral:trending:topics',
    'all_trending_topics': 'viral:trending:all_topics',
    'reddit_topics': 'viral:trending:reddit',
    'google_trends_topics': 'viral:trending:google_trends',
    'youtube_topics': 'viral:trending:youtube',
    'stats': 'viral:stats:overview'
} 