import React, { useState, useEffect } from 'react';
import {
  BookOpen, Star, Award, Server, CheckCircle2,
  Calendar, Layers, Clock, Trophy, PlusCircle, ArrowRight
} from 'lucide-react';
import {
  fetchTimeline, fetchRecentlyViewed,
  fetchPendingExperiences, fetchTopExperiences
} from '../services/api';

export default function Dashboard({ experiences, health, onNavigate, onSelectExperience }) {
  const [recentStack, setRecentStack] = useState([]);
  const [topHeap, setTopHeap] = useState([]);
  const [pendingQueue, setPendingQueue] = useState([]);
  const [timelineNodes, setTimelineNodes] = useState([]);

  useEffect(() => {
    // Fetch live DSA data for dashboard widgets
    fetchRecentlyViewed(4).then(data => setRecentStack(data || [])).catch(() => {});
    fetchTopExperiences(3).then(data => setTopHeap(data || [])).catch(() => {});
    fetchPendingExperiences().then(data => setPendingQueue(data || [])).catch(() => {});
    fetchTimeline().then(data => setTimelineNodes(data || [])).catch(() => {});
  }, [experiences]);

  const totalCount = experiences.length;
  const avgRating = totalCount > 0
    ? (experiences.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalCount).toFixed(1)
    : '0.0';

  const projectsCount = experiences.filter(e => e.category?.toLowerCase() === 'projects').length;
  const competitionsCount = experiences.filter(e => e.category?.toLowerCase() === 'competitions' || e.category?.toLowerCase() === 'hackathons').length;
  const workshopsCount = experiences.filter(e => e.category?.toLowerCase() === 'workshops').length;
  const achievementsCount = experiences.filter(e => e.category?.toLowerCase() === 'achievements').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">LifeLog Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">
            Personal Experience Tracker powered by 5 custom Java Data Structures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('memory-lane')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            <span>✨</span>
            <span>Memory Lane</span>
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <span>📊</span>
            <span>Analytics</span>
          </button>
          <button
            onClick={() => onNavigate('add-experience')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Add Experience
          </button>
        </div>
      </div>

      {/* Phase 5 Signature Feature Flash Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-lg shrink-0">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Memory Lane Flashback</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">Phase 5</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Reflect on past anniversaries and historical milestones logged on this calendar day.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('memory-lane')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shrink-0 cursor-pointer shadow"
        >
          <span>Explore Memory Lane</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Category & Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
          <p className="text-2xl font-extrabold text-slate-100 mt-1">{totalCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">Projects</span>
          <p className="text-2xl font-extrabold text-indigo-300 mt-1">{projectsCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Competitions</span>
          <p className="text-2xl font-extrabold text-purple-300 mt-1">{competitionsCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">Workshops</span>
          <p className="text-2xl font-extrabold text-cyan-300 mt-1">{workshopsCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Achievements</span>
          <p className="text-2xl font-extrabold text-emerald-300 mt-1">{achievementsCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Avg Rating</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-1 flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400" />
            {avgRating}
          </p>
        </div>
      </div>

      {/* DSA Active Showcase Cards (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Widget 1: Recently Viewed (Stack - LIFO) */}
        <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">Recently Viewed</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Custom Stack (LIFO)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Top of the stack contains the most recently opened items.
            </p>

            <div className="mt-4 space-y-2">
              {recentStack.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  No recently viewed items. Click any experience card to push it onto the stack!
                </p>
              ) : (
                recentStack.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectExperience(item)}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/40 transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-purple-400 font-mono">
                        {idx === 0 ? 'TOP' : `#${idx + 1}`}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 truncate">{item.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 shrink-0">{item.category}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('experiences')}
            className="mt-4 inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
          >
            Browse all to view more <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Widget 2: Top Rated (Max Heap) */}
        <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">Top Rated Experiences</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Custom Max Heap
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Root elements extracted in descending order of rating/importance.
            </p>

            <div className="mt-4 space-y-2">
              {topHeap.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  No rated experiences logged yet.
                </p>
              ) : (
                topHeap.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectExperience(item)}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-xs">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{item.rating}/5</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('top-rated')}
            className="mt-4 inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            View full Max Heap leaderboard <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Widget 3: Timeline Preview (Linked List) */}
        <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-100">Timeline Preview</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Custom Linked List
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Chronological chain with O(1) head and tail insertions.
            </p>

            <div className="mt-4 space-y-2">
              {timelineNodes.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectExperience(item)}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition cursor-pointer flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-slate-200 truncate">{item.title}</span>
                  <span className="text-[11px] text-slate-500 shrink-0">{item.date || 'Undated'}</span>
                </div>
              ))}
              {timelineNodes.length === 0 && (
                <p className="text-xs text-slate-500 italic py-2">Timeline is empty.</p>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('timeline')}
            className="mt-4 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
          >
            Open full interactive timeline <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Widget 4: Pending Documentation Queue (Queue - FIFO) */}
        <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">Pending Queue</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Custom Queue (FIFO)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              First item in is the next to be documented and processed.
            </p>

            <div className="mt-4 space-y-2">
              {pendingQueue.slice(0, 3).map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">
                      {idx === 0 ? 'FRONT' : `#${idx + 1}`}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 truncate">{item.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">{item.category}</span>
                </div>
              ))}
              {pendingQueue.length === 0 && (
                <p className="text-xs text-slate-500 italic py-2">Queue is empty. All items documented!</p>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('pending-queue')}
            className="mt-4 inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
          >
            Manage pending documentation <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
