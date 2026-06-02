import requests
try:
    res = requests.get('https://openrouter.ai/api/v1/models').json()
    free_models = [m['id'] for m in res['data'] if ':free' in m['id']]
    # test a few top ones
    key = open('.env').read().split('OPENROUTER_API_KEY=')[1].split('\n')[0].strip()
    working = []
    for model in free_models[:10]:
        print("Testing", model)
        test = requests.post('https://openrouter.ai/api/v1/chat/completions', 
                             headers={'Authorization': f'Bearer {key}'},
                             json={'model': model, 'messages': [{'role': 'user', 'content': 'hi'}]})
        if test.status_code == 200:
            working.append(model)
            print("  SUCCESS!")
        else:
            print("  FAILED:", test.status_code)
    print("\nWORKING FREE MODELS:", working)
except Exception as e:
    print("Error:", e)
