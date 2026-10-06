import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, Calendar, MapPin, Layers, RefreshCw } from 'lucide-react';
import { fetchTopExperiences } from '../services/api';

export default function TopExperiencesView({ onSelectExperience }) {
  const [topList, setTopList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);

  const loadTop = async () => {
    setLoading(true);
    try {
      const data = await fetchTopExperiences(limit);
      setTopList(data || []);
    } catch (err) {
      console.error('Error fetching top experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTop();
  }, [limit]);

  const getRankBadge = (rank) => {
    if (rank === 1) return { bg: 'bg-amber-400 text-slate-950', label: '🥇 1st Place' };
    if (rank === 2) return { bg: 'bg-slate-300 text-slate-950', label: '🥈 2nd Place' };
    if (rank === 3) return { bg: 'bg-amber-600 text-white', label: '🥉 3rd Place' };
    return { bg: 'bg-slate-800 text-slate-300', label: `#${rank}` };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Top-Rated Experiences</h2>
            <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Powered by Custom Max Heap
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Priority Queue built with Floyd's algorithm O(n), extracting top experiences in O(log n) time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="text-xs text-slate-400">Show Top:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value={3}>Top 3</option>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
          </select>
        </div>
      </div>

      {/* DSA Complexity Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-400" />
          <span>Data Structure: <strong className="text-slate-200">com.lifelog.dsa.priorityqueue.ExperienceMaxHeap</strong></span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span>Build Heap: <strong className="text-emerald-400">O(n)</strong></span>
          <span>Extract Max: <strong className="text-indigo-400">O(log n)</strong></span>
          <span>Peek Root: <strong className="text-emerald-400">O(1)</strong></span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          Extracting max elements from priority queue...
        </div>
      ) : topList.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center text-slate-400 text-sm">
          No rated experiences available yet.
        </div>
      ) : (
        <div className="space-y-3">
          {topList.map((item, idx) => {
            const badge = getRankBadge(idx + 1);
            return (
              <div
                key={item.id}
                onClick={() => onSelectExperience(item)}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900/80 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        ID: #{item.id}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100 mt-1">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60 justify-between sm:justify-end">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span>{item.rating || 5} / 5</span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.date || 'Undated'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
