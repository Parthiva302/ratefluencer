import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Video, TrendingUp, BarChart } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          <Sparkles className="text-primary" size={28} />
          RateFluencer
        </div>
        <Link to="/dashboard" className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full font-semibold hover:shadow-lg transition-all">
          Login
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          RateFluencer Studio 2.0 is Live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          The Data-Driven <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent">
            Viral Content Engine
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
          Generate highly optimized scripts, captions, and hashtags backed by live search trends and predictive AI analytics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300 mb-16">
          <Link to="/dashboard" className="btn-primary py-4 px-8 text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/30">
            Start Generating Free <ArrowRight size={20} />
          </Link>
          <button className="px-8 py-4 text-lg font-bold rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            View Demo
          </button>
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full border-y border-slate-200 dark:border-slate-800 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-400">
          <div className="text-center">
            <div className="text-3xl font-black text-slate-800 dark:text-white">50k+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Scripts Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-slate-800 dark:text-white">2M+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Predicted Views</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-slate-800 dark:text-white">87%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Virality Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-slate-800 dark:text-white">10x</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Faster Growth</div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-24 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
          <div className="glass-card p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Live Trend Analysis</h3>
            <p className="text-slate-600 dark:text-slate-400">Pulls real-time search velocity to guarantee you are creating content people are actively searching for.</p>
          </div>
          <div className="glass-card p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
              <Video size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Full Script Generation</h3>
            <p className="text-slate-600 dark:text-slate-400">Creates perfect hook-body-CTA structures designed specifically for TikTok and Reels retention.</p>
          </div>
          <div className="glass-card p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 flex items-center justify-center mb-4">
              <BarChart size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Virality Predictor</h3>
            <p className="text-slate-600 dark:text-slate-400">AI scores your content's viral potential and projects estimated views before you even post.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
