#!/usr/bin/env python3
"""
Simple test script to verify API endpoints work after removing normalized_score
"""

import requests
import json
import time

def test_api_endpoint():
    """Test the /api/trending/all endpoint"""
    try:
        print("🧪 Testing API endpoint...")
        
        # Test the endpoint that was failing
        url = "http://localhost:5000/api/trending/all?sort=random&order=desc"
        response = requests.get(url, timeout=10)
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {data.get('count', 0)} topics")
            print(f"📦 Cached: {data.get('cached', False)}")
            print(f"🕒 Timestamp: {data.get('timestamp', 'N/A')}")
            
            # Show first topic if available
            topics = data.get('topics', [])
            if topics:
                first_topic = topics[0]
                print(f"📰 First topic: {first_topic.get('title', 'N/A')[:50]}...")
                print(f"🏷️ Platform: {first_topic.get('platform', 'N/A')}")
                print(f"📊 Engagement: {first_topic.get('engagement', 'N/A')}")
            
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the Flask server is running on port 5000")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting API test...")
    success = test_api_endpoint()
    
    if success:
        print("🎉 API test passed!")
    else:
        print("�� API test failed!") 