import React, { useState, useEffect } from 'react';
import { Search, GitBranch, Layers, Star, Calendar, Hash } from 'lucide-react';
import { searchBstId, fetchBstStats } from '../services/api';

export default function BSTLookupView({ onSelectExperience }) {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    const data = await fetchBstStats();
    setStats(data);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return;
    setLoading(true);
    setSearched(true);
    try {
      const result = await searchBstId(searchId);
      setSearchResult(result);
    } catch (err) {
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Binary Search Tree Lookup</h2>
          <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Powered by Custom BST
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Instant ID-based lookup navigating left and right subtrees in average O(log n) time.
        </p>
      </div>

      {/* BST Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] uppercase font-semibold text-slate-400">Total Tree Nodes</span>
          <p className="text-2xl font-extrabold text-cyan-400 mt-1">{stats?.size ?? 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] uppercase font-semibold text-slate-400">Tree Height</span>
          <p className="text-2xl font-extrabold text-indigo-400 mt-1">{stats?.height ?? 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] uppercase font-semibold text-slate-400">Min Node Key</span>
          <p className="text-2xl font-extrabold text-slate-200 mt-1">#{stats?.minId ?? '—'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] uppercase font-semibold text-slate-400">Max Node Key</span>
          <p className="text-2xl font-extrabold text-slate-200 mt-1">#{stats?.maxId ?? '—'}</p>
        </div>
      </div>

      {/* BST Search Box */}
      <form onSubmit={handleSearch} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="number"
            min="1"
            placeholder="Enter numeric experience ID to search in BST (e.g. 1, 2, 50)..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition cursor-pointer"
        >
          <Search className="h-4 w-4" />
          Search BST
        </button>
      </form>

      {/* Search Result Display */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          Navigating binary search tree...
        </div>
      ) : searched && !searchResult ? (
        <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center text-slate-400 text-sm">
          Node with ID #{searchId} not found in Binary Search Tree.
        </div>
      ) : searchResult ? (
        <div
          onClick={() => onSelectExperience(searchResult)}
          className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 transition cursor-pointer space-y-4 shadow-lg shadow-cyan-950/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Found in BST (ID: #{searchResult.id})
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
              <Star className="h-4 w-4 fill-amber-400" />
              <span>{searchResult.rating}/5</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold">{searchResult.category}</span>
            <h3 className="text-xl font-bold text-slate-100 mt-1">{searchResult.title}</h3>
            {searchResult.description && (
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{searchResult.description}</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              {searchResult.date || 'Undated'}
            </span>
            <span className="text-cyan-400 text-xs font-medium">Click to open details & push to Recent Stack →</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
