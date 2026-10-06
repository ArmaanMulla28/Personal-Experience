import React from 'react';
import { LayoutDashboard, BookOpen, PlusCircle, Layers, Database } from 'lucide-react';

export default function Sidebar({ currentTab, setTab, experienceCount }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'experiences',
      label: 'Experiences',
      icon: BookOpen,
      count: experienceCount,
    },
    {
      id: 'add-experience',
      label: 'Add Experience',
      icon: PlusCircle,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/40 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* DSA Academic Structure Preview */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Layers className="h-4 w-4 text-purple-400" />
            <span>Java DSA Modules</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Prepared in <code className="text-indigo-300">com.lifelog.dsa</code>:
          </p>
          <ul className="text-[11px] space-y-1.5 text-slate-400">
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
              <span>1. Custom Linked List</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
              <span>2. Custom Stack</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
              <span>3. Custom Queue</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
              <span>4. Binary Search Tree</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
              <span>5. Priority Queue / Max Heap</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-3 rounded-lg border border-slate-800/60 bg-slate-900/20 text-[11px] text-slate-400 flex items-center gap-2">
        <Database className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>PostgreSQL schema: <span className="text-slate-300">experiences</span></span>
      </div>
    </aside>
  );
}
