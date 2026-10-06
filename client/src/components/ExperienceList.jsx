import React, { useState } from 'react';
import { Trash2, PlusCircle, Calendar, MapPin, Star, Filter, Search } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Projects',
  'Internships',
  'Hackathons',
  'Competitions',
  'Workshops',
  'Achievements',
  'College events',
  'Personal milestones',
];

export default function ExperienceList({ experiences, onDelete, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filtered = experiences.filter((exp) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      exp.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      (exp.title && exp.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exp.description && exp.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exp.location && exp.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Experiences</h2>
          <p className="text-sm text-slate-400 mt-1">
            Browse and manage all recorded academic and personal milestones.
          </p>
        </div>
        <button
          onClick={() => onNavigate('add-experience')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experiences by title, description, or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="h-4 w-4 text-slate-500 shrink-0 ml-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Experience List / Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
          <p className="text-slate-400 text-base font-medium">No experiences match your criteria.</p>
          <p className="text-slate-400 text-xs">
            {experiences.length === 0
              ? 'No experiences have been saved in PostgreSQL yet.'
              : 'Try clearing your search query or choosing another category filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((exp) => (
            <div
              key={exp.id}
              className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {exp.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {exp.rating && (
                      <div className="flex items-center text-xs text-amber-400 font-semibold gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span>{exp.rating}/5</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(exp.id)}
                      disabled={deletingId === exp.id}
                      title="Delete experience"
                      className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-slate-100 mt-2.5">
                  {exp.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {exp.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  {exp.experienceDate || 'No date specified'}
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    {exp.location}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
