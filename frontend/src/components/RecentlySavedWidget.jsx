import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Clock, TrendingUp } from 'lucide-react';
import { formatNumber } from '../utils/format';

const RecentlySavedWidget = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await client.get('/api/history');
      setHistory(res.data);
    } catch (err) {
      console.error("Could not load history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Poll every 10 seconds to keep it fresh
    const timer = setInterval(fetchHistory, 10000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return null;
  if (!history || history.length === 0) return null;

  return (
    <div className="mt-12 glass-card p-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <Clock size={20} className="text-primary" />
        Recently Generated
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {history.map((item) => {
          // Format relative time (e.g., "2 mins ago")
          const diff = Math.floor((new Date() - new Date(item.created_at)) / 60000);
          const timeAgo = diff < 1 ? "Just now" : diff < 60 ? `${diff} mins ago` : `${Math.floor(diff/60)} hours ago`;

          return (
            <div key={item.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-md">
                  {item.trend}
                </span>
                <span className="text-xs text-slate-400 font-medium">{timeAgo}</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 line-clamp-2 mb-3">
                "{item.idea}"
              </p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-500">
                <TrendingUp size={14} /> Score: {item.virality_score}/100
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlySavedWidget;
