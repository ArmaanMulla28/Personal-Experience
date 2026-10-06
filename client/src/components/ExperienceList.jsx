import React, { useState } from 'react';
import { Eye, Edit3, Trash2, PlusCircle, Calendar, MapPin, Star, Filter, Search, ArrowUpDown } from 'lucide-react';

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

export default function ExperienceList({
  experiences,
  onView,
  onEdit,
  onDelete,
  onNavigate,
  onSearch,
  onCategoryFilter,
  onSortChange,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [deletingId, setDeletingId] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (onCategoryFilter) {
      onCategoryFilter(cat);
    }
  };

  const handleSortSelect = (val) => {
    setSortBy(val);
    if (onSortChange) {
      const [field, dir] = val.split('-');
      onSortChange(field, dir);
    }
  };

  // Local filter for rating if needed
  const filtered = experiences.filter((exp) => {
    const matchesRating =
      selectedRating === 'All' || exp.rating === Number(selectedRating);
    return matchesRating;
  });

  const handleDeleteClick = async (e, id) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete experience #${id}?`)) {
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">All Experiences</h2>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, view, edit, or delete logged academic and personal milestones.
          </p>
        </div>
        <button
          onClick={() => onNavigate('add-experience')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            placeholder="Search experiences by keyword, location, or title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </form>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <ArrowUpDown className="h-4 w-4 text-slate-500 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => handleSortSelect(e.target.value)}
            className="w-full md:w-auto px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="rating-desc">Rating (Highest First)</option>
            <option value="rating-asc">Rating (Lowest First)</option>
            <option value="title-asc">Title (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Rating Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-slate-800/80 py-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0 ml-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Star Rating Filter */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[11px] text-slate-500 mr-1 uppercase font-semibold">Stars:</span>
          {['All', 5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRating(r)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                selectedRating === r
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {r === 'All' ? 'All' : `${r}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
          <p className="text-slate-400 text-sm font-medium">No experiences found.</p>
          <p className="text-slate-500 text-xs">
            Try adjusting your search query, filters, or add a new experience!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((exp) => (
            <div
              key={exp.id}
              onClick={() => onView(exp)}
              className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70 transition flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {exp.category}
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {exp.rating && (
                      <div className="flex items-center text-xs text-amber-400 font-semibold gap-1 mr-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span>{exp.rating}/5</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(exp);
                      }}
                      title="Edit experience"
                      className="p-1 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, exp.id)}
                      disabled={deletingId === exp.id}
                      title="Delete experience"
                      className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-100 mt-2.5 group-hover:text-indigo-300 transition">
                  {exp.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {exp.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {exp.experienceDate || 'Undated'}
                </span>
                {exp.location ? (
                  <span className="flex items-center gap-1 truncate max-w-[120px]">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{exp.location}</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-600">ID #{exp.id}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
