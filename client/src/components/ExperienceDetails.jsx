import React from 'react';
import { X, Calendar, MapPin, Star, Tag, Edit3, Trash2, ArrowLeft } from 'lucide-react';

export default function ExperienceDetails({ experience, onClose, onEdit, onDelete }) {
  if (!experience) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold tracking-wider px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {experience.category || 'General'}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ID: #{experience.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight leading-snug">
              {experience.title}
            </h2>

            {/* Meta Row */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              {experience.experienceDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  <span>{experience.experienceDate}</span>
                </div>
              )}
              {experience.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  <span>{experience.location}</span>
                </div>
              )}
              {experience.rating && (
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span>{experience.rating} / 5 Stars</span>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Description & Key Takeaways
            </h4>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {experience.description || 'No description provided for this experience.'}
            </div>
          </div>

          {/* Academic / DSA Connection Callout */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
            <span>✨ Viewed & automatically pushed onto <strong>Recently Viewed Stack (LIFO)</strong></span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <button
            onClick={() => onDelete(experience.id)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-semibold transition cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Delete Experience
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(experience)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
