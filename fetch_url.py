import requests
try:
    res = requests.post('http://127.0.0.1:5000/api/ideas', json={"trend": "Productivity Hacks"})
    print("STATUS:", res.status_code)
    print("BODY:", res.text[:500])
except Exception as e:
    print("Error:", e)
