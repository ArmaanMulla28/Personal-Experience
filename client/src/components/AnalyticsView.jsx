import React, { useState, useEffect } from 'react';
import { fetchAnalytics } from '../services/api';

export function AnalyticsView({ onNavigate, onViewDetails }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAnalytics();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Error loading analytics</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-medium text-sm transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    totalExperiences = 0,
    averageRating = 0,
    mostCommonCategory = 'None',
    mostCommonCategoryCount = 0,
    mostActiveMonth = 'None',
    mostActiveMonthCount = 0,
    highestRatedExperience = null,
    categoryDistribution = {},
    ratingDistribution = {},
    monthlyActivity = {},
  } = data || {};

  const totalCategoriesCount = Object.values(categoryDistribution).reduce((a, b) => a + b, 0) || 1;
  const ratingMax = Math.max(...Object.values(ratingDistribution), 1);
  const monthlyMax = Math.max(...Object.values(monthlyActivity), 1);

  // Category palette
  const getCategoryColor = (cat) => {
    const map = {
      Projects: 'from-blue-500 to-indigo-600',
      Hackathons: 'from-purple-500 to-violet-600',
      Internships: 'from-emerald-500 to-teal-600',
      Workshops: 'from-amber-500 to-orange-600',
      Achievements: 'from-rose-500 to-pink-600',
      Competitions: 'from-cyan-500 to-blue-600',
    };
    return map[cat] || 'from-slate-500 to-slate-700';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              Phase 5 Feature
            </span>
            <span className="text-xs text-slate-500">Real-time Statistical Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Analytics & Activity Insights
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated distributions, category breakdown, ratings, and temporal activity patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('memory-lane')}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm rounded-xl shadow-sm hover:from-amber-600 hover:to-orange-600 transition flex items-center gap-2"
          >
            <span>✨</span>
            <span>Memory Lane</span>
          </button>
          <button
            onClick={loadData}
            className="p-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
            title="Refresh Analytics"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Experiences */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Recorded</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              📚
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalExperiences}</span>
            <span className="text-xs text-slate-500 font-medium">milestones</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Stored in PostgreSQL & indexed in Java DSA
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              ⭐
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{averageRating.toFixed(2)}</span>
            <span className="text-xs text-amber-500 font-bold">/ 5.0</span>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-sm ${
                  star <= Math.round(averageRating) ? 'text-amber-400' : 'text-slate-200'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-50 rounded-full opacity-50 pointer-events-none"></div>
        </div>

        {/* Most Common Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Domain</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              🎯
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-slate-900 truncate block">
              {mostCommonCategory}
            </span>
            <span className="text-xs text-purple-600 font-semibold mt-1 block">
              {mostCommonCategoryCount} occurrences ({totalExperiences > 0 ? Math.round((mostCommonCategoryCount / totalExperiences) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Primary focus area
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-50 rounded-full opacity-50 pointer-events-none"></div>
        </div>

        {/* Most Active Month */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peak Period</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ⚡
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-slate-900 block">
              {mostActiveMonth}
            </span>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">
              {mostActiveMonthCount} events recorded
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Highest milestone velocity
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50 pointer-events-none"></div>
        </div>
      </div>

      {/* Highest Rated Experience Feature Banner */}
      {highestRatedExperience && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 font-semibold text-xs rounded-full border border-amber-400/30">
                🏆 Highest Rated Experience
              </span>
              <span className="text-xs text-indigo-200">
                {highestRatedExperience.experienceDate || 'No date'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {highestRatedExperience.title}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl line-clamp-2">
              {highestRatedExperience.description || 'No description provided.'}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="px-2.5 py-1 bg-white/10 rounded-lg text-white font-medium">
                {highestRatedExperience.category}
              </span>
              <span className="flex items-center text-amber-400 font-bold">
                {'★'.repeat(highestRatedExperience.rating || 5)} ({highestRatedExperience.rating}/5)
              </span>
              {highestRatedExperience.location && (
                <span className="text-slate-300">📍 {highestRatedExperience.location}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onViewDetails && onViewDetails(highestRatedExperience)}
              className="px-5 py-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-sm hover:bg-amber-300 transition shadow-md"
            >
              View Full Experience
            </button>
            <button
              onClick={() => onNavigate('top')}
              className="px-4 py-2.5 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition border border-white/10"
            >
              Heap Leaderboard
            </button>
          </div>
        </div>
      )}

      {/* Breakdown Grid: Category & Rating Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Category Breakdown</h3>
              <p className="text-xs text-slate-500">Distribution across experience genres</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {Object.keys(categoryDistribution).length} Categories
            </span>
          </div>

          {Object.keys(categoryDistribution).length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No category data available yet.
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(categoryDistribution)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => {
                  const percent = Math.round((count / totalCategoriesCount) * 100);
                  return (
                    <div key={category} className="space-y-1.5">
                      <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                        <span className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${getCategoryColor(category)}`}></span>
                          {category}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {count} <span className="text-slate-400 font-normal">({percent}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getCategoryColor(category)} transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Rating Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown from 5 Stars to 1 Star</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg flex items-center gap-1">
              <span>⭐</span> Avg: {averageRating.toFixed(1)}
            </span>
          </div>

          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars] || 0;
              const percent = totalExperiences > 0 ? Math.round((count / totalExperiences) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-4 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-1 w-16 text-amber-500 shrink-0">
                    <span>{stars}</span>
                    <span>★</span>
                  </div>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-xs font-bold text-slate-800 shrink-0">
                    {count} <span className="text-slate-400 font-normal">({percent}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Activity Temporal Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Monthly Chronological Activity</h3>
            <p className="text-xs text-slate-500">Velocity of personal achievements and logged milestones over time</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
            {Object.keys(monthlyActivity).length} Active Months
          </span>
        </div>

        {Object.keys(monthlyActivity).length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            No chronological activity recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pt-2">
            {Object.entries(monthlyActivity).map(([monthYear, count]) => {
              const heightPercent = Math.max(Math.round((count / monthlyMax) * 100), 15);
              return (
                <div
                  key={monthYear}
                  className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition group"
                >
                  <span className="text-xs font-bold text-indigo-600 mb-2">{count} {count === 1 ? 'event' : 'events'}</span>
                  <div className="w-full bg-slate-200 h-24 rounded-lg flex items-end p-1">
                    <div
                      className="w-full bg-indigo-600 group-hover:bg-indigo-500 rounded transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 mt-2 tracking-tight">
                    {monthYear}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Signature DSA Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div
          onClick={() => onNavigate('timeline')}
          className="p-6 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl hover:border-indigo-300 transition cursor-pointer group"
        >
          <div className="text-2xl mb-2">🔗</div>
          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
            Experience Timeline
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Traverse your history in sequential order powered by custom Java Singly Linked List.
          </p>
        </div>

        <div
          onClick={() => onNavigate('top')}
          className="p-6 bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-2xl hover:border-amber-300 transition cursor-pointer group"
        >
          <div className="text-2xl mb-2">🏆</div>
          <h4 className="font-bold text-slate-900 group-hover:text-amber-600 transition">
            Max Heap Leaderboard
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Top-rated experiences extracted in O(log n) using custom binary Max Heap.
          </p>
        </div>

        <div
          onClick={() => onNavigate('memory-lane')}
          className="p-6 bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl hover:border-orange-300 transition cursor-pointer group"
        >
          <div className="text-2xl mb-2">✨</div>
          <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition">
            Memory Lane
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            "On This Day" anniversaries and nostalgic milestone reflections.
          </p>
        </div>
      </div>
    </div>
  );
}
