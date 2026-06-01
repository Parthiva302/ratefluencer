import requests
import json

url = "http://localhost:5000/api/caption"
payload = {
    "idea": "5 AI Tools to 10x Your Productivity",
    "script": {
        "hook": "Stop wasting time. These 5 AI tools will change your life.",
        "content": ["Tool 1", "Tool 2", "Tool 3", "Tool 4", "Tool 5"],
        "cta": "Save this video so you don't forget!"
    }
}

try:
    res = requests.post(url, json=payload)
    print("STATUS:", res.status_code)
    print("RESPONSE:", res.text)
except Exception as e:
    print("ERROR:", e)
