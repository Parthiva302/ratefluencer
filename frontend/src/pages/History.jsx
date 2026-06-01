import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Calendar, Trash2 } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading history...</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <h1 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Generation History</h1>
      <p className="text-slate-500 mb-8">Access your previously saved viral content packages.</p>

      {history.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-lg text-slate-500">No history found. Generate some content first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div key={item.id} className="glass-card p-6 flex flex-col hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  {item.trend}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                  <Calendar size={12} />
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100 line-clamp-2">
                "{item.idea}"
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                {item.script?.hook} {item.script?.content?.[0]}...
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                <div className="text-sm font-bold flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${item.virality_score > 70 ? 'bg-green-500' : 'bg-amber-500'}`} />
                  Score: {item.virality_score}
                </div>
                <button className="text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
