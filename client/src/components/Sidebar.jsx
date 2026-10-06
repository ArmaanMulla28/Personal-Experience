import React from 'react';
import {
  LayoutDashboard, BookOpen, PlusCircle,
  GitCommit, Clock, Layers, Trophy, Search, Database,
  BarChart3, Sparkles
} from 'lucide-react';

export default function Sidebar({ currentTab, setTab, experienceCount }) {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'experiences', label: 'Experiences', icon: BookOpen, count: experienceCount },
    { id: 'add-experience', label: 'Add Experience', icon: PlusCircle },
  ];

  const phase5Nav = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'Insights' },
    { id: 'memory-lane', label: 'Memory Lane', icon: Sparkles, badge: 'Signature' },
  ];

  const dsaNav = [
    { id: 'timeline', label: 'Timeline', icon: GitCommit, badge: 'Linked List' },
    { id: 'pending-queue', label: 'Pending Queue', icon: Layers, badge: 'Queue (FIFO)' },
    { id: 'top-rated', label: 'Top Rated', icon: Trophy, badge: 'Max Heap' },
    { id: 'bst-lookup', label: 'BST Fast Lookup', icon: Search, badge: 'BST' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
      <div className="space-y-6">
        {/* Main Section */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Navigation
          </p>
          <nav className="mt-2 space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Phase 5: Intelligence & Memories */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Intelligence & Memories
          </p>
          <nav className="mt-2 space-y-1">
            {phase5Nav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-amber-400/80 border border-slate-800 font-mono">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* DSA Features Section */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Java DSA Views
          </p>
          <nav className="mt-2 space-y-1">
            {dsaNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Backend Status footer */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl border border-slate-800/60 bg-slate-900/40 text-[11px] text-slate-400 flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>PostgreSQL + Custom Java DSA</span>
        </div>
      </div>
    </aside>
  );
}
