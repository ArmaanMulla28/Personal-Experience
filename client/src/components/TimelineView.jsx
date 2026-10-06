import React, { useState, useEffect } from 'react';
import { GitCommit, Calendar, Star, MapPin, RefreshCw, Layers } from 'lucide-react';
import { fetchTimeline } from '../services/api';

export default function TimelineView({ onSelectExperience }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
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

        <button
          onClick={loadTimeline}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Timeline
        </button>
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
      ) : (
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
                        Node #{idx + 1} (ID: #{item.id})
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
