import requests
try:
    print("Testing Render API with Gemma free model...")
    res = requests.post('https://ratefluencer-wfud.onrender.com/api/ideas', json={"trend": "Productivity Hacks"})
    print("STATUS:", res.status_code)
    print("BODY:", res.text[:500])
except Exception as e:
    print("Error:", e)
