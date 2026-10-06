import React, { useState, useEffect } from 'react';
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
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: '🎉',
          tag: label || 'Anniversary Flashback',
        };
      case 'SAME_MONTH_REFLECTION':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: '📅',
          tag: label || 'Monthly Memory',
        };
      case 'ORIGIN_MILESTONE':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: '🌱',
          tag: label || 'Genesis Milestone',
        };
      case 'STANDOUT_ACHIEVEMENT':
      default:
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: '⭐',
          tag: label || 'Standout Achievement',
        };
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-8 md:p-10 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Signature LifeLog Feature
            </span>
            <span className="text-amber-100 text-xs font-medium">Memory Lane & Nostalgia</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            On This Day in History
          </h1>
          <p className="text-amber-100 text-sm md:text-base leading-relaxed">
            Revisit personal milestones, anniversaries, and standout achievements from your journey.
            Viewing a memory automatically records it in your custom Java LIFO Recently Viewed Stack.
          </p>

          {/* Date Picker Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-3 py-1.5 text-sm">
              <span className="text-white/80 text-xs font-semibold uppercase">Reference Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              />
            </div>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-3 py-1.5 bg-white text-orange-700 hover:bg-amber-50 font-bold text-xs rounded-xl shadow transition"
            >
              Today
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-6 w-48 h-48 bg-amber-400/20 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Memories', icon: '✨' },
            { id: 'ANNIVERSARY', label: 'Exact Anniversaries', icon: '🎉' },
            { id: 'MONTH', label: 'Same Month', icon: '📅' },
            { id: 'HIGHLIGHT', label: '5-Star Standouts', icon: '⭐' },
            { id: 'GENESIS', label: 'Genesis Origins', icon: '🌱' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'}
        </span>
      </div>

      {/* Content State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Error loading Memory Lane</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => loadMemories(selectedDate)}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-medium text-sm transition"
          >
            Retry
          </button>
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
            ⏳
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Memories Found for This Filter</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            No experiences match the criteria on this reference date. Try switching the date or logging more milestones into your timeline!
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setFilterType('ALL')}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition"
            >
              Show All Memories
            </button>
            <button
              onClick={() => onNavigate('experiences')}
              className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition"
            >
              Browse All Experiences
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMemories.map((m) => {
            const badge = getMemoryBadge(m.memoryType, m.milestoneLabel);
            return (
              <div
                key={m.experienceId}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition flex flex-col justify-between group space-y-4 relative overflow-hidden"
              >
                {/* Top Badge & Time Ago */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 ${badge.bg}`}
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.tag}</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {m.daysAgo} days ago ({m.experienceDate})
                  </span>
                </div>

                {/* Title & Category */}
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-amber-600 transition">
                    {m.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold">
                      {m.category}
                    </span>
                    <span className="flex items-center text-amber-500 font-bold">
                      {'★'.repeat(m.rating || 5)} ({m.rating}/5)
                    </span>
                    {m.location && <span>📍 {m.location}</span>}
                  </div>
                </div>

                {/* Description snippet */}
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {m.description || 'No description recorded for this milestone.'}
                </p>

                {/* Nostalgic Prompt Box */}
                {m.reflectionPrompt && (
                  <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl text-xs text-amber-900">
                    <span className="font-bold block text-amber-800 mb-0.5">💡 Nostalgic Reflection</span>
                    <p className="italic text-amber-950/80 leading-normal">{m.reflectionPrompt}</p>
                  </div>
                )}

                {/* Action button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 italic">
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
                    className="px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl text-xs font-bold hover:from-amber-600 hover:to-orange-600 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>View Memory</span>
                    <span>→</span>
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
