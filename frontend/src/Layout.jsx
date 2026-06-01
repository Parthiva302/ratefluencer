import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, BarChart3, Sparkles } from 'lucide-react';

const SidebarLayout = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            <Sparkles className="text-primary" size={24} />
            RateFluencer
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary dark:text-primary dark:bg-primary/20 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent" />
            <div>
              <div className="text-sm font-bold">Creator Pro</div>
              <div className="text-xs text-slate-500">Active Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
          <Link to="/" className="flex items-center gap-2 font-black text-primary">
            <Sparkles size={20} />
            RateFluencer
          </Link>
          <div className="flex gap-2">
             {/* Simple mobile nav links */}
             <Link to="/dashboard" className="p-2"><LayoutDashboard size={20}/></Link>
             <Link to="/history" className="p-2"><History size={20}/></Link>
             <Link to="/analytics" className="p-2"><BarChart3 size={20}/></Link>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;
