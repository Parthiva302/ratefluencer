import React, { useState } from 'react';
import { Copy, Check, ArrowRight, PenTool } from 'lucide-react';
import { copyToClipboard } from '../utils/copy';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ScriptPanel = ({ script, loading, onContinue, onCopySuccess }) => {
  const [copiedSection, setCopiedSection] = useState(null);

  const handleCopy = async (text, section) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedSection(section);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 animate-in fade-in zoom-in-95 duration-500">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <span className="animate-pulse">✍️</span> Writing Script...
        </h2>
        <div className="space-y-4">
          <Skeleton height={80} baseColor="#1e293b" highlightColor="#334155" borderRadius="0.75rem" />
          <Skeleton height={120} baseColor="#1e293b" highlightColor="#334155" borderRadius="0.75rem" />
          <Skeleton height={60} baseColor="#1e293b" highlightColor="#334155" borderRadius="0.75rem" />
        </div>
      </div>
    );
  }

  if (!script) return null;

  return (
    <div className="glass-card p-6 animate-in fade-in zoom-in-95 duration-500">
      <h2 className="text-xl font-bold mb-6 flex items-center justify-between text-slate-800 dark:text-slate-100">
        <div className="flex items-center gap-2">
          <PenTool className="text-primary" size={24} />
          Generated Script
        </div>
        <button onClick={() => handleCopy(JSON.stringify(script), 'all')} className="text-sm font-semibold text-primary hover:text-indigo-400 flex items-center gap-1 transition-colors">
          <Copy size={16} /> Copy Script
        </button>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="text-xs font-bold text-primary mb-2 flex justify-between">
              HOOK (0-3s)
              <span className="text-slate-400 font-normal">Grab attention immediately</span>
            </div>
            <p className="text-lg font-bold leading-relaxed text-slate-800 dark:text-slate-100">{script.hook}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-secondary dark:bg-indigo-500" />
            <div className="text-xs font-bold text-secondary dark:text-indigo-300 mb-2 flex justify-between">
              MAIN CONTENT (3-45s)
              <span className="text-slate-400 font-normal">Deliver the value</span>
            </div>
            <ul className="space-y-4">
              {script.content?.map((line, i) => (
                <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/10 dark:bg-indigo-500/20 text-secondary dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                    {i+1}
                  </span>
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <div className="text-xs font-bold text-amber-500 mb-2 flex justify-between">
              CALL TO ACTION (45-60s)
              <span className="text-slate-400 font-normal">Drive engagement</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{script.cta}</p>
          </div>
        </div>

        {/* Thumbnail Preview Visual */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Reel Thumbnail Preview
            </div>
            <div className="aspect-[9/16] w-full max-w-[280px] mx-auto bg-slate-900 rounded-[2rem] border-[8px] border-slate-800 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center">
              {/* Fake Background Blur */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 blur-xl opacity-50" />
              
              {/* Hook Overlay Text */}
              <div className="relative z-10 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
                <h3 className="text-xl font-black text-white leading-tight uppercase" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
                  {script.hook?.substring(0, 50)}{script.hook?.length > 50 ? '...' : ''}
                </h3>
              </div>
              
              {/* Fake UI Overlays */}
              <div className="absolute bottom-6 right-4 flex flex-col gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-full backdrop-blur flex items-center justify-center"><span className="text-white text-xs">🤍</span></div>
                <div className="w-8 h-8 bg-white/20 rounded-full backdrop-blur flex items-center justify-center"><span className="text-white text-xs">💬</span></div>
                <div className="w-8 h-8 bg-white/20 rounded-full backdrop-blur flex items-center justify-center"><span className="text-white text-xs">↗️</span></div>
              </div>
              <div className="absolute bottom-6 left-4 flex flex-col gap-2">
                <div className="w-24 h-3 bg-white/30 rounded-full backdrop-blur"></div>
                <div className="w-32 h-2 bg-white/20 rounded-full backdrop-blur"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {onContinue && (
        <div className="mt-8 flex justify-end">
          <button onClick={onContinue} className="btn-primary flex items-center gap-2">
            Continue to Caption <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ScriptPanel;
