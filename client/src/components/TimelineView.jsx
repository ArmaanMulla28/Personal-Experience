import React, { useState, useEffect } from 'react';
import { GitCommit, Calendar, Star, MapPin, RefreshCw, Layers, FolderTree, Network } from 'lucide-react';
import { fetchTimeline } from '../services/api';

export default function TimelineView({ onSelectExperience }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'chain'

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await fetchTimeline();
      setTimeline(data || []);
    } catch (err) {
      console.error('Error loading timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  // Group timeline by Year and Month for hierarchical visualization
  const hierarchicalTimeline = React.useMemo(() => {
    const grouped = {};
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    timeline.forEach((item) => {
      let year = 'Undated';
      let month = 'Other';

      if (item.date) {
        const parts = item.date.split('-');
        if (parts.length >= 2) {
          year = parts[0];
          const monthIdx = parseInt(parts[1], 10) - 1;
          if (monthIdx >= 0 && monthIdx < 12) {
            month = monthNames[monthIdx];
          }
        }
      }

      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = [];
      grouped[year][month].push(item);
    });

    return grouped;
  }, [timeline]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Experience Timeline</h2>
            <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Powered by Custom Linked List
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chronologically chained nodes traversed from head to tail using custom pointers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'tree'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderTree className="h-3.5 w-3.5" />
              <span>Year/Month Tree</span>
            </button>
            <button
              onClick={() => setViewMode('chain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'chain'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              <span>Node Chain</span>
            </button>
          </div>

          <button
            onClick={loadTimeline}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* DSA Complexity Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          <span>Data Structure: <strong className="text-slate-200">com.lifelog.dsa.linkedlist.CustomLinkedList</strong></span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span>Head Insert: <strong className="text-emerald-400">O(1)</strong></span>
          <span>Tail Insert: <strong className="text-emerald-400">O(1)</strong></span>
          <span>Traversal: <strong className="text-indigo-400">O(n)</strong></span>
          <span>Nodes: <strong className="text-amber-400">{timeline.length}</strong></span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          Traversing linked list nodes...
        </div>
      ) : timeline.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center text-slate-400 text-sm">
          No experiences recorded in the timeline yet. Add an experience to populate nodes!
        </div>
      ) : viewMode === 'tree' ? (
        /* ======================================================== */
        /* HIERARCHICAL TREE VIEW (YEAR -> MONTH -> EXPERIENCES)   */
        /* ======================================================== */
        <div className="space-y-8 bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800/80">
          {Object.entries(hierarchicalTimeline)
            .sort((a, b) => (b[0] === 'Undated' ? -1 : a[0] === 'Undated' ? 1 : b[0].localeCompare(a[0])))
            .map(([year, months]) => (
              <div key={year} className="space-y-6">
                {/* Year Marker */}
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-lg rounded-2xl shadow-md tracking-wider font-mono">
                    {year}
                  </span>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-500/40 to-transparent"></div>
                </div>

                {/* Months Tree */}
                <div className="pl-4 md:pl-8 space-y-6 border-l-2 border-purple-500/20 ml-4">
                  {Object.entries(months).map(([month, exps]) => (
                    <div key={month} className="space-y-4">
                      {/* Month Header */}
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-400 -ml-[23px] md:-ml-[39px] border-2 border-slate-950"></div>
                        <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                          ● {month}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          ({exps.length} {exps.length === 1 ? 'milestone' : 'milestones'})
                        </span>
                      </div>

                      {/* Items under this Month */}
                      <div className="pl-4 md:pl-6 space-y-3 border-l border-slate-800/80 ml-1">
                        {exps.map((item, idx) => {
                          const isLast = idx === exps.length - 1;
                          return (
                            <div
                              key={item.id}
                              onClick={() => onSelectExperience(item)}
                              className="group flex items-start gap-3 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 transition cursor-pointer"
                            >
                              <span className="text-purple-400 font-mono text-sm select-none">
                                {isLast ? '└──' : '├──'}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition">
                                      {item.title}
                                    </span>
                                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                      {item.category}
                                    </span>
                                  </div>
                                  {item.rating && (
                                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold shrink-0">
                                      <span>★</span>
                                      <span>{item.rating}</span>
                                    </div>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                                    {item.description}
                                  </p>
                                )}
                                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-3">
                                  <span>📅 {item.date || 'Undated'}</span>
                                  {item.location && <span>📍 {item.location}</span>}
                                  <span className="font-mono text-slate-600">ID #{item.id}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        /* ======================================================== */
        /* SEQUENTIAL NODE CHAIN VIEW (LINKED LIST POINTERS)       */
        /* ======================================================== */
        <div className="relative pl-6 md:pl-8 border-l-2 border-indigo-500/30 space-y-8 my-6">
          {timeline.map((item, idx) => (
            <div key={item.id} className="relative group">
              {/* Node indicator dot */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-slate-950 bg-indigo-500 group-hover:scale-125 transition shadow-sm shadow-indigo-500/50" />

              <div
                onClick={() => onSelectExperience(item)}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/90 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Node #{idx + 1} (Pointer: 0x{((item.id * 1024) + 128).toString(16)})
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100 mt-2">
                      {item.title}
                    </h3>
                  </div>

                  {item.rating && (
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold shrink-0">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      <span>{item.rating}/5</span>
                    </div>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    {item.date || 'Undated'}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {item.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
