import React from 'react';
import { BookOpen, Star, PlusCircle, Server, CheckCircle2, Award, Calendar, MapPin } from 'lucide-react';

export default function Dashboard({ experiences, health, onNavigate }) {
  const totalCount = experiences.length;
  const avgRating = totalCount > 0
    ? (experiences.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalCount).toFixed(1)
    : '0.0';

  const categories = [...new Set(experiences.map((e) => e.category))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">Project Overview</h2>
        <p className="text-sm text-slate-400 mt-1">
          LifeLog foundation status, REST API connectivity, and experience summary.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Experiences</span>
            <BookOpen className="h-5 w-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-3">{totalCount}</p>
          <p className="text-xs text-slate-400 mt-1">Logged across all categories</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Average Rating</span>
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-3">{avgRating} / 5</p>
          <p className="text-xs text-slate-400 mt-1">Self-assessed impact score</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Categories</span>
            <Award className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-3">{categories.length}</p>
          <p className="text-xs text-slate-400 mt-1">Distinct experience types</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Backend API</span>
            <Server className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-400 mt-3 flex items-center gap-1.5">
            <CheckCircle2 className="h-5 w-5" />
            {health?.status === 'ok' ? 'Healthy' : 'Connecting...'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Endpoint: <code className="text-slate-300">GET /api/health</code>
          </p>
        </div>
      </div>

      {/* Academic DSA Notice */}
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-indigo-300">
            DSA Academic Architecture
          </h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
            Stage 1: Foundation
          </span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          The foundation establishes Spring Boot REST controllers, PostgreSQL JPA entities, and React UI. In the next stage, custom Java DSA classes in <code className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-xs">com.lifelog.dsa</code> will manage experience timelines (LinkedList), recent view history (Stack), pending queues (Queue), lookup indexes (BST), and top-rated experiences (Max Heap).
        </p>
      </div>

      {/* Recent Experiences Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100">Recent Experiences</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('add-experience')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Add Experience
            </button>
            <button
              onClick={() => onNavigate('experiences')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>

        {experiences.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm font-medium">No experiences recorded yet.</p>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Start by adding your first project, internship, hackathon, workshop, or milestone.
            </p>
            <button
              onClick={() => onNavigate('add-experience')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              Add First Experience
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiences.slice(0, 3).map((exp) => (
              <div
                key={exp.id}
                className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {exp.category}
                    </span>
                    {exp.rating && (
                      <div className="flex items-center text-xs text-amber-400 font-semibold gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span>{exp.rating}/5</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-base font-semibold text-slate-100 mt-2 line-clamp-1">
                    {exp.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {exp.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {exp.experienceDate || 'No date'}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exp.location}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
