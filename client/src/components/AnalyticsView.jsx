import React, { useState, useEffect } from 'react';
import {
  BarChart3, Star, Layers, Calendar, ArrowRight, RefreshCw, Trophy, Sparkles
} from 'lucide-react';
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
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-900 animate-pulse rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-900/60 border border-slate-800/80 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-rose-300 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Error loading analytics data</h3>
          <p className="text-xs text-rose-400 mt-1">{error}</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-500 font-semibold text-xs transition"
        >
          Retry
        </button>
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

  const getCategoryColor = (cat) => {
    const map = {
      Projects: 'from-blue-500 to-indigo-500',
      Hackathons: 'from-purple-500 to-violet-500',
      Internships: 'from-emerald-500 to-teal-500',
      Workshops: 'from-amber-500 to-orange-500',
      Achievements: 'from-rose-500 to-pink-500',
      Competitions: 'from-cyan-500 to-blue-500',
    };
    return map[cat] || 'from-slate-600 to-slate-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Analytics & Activity Insights</h2>
            <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Statistical Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated distributions, category breakdown, ratings, and temporal activity patterns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('memory-lane')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-xs transition cursor-pointer shadow-sm hover:from-amber-400 hover:to-orange-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Memory Lane</span>
          </button>
          <button
            onClick={loadData}
            className="p-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-100 transition cursor-pointer"
            title="Refresh Analytics"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Experiences */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Recorded</span>
            <span className="text-sm">📚</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">{totalExperiences}</span>
            <span className="text-xs text-slate-500">milestones</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Indexed in PostgreSQL & Java DSA</p>
        </div>

        {/* Average Rating */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
            <span className="text-sm">⭐</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">{averageRating.toFixed(2)}</span>
            <span className="text-xs text-amber-400 font-bold">/ 5.0</span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-xs ${
                  star <= Math.round(averageRating) ? 'text-amber-400' : 'text-slate-700'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Most Common Category */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Domain</span>
            <span className="text-sm">🎯</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-indigo-400 truncate block">
              {mostCommonCategory}
            </span>
            <span className="text-xs text-slate-400 mt-0.5 block">
              {mostCommonCategoryCount} occurrences ({totalExperiences > 0 ? Math.round((mostCommonCategoryCount / totalExperiences) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Primary focus area</p>
        </div>

        {/* Most Active Month */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peak Period</span>
            <span className="text-sm">⚡</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-400 block font-mono">
              {mostActiveMonth}
            </span>
            <span className="text-xs text-slate-400 mt-0.5 block">
              {mostActiveMonthCount} events recorded
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Highest milestone velocity</p>
        </div>
      </div>

      {/* Highest Rated Experience Feature Banner */}
      {highestRatedExperience && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-400/10 text-amber-300 font-semibold text-xs rounded-full border border-amber-400/20">
                🏆 Highest Rated Experience
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {highestRatedExperience.experienceDate || 'No date'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 tracking-tight">
              {highestRatedExperience.title}
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl line-clamp-2 leading-relaxed">
              {highestRatedExperience.description || 'No description recorded.'}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-200 text-[11px] font-semibold">
                {highestRatedExperience.category}
              </span>
              <span className="flex items-center text-amber-400 font-bold">
                {'★'.repeat(highestRatedExperience.rating || 5)} ({highestRatedExperience.rating}/5)
              </span>
              {highestRatedExperience.location && (
                <span>📍 {highestRatedExperience.location}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewDetails && onViewDetails(highestRatedExperience)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow"
            >
              View Full Experience
            </button>
            <button
              onClick={() => onNavigate('top')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer border border-slate-700"
            >
              Heap Leaderboard
            </button>
          </div>
        </div>
      )}

      {/* Breakdown Grid: Category & Rating Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-100">Category Breakdown</h3>
              <p className="text-xs text-slate-400">Distribution across experience genres</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 rounded-lg">
              {Object.keys(categoryDistribution).length} Categories
            </span>
          </div>

          {Object.keys(categoryDistribution).length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No category data recorded yet.
            </div>
          ) : (
            <div className="space-y-3.5">
              {Object.entries(categoryDistribution)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => {
                  const percent = Math.round((count / totalCategoriesCount) * 100);
                  return (
                    <div key={category} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${getCategoryColor(category)}`}></span>
                          {category}
                        </span>
                        <span className="text-xs text-slate-200">
                          {count} <span className="text-slate-500 font-normal">({percent}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
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
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-100">Rating Distribution</h3>
              <p className="text-xs text-slate-400">Breakdown from 5 Stars to 1 Star</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded-lg">
              Avg: {averageRating.toFixed(1)} ★
            </span>
          </div>

          <div className="space-y-3.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars] || 0;
              const percent = totalExperiences > 0 ? Math.round((count / totalExperiences) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                  <div className="flex items-center gap-1 w-14 text-amber-400 shrink-0">
                    <span>{stars}</span>
                    <span>★</span>
                  </div>
                  <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="w-14 text-right text-xs text-slate-300 shrink-0 font-mono">
                    {count} <span className="text-slate-500 font-normal">({percent}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Chronological Velocity */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-100">Monthly Chronological Velocity</h3>
            <p className="text-xs text-slate-400">Milestones recorded over calendar months</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded-lg">
            {Object.keys(monthlyActivity).length} Active Months
          </span>
        </div>

        {Object.keys(monthlyActivity).length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No chronological activity recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pt-2">
            {Object.entries(monthlyActivity).map(([monthYear, count]) => {
              const heightPercent = Math.max(Math.round((count / monthlyMax) * 100), 20);
              return (
                <div
                  key={monthYear}
                  className="flex flex-col items-center p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition group"
                >
                  <span className="text-[11px] font-bold text-indigo-400 mb-2 font-mono">
                    {count} {count === 1 ? 'event' : 'events'}
                  </span>
                  <div className="w-full bg-slate-900 h-20 rounded-lg flex items-end p-1">
                    <div
                      className="w-full bg-indigo-500 group-hover:bg-indigo-400 rounded transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 mt-2 font-mono">
                    {monthYear}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
