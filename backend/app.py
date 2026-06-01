import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load env before imports that might use it
load_dotenv()

from utils.supabase_init import init_supabase_tables
from routes.trends import trends_bp
from routes.content import content_bp
from routes.virality import virality_bp
from utils.supabase_client import get_supabase_client
import requests

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Initialize Supabase tables
    with app.app_context():
        init_supabase_tables()

    # Register blueprints
    app.register_blueprint(trends_bp, url_prefix='/api')
    app.register_blueprint(content_bp, url_prefix='/api')
    app.register_blueprint(virality_bp, url_prefix='/api')

    @app.route('/health', methods=['GET'])
    def health_check():
        status = {
            "status": "ok",
            "message": "All systems operational",
            "services": {
                "openrouter": "checking...",
                "supabase": "checking...",
                "serpapi": "checking..."
            }
        }
        
        # Check OpenRouter (just a simple GET to models endpoint or similar)
        try:
            headers = {"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}"}
            res = requests.get("https://openrouter.ai/api/v1/auth/key", headers=headers, timeout=5)
            if res.status_code == 200:
                status["services"]["openrouter"] = "connected"
            else:
                status["services"]["openrouter"] = "error"
        except:
            status["services"]["openrouter"] = "error"
            
        # Check Supabase
        try:
            sb = get_supabase_client()
            # Just ping auth or try to fetch 1 row from a table we know exists
            res = sb.table("virality_logs").select("id").limit(1).execute()
            status["services"]["supabase"] = "connected"
        except:
            status["services"]["supabase"] = "error"
            
        # Check SerpAPI
        if os.getenv("SERPAPI_KEY"):
            status["services"]["serpapi"] = "configured"
        else:
            status["services"]["serpapi"] = "missing key"
            
        if any(s == "error" for s in status["services"].values()):
            status["status"] = "error"
            status["message"] = "One or more services are experiencing issues"
            return jsonify(status), 500
            
        return jsonify(status)

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv("FLASK_DEBUG", "True").lower() == "true")
