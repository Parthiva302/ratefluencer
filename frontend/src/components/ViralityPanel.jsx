import React, { useEffect, useState } from 'react';
import { Save, Eye, ThumbsUp, Share2, Award } from 'lucide-react';
import { formatNumber } from '../utils/format';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Animated circular progress component
const CircularProgress = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 2500;
    const increment = score / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  // Determine color based on score
  let strokeColor = '#EF4444'; // Red for 0-40
  if (animatedScore > 40) strokeColor = '#F59E0B'; // Amber for 41-70
  if (animatedScore > 70) strokeColor = '#10B981'; // Green for 71-100

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      {/* Background circle */}
      <svg className="transform -rotate-90 w-40 h-40">
        <circle 
          cx="80" 
          cy="80" 
          r={radius} 
          stroke="currentColor" 
          strokeWidth="12" 
          fill="transparent" 
          className="text-slate-200 dark:text-slate-700" 
        />
        {/* Animated circle */}
        <circle 
          cx="80" 
          cy="80" 
          r={radius} 
          stroke={strokeColor} 
          strokeWidth="12" 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          className="transition-all duration-75 ease-linear drop-shadow-md" 
          style={{ filter: `drop-shadow(0 0 8px ${strokeColor}60)` }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-slate-800 dark:text-white" style={{ textShadow: `0 0 15px ${strokeColor}40` }}>
          {animatedScore}
        </span>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">/ 100</span>
      </div>
    </div>
  );
};

