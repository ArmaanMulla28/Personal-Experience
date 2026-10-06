import React from 'react';
import { Activity, ShieldCheck, AlertCircle, Compass } from 'lucide-react';

export default function Navbar({ health, onRefreshHealth }) {
  const isHealthy = health && health.status === 'ok';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">LifeLog</h1>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              DSA Project
            </span>
          </div>
          <p className="text-xs text-slate-400">Personal Experience Tracker</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Backend status indicator */}
        <button
          onClick={onRefreshHealth}
          title="Click to re-check backend connection"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer bg-slate-900 border-slate-700/60 hover:border-slate-600"
        >
          {isHealthy ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Backend: {health.application} ({health.status})
              </span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Backend: Disconnected / Retrying
              </span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
