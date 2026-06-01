import requests

url = "http://localhost:5000/api/save"
payload = {
    "trend": "AI Agents",
    "idea": "Top 5 AI Agents",
    "script": {"hook": "Hey", "content": ["1", "2"], "cta": "Subscribe"},
    "caption": "Check out these AI agents",
    "hashtags": {"high": ["#ai"], "medium": ["#tech"], "low": ["#agent"]},
    "virality_score": 85
}

try:
    res = requests.post(url, json=payload)
    print("STATUS:", res.status_code)
    print("RESPONSE:", res.text)
except Exception as e:
    print("ERROR:", e)
