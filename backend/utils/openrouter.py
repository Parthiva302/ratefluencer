import requests
import os
import json

def call_openrouter(prompt, model=None, system_prompt=None):
    """
    Call OpenRouter API with the given prompt, trying multiple free models sequentially if any fails.
    Returns the generated text.
    """
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "ContentAI Agent",
        "Content-Type": "application/json"
    }
    
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})
    
    # List of models to try in order. If model parameter is supplied, it goes first.
    fallback_models = [
        "google/gemma-4-31b-it:free",
        "openrouter/free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "liquid/lfm-2.5-1.2b-thinking:free"
    ]
    if model and model not in fallback_models:
        fallback_models.insert(0, model)
    elif model:
        # Move preferred model to front
        fallback_models.remove(model)
        fallback_models.insert(0, model)

    last_exception = None
    for active_model in fallback_models:
        payload = {
            "model": active_model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        try:
            print(f"Attempting to call OpenRouter with model: {active_model}...")
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                resp_json = response.json()
                content = resp_json["choices"][0]["message"]["content"]
                content = content.strip()
                
                # Find JSON bounds
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
                    
                print(f"Successfully generated response with model: {active_model}")
                return content.strip()
            else:
                print(f"Model {active_model} failed with code {response.status_code}: {response.text}")
                last_exception = Exception(f"OpenRouter API error ({active_model}): {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Exception calling model {active_model}: {e}")
            last_exception = e
            
    if last_exception:
        raise last_exception
    raise Exception("All fallback models failed to generate content.")
