import React, { useState } from 'react';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { copyToClipboard } from '../utils/copy';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CaptionPanel = ({ caption, loading, onContinue, onCopySuccess }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!caption) return;
    const success = await copyToClipboard(caption);
    if (success) {
      setCopied(true);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 animate-in fade-in zoom-in-95 duration-500">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <span className="animate-pulse">📢</span> Creating Caption...
        </h2>
        <div className="space-y-4">
          <Skeleton height={20} width="80%" baseColor="#1e293b" highlightColor="#334155" />
          <Skeleton height={20} width="95%" baseColor="#1e293b" highlightColor="#334155" />
          <Skeleton height={20} width="60%" baseColor="#1e293b" highlightColor="#334155" />
        </div>
      </div>
    );
  }

  if (!caption) return null;

  return (
    <div className="glass-card p-6 h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        ✍️ Caption
      </h2>
      
      <div className="relative flex-grow">
        <div className="bg-slate-100 dark:bg-slate-800/50 h-full p-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 whitespace-pre-wrap hover:shadow-md transition-shadow">
          {caption}
        </div>
        
        <button 
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors border border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 shadow-sm"
        >
          {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="flex justify-between items-center mt-6">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {caption.length} characters
        </span>
        {onContinue && (
          <button onClick={onContinue} className="btn-primary flex items-center gap-2 py-2">
            Continue to Hashtags <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CaptionPanel;
