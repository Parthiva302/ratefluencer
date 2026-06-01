import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Flame } from 'lucide-react';

const TrendsPanel = ({ trends, onSelectTrend, loading }) => {
  if (loading) {
    return (
      <div className="glass-card p-6 animate-in fade-in zoom-in-95 duration-500">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="animate-pulse">🔍</span> Finding Trends...
        </h2>
        <div className="flex flex-wrap gap-3">
          <Skeleton width={120} height={40} borderRadius="9999px" baseColor="#1e293b" highlightColor="#334155" />
          <Skeleton width={150} height={40} borderRadius="9999px" baseColor="#1e293b" highlightColor="#334155" />
          <Skeleton width={100} height={40} borderRadius="9999px" baseColor="#1e293b" highlightColor="#334155" />
          <Skeleton width={180} height={40} borderRadius="9999px" baseColor="#1e293b" highlightColor="#334155" />
        </div>
      </div>
    );
  }

  if (!trends || trends.length === 0) return null;

  return (
    <div className="glass-card p-6 animate-in fade-in zoom-in-95 duration-500">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <Flame className="text-accent" size={24} /> 
        Select a Trending Topic
      </h2>
      <div className="flex flex-wrap gap-3">
        {trends.map((trend, i) => (
          <button
            key={i}
            onClick={() => onSelectTrend(trend)}
            className="group flex items-center gap-2 bg-white dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-primary/20 border border-slate-200 dark:border-slate-700 hover:border-primary px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm text-slate-700 dark:text-slate-200"
          >
            <span className="text-accent group-hover:animate-pulse">🔥</span> 
            {trend}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendsPanel;
