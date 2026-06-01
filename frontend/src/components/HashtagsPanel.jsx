import React, { useState } from 'react';
import { Copy, Check, TrendingUp, ArrowRight } from 'lucide-react';
import { copyToClipboard } from '../utils/copy';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HashtagsPanel = ({ hashtags, loading, onContinue, onCopySuccess }) => {
  const [copiedGroup, setCopiedGroup] = useState(null);
  const [copiedTag, setCopiedTag] = useState(null);

  const handleCopyGroup = async (tags, groupName) => {
    if (!tags || tags.length === 0) return;
    const success = await copyToClipboard(tags.join(' '));
    if (success) {
      setCopiedGroup(groupName);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopiedGroup(null), 2000);
    }
  };

  const handleCopyTag = async (tag) => {
    const success = await copyToClipboard(tag);
    if (success) {
      setCopiedTag(tag);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopiedTag(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 animate-in fade-in zoom-in-95 duration-500">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <span className="animate-pulse">#️⃣</span> Generating Hashtags...
        </h2>
        <div className="flex flex-wrap gap-2">
          <Skeleton height={30} width={80} borderRadius="1rem" baseColor="#1e293b" highlightColor="#334155" />
          <Skeleton height={30} width={120} borderRadius="1rem" baseColor="#1e293b" highlightColor="#334155" />
          <Skeleton height={30} width={100} borderRadius="1rem" baseColor="#1e293b" highlightColor="#334155" />
        </div>
      </div>
    );
  }

  if (!hashtags) return null;

  const renderColumn = (title, tags, groupName, colorClass, borderClass, bgClass) => (
    <div className={`p-5 rounded-xl border ${bgClass} ${borderClass} hover:shadow-md transition-all flex flex-col`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${colorClass}`}>{title}</h3>
        <button 
          onClick={() => handleCopyGroup(tags, groupName)}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md text-xs font-medium transition-colors border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300"
        >
          {copiedGroup === groupName ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          Copy All
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 flex-grow">
        {tags?.map((tag, i) => (
          <span 
            key={i} 
            onClick={() => handleCopyTag(tag)}
            className={`cursor-pointer border px-3 py-1.5 rounded-full text-xs font-medium transition-transform hover:scale-105 active:scale-95 flex items-center gap-1 ${bgClass} ${borderClass} text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800`}
            title="Click to copy"
          >
            {copiedTag === tag ? <Check size={12} className="text-green-500" /> : null}
            {tag}
          </span>
        ))}
      </div>
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-auto pt-2 border-t border-slate-200 dark:border-slate-700/50">
        {tags?.length || 0} tags generated
      </div>
    </div>
  );

  return (
    <div className="glass-card p-6 animate-in fade-in zoom-in-95 duration-500">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        #️⃣ Hashtag Strategy
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderColumn('High Reach', hashtags.high, 'high', 'text-amber-500', 'border-amber-200 dark:border-amber-700/50', 'bg-amber-50 dark:bg-amber-900/10')}
        {renderColumn('Medium Reach', hashtags.medium, 'medium', 'text-slate-500 dark:text-slate-300', 'border-slate-200 dark:border-slate-600', 'bg-slate-100 dark:bg-slate-800/40')}
        {renderColumn('Low Competition', hashtags.low, 'low', 'text-green-600 dark:text-green-500', 'border-green-200 dark:border-green-800/40', 'bg-green-50 dark:bg-green-900/10')}
      </div>

      {onContinue && (
        <div className="mt-8 flex justify-end">
          <button onClick={onContinue} className="btn-primary w-full md:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-accent to-pink-600 hover:from-pink-600 hover:to-accent shadow-accent/30">
            <TrendingUp size={18} /> Predict Virality
          </button>
        </div>
      )}
    </div>
  );
};

export default HashtagsPanel;
