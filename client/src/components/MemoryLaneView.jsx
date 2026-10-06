import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, ArrowRight, RefreshCw, Star, MapPin } from 'lucide-react';
import { fetchMemoryLane } from '../services/api';

export function MemoryLaneView({ onViewDetails, onNavigate }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [filterType, setFilterType] = useState('ALL');

  const loadMemories = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMemoryLane(date);
      setMemories(res);
    } catch (err) {
      setError(err.message || 'Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories(selectedDate);
  }, [selectedDate]);

  const filteredMemories = memories.filter((m) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'ANNIVERSARY') return m.memoryType === 'EXACT_DAY_ANNIVERSARY';
    if (filterType === 'MONTH') return m.memoryType === 'SAME_MONTH_REFLECTION';
    if (filterType === 'HIGHLIGHT') return m.memoryType === 'STANDOUT_ACHIEVEMENT';
    if (filterType === 'GENESIS') return m.memoryType === 'ORIGIN_MILESTONE';
    return true;
  });

  const getMemoryBadge = (type, label) => {
    switch (type) {
      case 'EXACT_DAY_ANNIVERSARY':
        return {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          icon: '🎉',
          tag: label || 'Anniversary Flashback',
        };
      case 'SAME_MONTH_REFLECTION':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: '📅',
          tag: label || 'Monthly Memory',
        };
      case 'ORIGIN_MILESTONE':
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: '🌱',
          tag: label || 'Genesis Milestone',
        };
      case 'STANDOUT_ACHIEVEMENT':
      default:
        return {
          bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          icon: '⭐',
          tag: label || 'Standout Achievement',
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-orange-950/40 to-slate-900 text-white p-6 sm:p-8 border border-amber-500/30 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30 uppercase tracking-wider">
              Signature LifeLog Feature
            </span>
            <span className="text-slate-400 text-xs font-medium">Memory Lane & Flashbacks</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-100">
            On This Day in History
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Revisit milestones and memories logged across previous months and years.
            Opening a memory automatically pushes it into your custom Java LIFO Recently Viewed Stack.
          </p>

          {/* Date Picker Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Reference Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-slate-100 font-mono font-medium focus:outline-none cursor-pointer text-xs"
              />
            </div>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow"
            >
              Today
            </button>
          </div>
        </div>

        {/* Decorative blur circle */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Memories', icon: '✨' },
            { id: 'ANNIVERSARY', label: 'Anniversaries', icon: '🎉' },
            { id: 'MONTH', label: 'Same Month', icon: '📅' },
            { id: 'HIGHLIGHT', label: '5-Star Standouts', icon: '⭐' },
            { id: 'GENESIS', label: 'Genesis Origins', icon: '🌱' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                filterType === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-500 font-mono">
          {filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'}
        </span>
      </div>

      {/* Content State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-rose-300 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Error loading Memory Lane</h3>
            <p className="text-xs text-rose-400 mt-1">{error}</p>
          </div>
          <button
            onClick={() => loadMemories(selectedDate)}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-500 font-semibold text-xs transition"
          >
            Retry
          </button>
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="text-center py-12 rounded-3xl border border-dashed border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center text-2xl mx-auto">
            ⏳
          </div>
          <h3 className="text-base font-bold text-slate-200">No Memories Found for This Date</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No logged milestones align with this reference date. Try selecting another date or log more experiences!
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={() => setFilterType('ALL')}
              className="px-3.5 py-1.5 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700 transition cursor-pointer"
            >
              Show All Memories
            </button>
            <button
              onClick={() => onNavigate('experiences')}
              className="px-3.5 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-500 transition cursor-pointer"
            >
              Browse All Experiences
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMemories.map((m) => {
            const badge = getMemoryBadge(m.memoryType, m.milestoneLabel);
            return (
              <div
                key={m.experienceId}
                className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition flex flex-col justify-between space-y-3 group"
              >
                {/* Top Badge & Time Ago */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border flex items-center gap-1.5 ${badge.bg}`}
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.tag}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 font-mono">
                    {m.daysAgo}d ago ({m.experienceDate})
                  </span>
                </div>

                {/* Title & Category */}
                <div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition">
                    {m.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 font-semibold text-[11px]">
                      {m.category}
                    </span>
                    <span className="flex items-center text-amber-400 font-bold">
                      {'★'.repeat(m.rating || 5)} ({m.rating}/5)
                    </span>
                    {m.location && <span>📍 {m.location}</span>}
                  </div>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {m.description || 'No description recorded.'}
                </p>

                {/* Nostalgic Prompt Box */}
                {m.reflectionPrompt && (
                  <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-2xl text-[11px] text-amber-200">
                    <span className="font-bold block text-amber-300 mb-0.5">💡 Nostalgic Reflection</span>
                    <p className="italic text-slate-300">{m.reflectionPrompt}</p>
                  </div>
                )}

                {/* Action button */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID #{m.experienceId} • Pushes to LIFO Stack
                  </span>
                  <button
                    onClick={() =>
                      onViewDetails({
                        id: m.experienceId,
                        title: m.title,
                        category: m.category,
                        description: m.description,
                        location: m.location,
                        experienceDate: m.experienceDate,
                        rating: m.rating,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow"
                  >
                    <span>View Memory</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
