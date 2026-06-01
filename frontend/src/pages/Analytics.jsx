import React, { useState, useEffect } from 'react';
import client from '../api/client';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await client.get('/api/history');
        // Reverse so the oldest is on the left
        setData(res.data.reverse());
      } catch (err) {
        console.error("Could not load history for analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;
  }

  // Format data for Recharts
  const chartData = data.map((item, idx) => ({
    name: `Generation ${idx + 1}`,
    idea: item.idea.substring(0, 20) + '...',
    score: item.virality_score,
    views: item.expected_views || (item.virality_score * 1000) // Fallback estimation
  }));

  const averageScore = chartData.length > 0 
    ? Math.round(chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length)
    : 0;

  const bestScore = chartData.length > 0 
    ? Math.max(...chartData.map(item => item.score))
    : 0;

  const totalViews = chartData.length > 0
    ? chartData.reduce((acc, curr) => acc + curr.views, 0)
    : 0;

  // Simple logic to find top performing trend
  const topicStats = {};
  data.forEach(item => {
    if (!topicStats[item.trend]) topicStats[item.trend] = { count: 0, score: 0 };
    topicStats[item.trend].count += 1;
    topicStats[item.trend].score += item.virality_score;
  });
  
  let topTopic = "N/A";
  let maxScoreAvg = 0;
  for (const [topic, stats] of Object.entries(topicStats)) {
    const avg = stats.score / stats.count;
    if (avg > maxScoreAvg) {
      maxScoreAvg = avg;
      topTopic = topic;
    }
  }

  let mostUsed = "N/A";
  let maxCount = 0;
  for (const [topic, stats] of Object.entries(topicStats)) {
    if (stats.count > maxCount) {
      maxCount = stats.count;
      mostUsed = topic;
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <h1 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Analytics Overview</h1>
      <p className="text-slate-500 mb-8">Track your performance and projected virality across all generations.</p>

      {chartData.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">
          Not enough data yet. Generate some content!
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Avg Score</h3>
              <div className="text-3xl font-black text-primary">{averageScore}</div>
            </div>
            <div className="glass-card p-4 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Best Score</h3>
              <div className="text-3xl font-black text-green-500">{bestScore}</div>
            </div>
            <div className="glass-card p-4 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Projected Views</h3>
              <div className="text-3xl font-black text-blue-500">{(totalViews / 1000).toFixed(1)}k</div>
            </div>
            <div className="glass-card p-4 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Generated</h3>
              <div className="text-3xl font-black text-accent">{chartData.length}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="glass-card p-4 border-l-4 border-l-primary">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Top Performing Topic</h3>
               <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{topTopic}</div>
             </div>
             <div className="glass-card p-4 border-l-4 border-l-accent">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Most Used Category</h3>
               <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{mostUsed}</div>
             </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Virality Score Bar Chart */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">Virality Scores Over Time</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#8b5cf6' }}
                    />
                    <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Projected Views Line Chart */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">Projected Views</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
