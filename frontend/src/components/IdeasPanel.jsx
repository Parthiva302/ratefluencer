import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Lightbulb } from 'lucide-react';

const IdeasPanel = ({ ideas, onSelectIdea, loading }) => {
  if (loading) {
    return (
      <div className="glass-card p-6 animate-in fade-in zoom-in-95 duration-500">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="animate-pulse">🧠</span> Generating Content Angle...
        </h2>
        <div className="flex flex-col gap-3">
          <Skeleton height={60} baseColor="#1e293b" highlightColor="#334155" borderRadius="0.75rem" />
          <Skeleton height={60} baseColor="#1e293b" highlightColor="#334155" borderRadius="0.75rem" />
          <Skeleton height={60} baseColor="#1e293b" highlightColor="#334155" borderRadius="0.75rem" />
        </div>
      </div>
    );
  }

  if (!ideas || ideas.length === 0) return null;

  return (
    <div className="glass-card p-6 animate-in fade-in zoom-in-95 duration-500">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <Lightbulb className="text-amber-500" size={24} />
        Select a Content Angle
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea, i) => (
          <button
            key={i}
            onClick={() => onSelectIdea(idea)}
            className="text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-secondary p-5 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-slate-700 dark:text-slate-200 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/10 dark:bg-indigo-500/20 text-secondary dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-indigo-300">Angle {i + 1}</span>
            </div>
            <span className="leading-relaxed">{idea}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IdeasPanel;