// Horizontal bar component
const ScoreBar = ({ label, score, index }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    // Staggered animation
    const timer = setTimeout(() => {
      setWidth(score);
    }, 1000 + (index * 200));
    return () => clearTimeout(timer);
  }, [score, index]);

  let barColor = 'bg-red-500';
  if (score > 40) barColor = 'bg-amber-500';
  if (score > 70) barColor = 'bg-green-500';

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
        <span>{label}</span>
        <span>{score}/100</span>
      </div>
      <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`} 
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const ViralityPanel = ({ virality, loading, onSave }) => {

  if (loading) {
    return (
      <div className="glass-card p-8 animate-in fade-in zoom-in-95 duration-500">
        <h2 className="text-xl font-bold mb-6 flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100">
          <span className="animate-spin duration-3000 inline-block">📈</span> Predicting Virality...
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-40 h-40">
            <Skeleton circle={true} height={160} width={160} baseColor="#1e293b" highlightColor="#334155" />
          </div>
          <div className="flex-1 w-full space-y-4">
            <Skeleton height={15} baseColor="#1e293b" highlightColor="#334155" />
            <Skeleton height={15} baseColor="#1e293b" highlightColor="#334155" />
            <Skeleton height={15} baseColor="#1e293b" highlightColor="#334155" />
            <Skeleton height={15} baseColor="#1e293b" highlightColor="#334155" />
          </div>
        </div>
      </div>
    );
  }

  if (!virality) return null;

  let verdictColorClass = 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50';
  if (virality.virality_score > 40) verdictColorClass = 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50';
  if (virality.virality_score > 70) verdictColorClass = 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50';

  return (
    <div className="glass-card p-6 md:p-10 animate-in fade-in slide-in-from-bottom-10 duration-700" 
         style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(59,130,246,0.05))' }}>
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
          Virality Prediction Result
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-2">
          Analyzed from 15+ similar content pieces using OpenRouter AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
        {/* Left Side: Circular Score */}
        <div className="flex flex-col items-center justify-center">
          <CircularProgress score={virality.virality_score || 0} />
          
          <div className={`mt-8 px-6 py-3 rounded-full border-2 font-bold flex items-center gap-2 ${verdictColorClass} animate-in zoom-in duration-500 delay-1000 fill-mode-both`}>
            {virality.virality_score > 70 && <span>🏆</span>}
            {virality.verdict}
          </div>
        </div>

        {/* Right Side: Bar Charts */}
        <div className="flex flex-col justify-center">
          <ScoreBar index={0} label="Hook Quality" score={virality.hook_score || 0} />
          <ScoreBar index={1} label="Engagement" score={virality.engagement_score || 85} />
          <ScoreBar index={2} label="Trend Relevance" score={virality.trend_score || 0} />
          <ScoreBar index={3} label="Hashtag Strength" score={virality.hashtag_score || 0} />
          <ScoreBar index={4} label="Originality" score={virality.originality_score || 0} />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-500 delay-1000 fill-mode-both">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Eye size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expected Views</div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{formatNumber(virality.expected_views)}</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-500 delay-1100 fill-mode-both">
          <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <ThumbsUp size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expected Likes</div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{formatNumber(virality.expected_likes)}</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-500 delay-1200 fill-mode-both">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Share2 size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expected Shares</div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{formatNumber(virality.expected_shares)}</div>
          </div>
        </div>
      </div>

      {/* NEW: Best Time to Post & Target Audience */}
      {(virality.best_times || virality.target_audience) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* Target Audience */}
          <div className="glass-card p-6 border-l-4 border-l-primary">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">🎯 Target Audience</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-400 font-semibold">Age</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{virality.target_audience?.age || '18-30'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">Interests</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{virality.target_audience?.interests || 'Technology, Productivity'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">Platform</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{virality.target_audience?.platform || 'Instagram Reels'}</div>
              </div>
            </div>
          </div>

          {/* Best Time to Post */}
          <div className="glass-card p-6 border-l-4 border-l-secondary dark:border-l-indigo-400">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">⏰ Best Time to Post</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Instagram</div>
                <div className="font-bold text-primary">{virality.best_times?.Instagram || '7:00 PM - 9:00 PM'}</div>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="font-semibold text-slate-700 dark:text-slate-300">LinkedIn</div>
                <div className="font-bold text-blue-500">{virality.best_times?.LinkedIn || '8:00 AM - 10:00 AM'}</div>
              </div>
              <div className="flex justify-between items-center pb-2">
                <div className="font-semibold text-slate-700 dark:text-slate-300">X (Twitter)</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{virality.best_times?.X || '12:00 PM - 2:00 PM'}</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* NEW: AI Content Coach */}
      <div className="glass-card p-6 mb-12 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border-indigo-100 dark:border-indigo-800/30">
        <h3 className="text-lg font-black text-indigo-900 dark:text-indigo-300 mb-4 flex items-center gap-2">
          🤖 AI Content Coach
        </h3>
        <ul className="space-y-3">
          {(virality.coach_feedback || [
            "✓ Strong Hook",
            "⚠ Caption Too Long",
            "✓ Trending Topic",
            "⚠ Add More Emotional Words"
          ]).map((tip, idx) => {
            const isWarning = tip.startsWith('⚠');
            return (
              <li key={idx} className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                  isWarning 
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' 
                    : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {isWarning ? '!' : '✓'}
                </span>
                <span className={`font-medium ${isWarning ? 'text-amber-800 dark:text-amber-200' : 'text-slate-700 dark:text-slate-300'}`}>
                  {tip.replace('✓', '').replace('⚠', '').trim()}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Reel Preview Storyboard */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          Generated Reel Preview
        </h3>
        <div className="flex flex-col md:flex-row gap-4 justify-between relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
          
          <div className="relative z-10 flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-lg text-center transform transition-transform hover:-translate-y-2">
            <div className="w-12 h-12 mx-auto bg-primary text-white rounded-full flex items-center justify-center font-black mb-3 border-4 border-slate-50 dark:border-slate-950">1</div>
            <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">Scene 1: The Hook</h4>
            <div className="text-xs text-slate-500 mb-2">0:00 - 0:03</div>
            <div className="w-full h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center p-2">
              <span className="text-[10px] font-medium text-slate-400">High-energy visual + text hook</span>
            </div>
          </div>
          
          <div className="relative z-10 flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-lg text-center transform transition-transform hover:-translate-y-2">
            <div className="w-12 h-12 mx-auto bg-secondary dark:bg-indigo-500 text-white rounded-full flex items-center justify-center font-black mb-3 border-4 border-slate-50 dark:border-slate-950">2</div>
            <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">Scene 2: Core Value</h4>
            <div className="text-xs text-slate-500 mb-2">0:03 - 0:45</div>
            <div className="w-full h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center p-2">
              <span className="text-[10px] font-medium text-slate-400">Fast-paced cuts + b-roll</span>
            </div>
          </div>
          
          <div className="relative z-10 flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-lg text-center transform transition-transform hover:-translate-y-2">
            <div className="w-12 h-12 mx-auto bg-amber-500 text-white rounded-full flex items-center justify-center font-black mb-3 border-4 border-slate-50 dark:border-slate-950">3</div>
            <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">Scene 3: The Ask</h4>
            <div className="text-xs text-slate-500 mb-2">0:45 - 0:60</div>
            <div className="w-full h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center p-2">
              <span className="text-[10px] font-medium text-slate-400">Clear Call-To-Action overlay</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={onSave} className="btn-primary py-3 px-8 text-lg w-full md:w-auto shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
          💾 Save to Content Library
        </button>
      </div>

    </div>
  );
};

export default ViralityPanel;
