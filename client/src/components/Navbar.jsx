import React from 'react';
import {
  Compass, ShieldCheck, AlertCircle, Sun, Moon, Menu, X
} from 'lucide-react';

export default function Navbar({
  health,
  onRefreshHealth,
  theme = 'dark',
  onToggleTheme,
  isMobileMenuOpen,
  onToggleMobileMenu,
}) {
  const isHealthy = health && health.status === 'ok';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          aria-label="Toggle Navigation Drawer"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">LifeLog</h1>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              DSA Project
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">Personal Experience Tracker</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-400" />
          )}
        </button>

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
                <span className="hidden md:inline">Backend: {health.application}</span>
                <span className="md:hidden">Online</span>
              </span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Backend: Disconnected</span>
                <span className="md:hidden">Offline</span>
              </span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
