import requests
import os
import json

def call_openrouter(prompt, model="google/gemma-4-31b-it:free", system_prompt=None):
    """
    Call OpenRouter API with the given prompt.
    Returns the generated text.
    """
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "ContentAI Agent"
    }
    
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})
    
    payload = {
        "models": [
            "google/gemma-4-31b-it:free", 
            "google/gemma-2-9b-it:free",
            "meta-llama/llama-3.2-3b-instruct:free",
            "mistralai/mistral-7b-instruct:free"
        ],
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1000
    }
    
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        json=payload,
        headers=headers,
        timeout=30
    )
    
    if response.status_code == 200:
        content = response.json()["choices"][0]["message"]["content"]
        content = content.strip()
        # Find the first { or [ and the last } or ]
        start_brace = content.find("{")
        start_bracket = content.find("[")
        end_brace = content.rfind("}")
        end_bracket = content.rfind("]")
        
        start = -1
        if start_brace != -1 and start_bracket != -1:
            start = min(start_brace, start_bracket)
        else:
            start = max(start_brace, start_bracket)
            
        end = -1
        if end_brace != -1 and end_bracket != -1:
            end = max(end_brace, end_bracket)
        else:
            end = max(end_brace, end_bracket)
            
        if start != -1 and end != -1 and end > start:
            content = content[start:end+1]
            
        return content.strip()
    else:
        raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")
