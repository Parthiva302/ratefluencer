import os
from supabase import create_client, Client

def init_supabase_tables():
    """
    Auto-create Supabase tables if they don't exist.
    Call this once on Flask app startup.
    """
    try:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        
        if not url or not key:
            print("⚠️ Supabase credentials not found. Skipping table init.")
            return False
        
        try:
            supabase: Client = create_client(url, key)
        except Exception as e:
            print(f"Failed to create Supabase client: {e}. Skipping table init.")
            return False
        
        # Check if content_history table exists by trying to insert a test row
        # (This avoids failing if we don't have schema introspection permissions)
        try:
            res = supabase.table("content_history").insert({
                "trend": "sample",
                "idea": "sample",
                "script": {},
                "caption": "sample",
                "hashtags": {},
                "virality_score": 0
            }).execute()
            
            # If insert succeeds, table exists. Delete this test row.
            supabase.table("content_history").delete().eq("trend", "sample").execute()
            print("[SUCCESS] content_history table exists")
        except Exception as e:
            # Table doesn't exist or insert failed, create it
            print(f"[INFO] Creating Supabase tables...")
            try:
                # Execute raw SQL to create tables (Requires RPC exec_sql to be defined in Supabase)
                supabase.postgrest.post(
                    "/rpc/exec_sql",
                    {"sql": CREATE_TABLES_SQL}
                )
                print("[SUCCESS] Tables created successfully")
            except Exception as create_err:
                print(f"[WARNING] Could not auto-create tables via RPC: {create_err}")
                print("   Manually create tables in Supabase dashboard or run migrations.")
                return False
                
        return True
    except Exception as e:
        print(f"⚠️ Unexpected error in init_supabase_tables: {e}")
        return False

# Raw SQL to create tables
CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS content_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trend TEXT NOT NULL,
  idea TEXT NOT NULL,
  script JSONB,
  caption TEXT,
  hashtags JSONB,
  virality_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS virality_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  input_data JSONB,
  virality_score INTEGER,
  expected_views INTEGER,
  expected_likes INTEGER,
  expected_shares INTEGER,
  breakdown JSONB,
  verdict TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO virality_logs (virality_score, expected_views, expected_likes, expected_shares, breakdown, verdict)
VALUES 
  (87, 52000, 4680, 624, '{"hook_score": 90, "trend_score": 85, "hashtag_score": 80, "originality_score": 88}', 'High viral potential'),
  (72, 38000, 3420, 456, '{"hook_score": 75, "trend_score": 70, "hashtag_score": 72, "originality_score": 70}', 'Good viral potential'),
  (54, 22000, 1980, 264, '{"hook_score": 55, "trend_score": 52, "hashtag_score": 54, "originality_score": 56}', 'Medium viral potential'),
  (91, 68000, 6120, 816, '{"hook_score": 93, "trend_score": 92, "hashtag_score": 89, "originality_score": 90}', 'Very high viral potential'),
  (45, 15000, 1350, 180, '{"hook_score": 42, "trend_score": 48, "hashtag_score": 44, "originality_score": 46}', 'Low viral potential'),
  (78, 44000, 3960, 528, '{"hook_score": 80, "trend_score": 77, "hashtag_score": 78, "originality_score": 78}', 'Good viral potential'),
  (62, 28000, 2520, 336, '{"hook_score": 64, "trend_score": 61, "hashtag_score": 62, "originality_score": 63}', 'Medium viral potential'),
  (85, 48000, 4320, 576, '{"hook_score": 87, "trend_score": 84, "hashtag_score": 84, "originality_score": 86}', 'High viral potential'),
  (69, 35000, 3150, 420, '{"hook_score": 70, "trend_score": 68, "hashtag_score": 69, "originality_score": 70}', 'Good viral potential'),
  (51, 19000, 1710, 228, '{"hook_score": 50, "trend_score": 51, "hashtag_score": 52, "originality_score": 51}', 'Medium viral potential'),
  (76, 41000, 3690, 492, '{"hook_score": 78, "trend_score": 75, "hashtag_score": 76, "originality_score": 75}', 'Good viral potential'),
  (93, 72000, 6480, 864, '{"hook_score": 95, "trend_score": 92, "hashtag_score": 92, "originality_score": 92}', 'Very high viral potential'),
  (58, 25000, 2250, 300, '{"hook_score": 59, "trend_score": 57, "hashtag_score": 58, "originality_score": 59}', 'Medium viral potential'),
  (81, 46000, 4140, 552, '{"hook_score": 83, "trend_score": 80, "hashtag_score": 81, "originality_score": 81}', 'High viral potential'),
  (65, 31000, 2790, 372, '{"hook_score": 66, "trend_score": 65, "hashtag_score": 64, "originality_score": 66}', 'Medium viral potential');
"""
