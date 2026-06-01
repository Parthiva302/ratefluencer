from flask import Blueprint, request, jsonify
import json
from utils.openrouter import call_openrouter
from utils.supabase_client import get_supabase_client

virality_bp = Blueprint('virality', __name__)

@virality_bp.route('/virality', methods=['POST'])
def predict_virality():
    data = request.json
    trend = data.get('trend')
    idea = data.get('idea')
    hook = data.get('hook')
    hashtags = data.get('hashtags')
    
    if not all([trend, idea, hook, hashtags]):
        return jsonify({"error": "Missing required fields (trend, idea, hook, hashtags)"}), 400
        
    # Get Supabase client
    try:
        supabase = get_supabase_client()
    except Exception as e:
        return jsonify({"error": f"Supabase error: {e}"}), 500
        
    # Fetch historical virality data (just a few recent rows to give context)
    try:
        history_res = supabase.table("virality_logs").select("input_data,virality_score,verdict").order("created_at", desc=True).limit(5).execute()
        history = history_res.data
    except Exception as e:
        print(f"Warning: Could not fetch history: {e}")
        history = []
        
    prompt = f"""You are an advanced AI virality predictor for short-form content.
Analyze the following content parameters:
- Trend: {trend}
- Idea: {idea}
- Hook: {hook}
- Hashtags: {hashtags}

Recent historical context (for calibration, if any):
{json.dumps(history)}

Score the content out of 100 on these metrics:
1. hook_score (how captivating is the first 3 seconds?)
2. trend_score (how relevant/momentum-driven is the topic?)
3. hashtag_score (how well-optimized is the hashtag strategy?)
4. originality_score (how unique is the angle?)
5. engagement_score (how likely is it to drive comments and saves?)

Then calculate/generate:
- virality_score (weighted average out of 100)
- expected_views (realistic estimate based on score, e.g. 10000 - 100000+)
- expected_likes (approx 10% of views)
- expected_shares (approx 1% of views)
- verdict (A short phrase like "High viral potential", "Medium viral potential", "Needs improvement")
- best_times (suggested optimal posting times for Instagram, LinkedIn, and X)
- target_audience (Age range, Interests, and best Platform)
- coach_feedback (List of 3-4 actionable tips. Start positive points with "✓" and warnings/constructive feedback with "⚠")

Return STRICTLY as a JSON object matching this structure:
{{
  "virality_score": 87,
  "hook_score": 90,
  "trend_score": 85,
  "hashtag_score": 80,
  "originality_score": 88,
  "engagement_score": 92,
  "expected_views": 52000,
  "expected_likes": 4800,
  "expected_shares": 620,
  "verdict": "High viral potential",
  "best_times": {{
    "Instagram": "7:00 PM - 9:00 PM",
    "LinkedIn": "8:00 AM - 10:00 AM",
    "X": "12:00 PM - 2:00 PM"
  }},
  "target_audience": {{
    "age": "18-30",
    "interests": "Technology, Productivity",
    "platform": "Instagram Reels"
  }},
  "coach_feedback": [
    "✓ Strong Hook",
    "⚠ Caption Too Long",
    "✓ Trending Topic",
    "⚠ Add More Emotional Words"
  ]
}}
Do NOT output any markdown or extra text. Just valid JSON."""

    try:
        response_text = call_openrouter(prompt)
        result = json.loads(response_text)
        
        # Format breakdown
        breakdown = {
            "hook_score": result.get("hook_score", 0),
            "trend_score": result.get("trend_score", 0),
            "hashtag_score": result.get("hashtag_score", 0),
            "originality_score": result.get("originality_score", 0),
            "engagement_score": result.get("engagement_score", 0)
        }
        
        # Save to Supabase
        log_data = {
            "input_data": data,
            "virality_score": result.get("virality_score", 0),
            "expected_views": result.get("expected_views", 0),
            "expected_likes": result.get("expected_likes", 0),
            "expected_shares": result.get("expected_shares", 0),
            "breakdown": breakdown,
            "verdict": result.get("verdict", "Unknown"),
            "best_times": result.get("best_times", {}),
            "target_audience": result.get("target_audience", {}),
            "coach_feedback": result.get("coach_feedback", [])
        }
        try:
            supabase.table("virality_logs").insert(log_data).execute()
        except Exception as e:
            print(f"Warning: Could not save virality log: {e}")
            
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

