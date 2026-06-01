from flask import Blueprint, request, jsonify
import json
from utils.openrouter import call_openrouter

content_bp = Blueprint('content', __name__)

@content_bp.route('/ideas', methods=['POST'])
def generate_ideas():
    data = request.json
    trend = data.get('trend')
    if not trend:
        return jsonify({"error": "Trend is required"}), 400
        
    prompt = f"""You are an expert social media strategist. Generate exactly 8 unique, punchy reel/short-form video content ideas for the trend: "{trend}".
Each idea must be highly engaging, specific, and optimized for Instagram Reels or YouTube Shorts.
Return the result STRICTLY as a JSON object with this exact structure:
{{
  "ideas": [
    "Idea 1 description...",
    "Idea 2 description...",
    "Idea 3 description...",
    "Idea 4 description...",
    "Idea 5 description...",
    "Idea 6 description...",
    "Idea 7 description...",
    "Idea 8 description..."
  ]
}}
Do NOT output any markdown, code blocks, or extra text. Just valid JSON."""

    try:
        response_text = call_openrouter(prompt)
        # Parse JSON
        result = json.loads(response_text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@content_bp.route('/script', methods=['POST'])
def generate_script():
    data = request.json
    idea = data.get('idea')
    if not idea:
        return jsonify({"error": "Idea is required"}), 400
        
    prompt = f"""You are a master copywriter for short-form video (TikTok, Reels, Shorts). Generate a complete video script for the following idea: "{idea}".

The script must contain:
1. "hook": A curiosity-driven hook for the first 3 seconds to grab attention.
2. "content": 3-5 numbered points, each 1-2 sentences.
3. "cta": A strong Call To Action for the last 5 seconds (e.g., save this, comment below, follow).

Return STRICTLY as a JSON object with this structure:
{{
  "hook": "...",
  "content": ["Point 1...", "Point 2...", "Point 3..."],
  "cta": "..."
}}
Do NOT output any markdown or extra text. Just valid JSON."""

    try:
        response_text = call_openrouter(prompt)
        result = json.loads(response_text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@content_bp.route('/caption', methods=['POST'])
def generate_caption():
    data = request.json
    idea = data.get('idea')
    script = data.get('script')
    
    if not idea or not script:
        return jsonify({"error": "Idea and script are required"}), 400
        
    prompt = f"""Write an engaging Instagram/TikTok caption for a video based on this idea: "{idea}".
The script hook is: "{script.get('hook', '')}".

Requirements:
- Max 150 words
- Engaging and conversational tone
- Include exactly 1 question to drive comments
- DO NOT add hashtags (we will generate those separately)

Return STRICTLY as a JSON object:
{{
  "caption": "Your generated caption here..."
}}
Do NOT output any markdown or extra text. Just valid JSON."""

    try:
        response_text = call_openrouter(prompt)
        result = json.loads(response_text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@content_bp.route('/hashtags', methods=['POST'])
def generate_hashtags():
    data = request.json
    trend = data.get('trend')
    idea = data.get('idea')
    
    if not trend or not idea:
        return jsonify({"error": "Trend and idea are required"}), 400
        
    prompt = f"""Generate exactly 20 highly relevant hashtags for a short-form video about "{idea}" (Trending topic: "{trend}").

Group them strictly into:
- "high": 5 high-reach, broad hashtags (>1M posts)
- "medium": 10 medium-reach, niche hashtags (100K-1M posts)
- "low": 5 low-competition, specific hashtags (<100K posts)

Make sure EVERY hashtag starts with the '#' symbol.

Return STRICTLY as a JSON object:
{{
  "hashtags": {{
    "high": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "medium": ["#tag6", ... 10 tags total],
    "low": ["#tag16", "#tag17", "#tag18", "#tag19", "#tag20"]
  }}
}}
Do NOT output any markdown or extra text. Just valid JSON."""

    try:
        response_text = call_openrouter(prompt)
        result = json.loads(response_text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from utils.supabase_client import get_supabase_client

@content_bp.route('/save', methods=['POST'])
def save_history():
    data = request.json
    try:
        sb = get_supabase_client()
        result = sb.table("content_history").insert({
            "trend": data.get("trend"),
            "idea": data.get("idea"),
            "script": data.get("script"),
            "caption": data.get("caption"),
            "hashtags": data.get("hashtags"),
            "virality_score": data.get("virality_score")
        }).execute()
        return jsonify({"message": "Content saved!", "id": result.data[0]['id'], "created_at": result.data[0]['created_at']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@content_bp.route('/history', methods=['GET'])
def get_history():
    try:
        sb = get_supabase_client()
        result = sb.table("content_history").select("*").order("created_at", desc=True).limit(3).execute()
        return jsonify(result.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
