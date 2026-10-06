import React, { useState, useEffect } from 'react';
import { ArrowRight, PlusCircle, CheckCircle, Trash2, Clock, Layers } from 'lucide-react';
import { fetchPendingExperiences, enqueuePending, dequeueNextPending, deletePendingById } from '../services/api';

export default function PendingQueueView({ onPromoteToFullExperience }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Projects');

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await fetchPendingExperiences();
      setQueue(data || []);
    } catch (err) {
      console.error('Error fetching pending queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleEnqueue = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const added = await enqueuePending({
        title: newTitle.trim(),
        category: newCategory,
        rating: 3,
      });
      setQueue((prev) => [...prev, added]);
      setNewTitle('');
    } catch (err) {
      console.error('Enqueue error:', err);
    }
  };

  const handleDequeueNext = async () => {
    try {
      const dequeued = await dequeueNextPending();
      if (dequeued) {
        setQueue((prev) => prev.slice(1));
        if (onPromoteToFullExperience) {
          onPromoteToFullExperience(dequeued);
        }
      }
    } catch (err) {
      console.error('Dequeue error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePendingById(id);
      setQueue((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Delete pending error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Pending Documentation Queue</h2>
            <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Powered by Custom Queue (FIFO)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            First-In-First-Out queue of experiences waiting for complete documentation or verification.
          </p>
        </div>

        {queue.length > 0 && (
          <button
            onClick={handleDequeueNext}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto"
          >
            <CheckCircle className="h-4 w-4" />
            Process Next (Dequeue FRONT)
          </button>
        )}
      </div>

      {/* DSA Complexity Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-400" />
          <span>Data Structure: <strong className="text-slate-200">com.lifelog.dsa.queue.ExperienceQueue</strong></span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span>Enqueue (Rear): <strong className="text-emerald-400">O(1)</strong></span>
          <span>Dequeue (Front): <strong className="text-emerald-400">O(1)</strong></span>
          <span>Peek: <strong className="text-emerald-400">O(1)</strong></span>
          <span>Queue Size: <strong className="text-amber-400">{queue.length}</strong></span>
        </div>
      </div>

      {/* Quick Enqueue Form */}
      <form onSubmit={handleEnqueue} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="Quickly enqueue pending experience title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full sm:w-44 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
        >
          <option value="Projects">Projects</option>
          <option value="Internships">Internships</option>
          <option value="Hackathons">Hackathons</option>
          <option value="Competitions">Competitions</option>
          <option value="Workshops">Workshops</option>
          <option value="Achievements">Achievements</option>
          <option value="College events">College events</option>
        </select>
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          Enqueue (REAR)
        </button>
      </form>

      {/* Queue Visualization */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          Loading pending queue...
        </div>
      ) : queue.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center text-slate-400 text-sm space-y-2">
          <Clock className="h-8 w-8 text-slate-600 mx-auto" />
          <p className="font-medium">The pending queue is currently empty.</p>
          <p className="text-xs text-slate-500">All experiences have been documented!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-slate-400 px-2">
            <span>Front (Next to Dequeue)</span>
            <span>Rear (Latest Enqueued)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {queue.map((item, idx) => {
              const isFront = idx === 0;
              const isRear = idx === queue.length - 1;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                    isFront
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                      : 'bg-slate-900/50 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isFront && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-mono">
                            FRONT
                          </span>
                        )}
                        {isRear && !isFront && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500 text-white font-mono">
                            REAR
                          </span>
                        )}
                        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          {item.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                        title="Remove from queue"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100 mt-2.5">
                      {item.title}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Position: #{idx + 1}</span>
                    <span>Item ID: #{item.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
