from flask import Blueprint, jsonify
from serpapi import GoogleSearch
import os
import time

trends_bp = Blueprint('trends', __name__)

# Simple in-memory cache since Redis might not be available locally on Windows easily
_TRENDS_CACHE = {
    "data": None,
    "timestamp": 0
}
CACHE_DURATION = 30 * 60  # 30 minutes in seconds

@trends_bp.route('/trends', methods=['POST'])
def get_trends():
    global _TRENDS_CACHE
    
    current_time = time.time()
    
    if _TRENDS_CACHE["data"] and (current_time - _TRENDS_CACHE["timestamp"] < CACHE_DURATION):
        return jsonify({"trends": _TRENDS_CACHE["data"]})
    
    try:
        api_key = os.getenv("SERPAPI_KEY")
        if not api_key:
            raise ValueError("SERPAPI_KEY not configured")
            
        params = {
            "engine": "google_trends_trending_now",
            "frequency": "realtime",
            "hl": "en",
            "gl": "US",
            "api_key": api_key
        }

        search = GoogleSearch(params)
        results = search.get_dict()
        
        trends = []
        if "realtime_searches" in results:
            # Extract names/titles of trending searches
            for item in results["realtime_searches"][:10]:
                if "title" in item:
                    trends.append(item["title"])
                elif "queries" in item and len(item["queries"]) > 0:
                    trends.append(item["queries"][0]["query"])
                    
        # Fallback if SerpAPI is weird or empty
        if not trends:
            trends = [
                "AI Agents", "ChatGPT", "Remote Work", "Productivity Hacks",
                "Creator Economy", "Crypto", "Side Hustle", "Mindfulness",
                "Sustainable Living", "Personal Finance"
            ]
            
        _TRENDS_CACHE["data"] = trends
        _TRENDS_CACHE["timestamp"] = current_time
        
        return jsonify({"trends": trends})
        
    except Exception as e:
        print(f"Error fetching trends: {e}")
        # Fallback trends in case of API failure
        fallback = ["AI Agents", "ChatGPT", "Content Creation", "Productivity Hacks", "Web3", "Remote Work", "Mental Health", "Fitness Routine"]
        return jsonify({"trends": fallback})
