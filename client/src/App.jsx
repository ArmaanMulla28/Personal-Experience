import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExperienceList from './components/ExperienceList';
import AddExperience from './components/AddExperience';
import ExperienceDetails from './components/ExperienceDetails';
import EditExperience from './components/EditExperience';
import TimelineView from './components/TimelineView';
import PendingQueueView from './components/PendingQueueView';
import TopExperiencesView from './components/TopExperiencesView';
import BSTLookupView from './components/BSTLookupView';
import { AnalyticsView } from './components/AnalyticsView';
import { MemoryLaneView } from './components/MemoryLaneView';

import {
  checkBackendHealth, fetchExperiences, fetchExperienceById,
  createExperience, updateExperience, deleteExperience,
  searchExperiences, filterByCategory
} from './services/api';

export default function App() {
  const [currentTab, setTab] = useState('dashboard');
  const [experiences, setExperiences] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Modal states
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadHealth = async () => {
    const data = await checkBackendHealth();
    setHealth(data);
  };

  const loadExperiences = async (sortBy = null, direction = null) => {
    try {
      setLoading(true);
      const data = await fetchExperiences(sortBy, direction);
      setExperiences(data || []);
    } catch (err) {
      console.warn('Could not load experiences from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
    loadExperiences();

    const interval = setInterval(loadHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // View Details (automatically triggers Recently Viewed Stack push in backend)
  const handleViewExperience = async (exp) => {
    try {
      const detailed = await fetchExperienceById(exp.id);
      setSelectedExperience(detailed);
    } catch {
      setSelectedExperience(exp);
    }
  };

  const handleCreateExperience = async (payload) => {
    const created = await createExperience(payload);
    setExperiences((prev) => [created, ...prev]);
    showNotification('Experience saved and indexed in BST successfully!', 'success');
  };

  const handleUpdateExperience = async (id, payload) => {
    const updated = await updateExperience(id, payload);
    setExperiences((prev) => prev.map((item) => (item.id === id ? updated : item)));
    if (selectedExperience && selectedExperience.id === id) {
      setSelectedExperience(updated);
    }
    showNotification(`Experience #${id} updated successfully!`, 'success');
  };

  const handleDeleteExperience = async (id) => {
    await deleteExperience(id);
    setExperiences((prev) => prev.filter((item) => item.id !== id));
    if (selectedExperience && selectedExperience.id === id) {
      setSelectedExperience(null);
    }
    showNotification(`Experience #${id} deleted`, 'info');
  };

  const handleSearch = async (query) => {
    if (!query || !query.trim()) {
      loadExperiences();
      return;
    }
    try {
      const results = await searchExperiences(query);
      setExperiences(results || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleCategoryFilter = async (category) => {
    if (!category || category === 'All') {
      loadExperiences();
      return;
    }
    try {
      const results = await filterByCategory(category);
      setExperiences(results || []);
    } catch (err) {
      console.error('Category filter failed:', err);
    }
  };

  const handleSortChange = (sortBy, direction) => {
    loadExperiences(sortBy, direction);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar health={health} onRefreshHealth={loadHealth} />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-4 py-3 rounded-2xl border text-xs font-semibold shadow-2xl backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            {notification.msg}
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          setTab={setTab}
          experienceCount={experiences.length}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950/50">
          <div className="max-w-6xl mx-auto">
            {currentTab === 'dashboard' && (
              <Dashboard
                experiences={experiences}
                health={health}
                onNavigate={setTab}
                onSelectExperience={handleViewExperience}
              />
            )}

            {currentTab === 'experiences' && (
              <ExperienceList
                experiences={experiences}
                onView={handleViewExperience}
                onEdit={(exp) => setEditingExperience(exp)}
                onDelete={handleDeleteExperience}
                onNavigate={setTab}
                onSearch={handleSearch}
                onCategoryFilter={handleCategoryFilter}
                onSortChange={handleSortChange}
              />
            )}

            {currentTab === 'add-experience' && (
              <AddExperience
                onAdd={handleCreateExperience}
                onNavigate={setTab}
              />
            )}

            {currentTab === 'timeline' && (
              <TimelineView
                onSelectExperience={handleViewExperience}
              />
            )}

            {currentTab === 'pending-queue' && (
              <PendingQueueView
                onPromoteToFullExperience={(item) => {
                  setTab('add-experience');
                  showNotification(`Dequeued "${item.title}". Ready to complete documentation!`, 'info');
                }}
              />
            )}

            {currentTab === 'top-rated' && (
              <TopExperiencesView
                onSelectExperience={handleViewExperience}
              />
            )}

            {currentTab === 'bst-lookup' && (
              <BSTLookupView
                onSelectExperience={handleViewExperience}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView
                onNavigate={setTab}
                onViewDetails={handleViewExperience}
              />
            )}

            {currentTab === 'memory-lane' && (
              <MemoryLaneView
                onNavigate={setTab}
                onViewDetails={handleViewExperience}
              />
            )}
          </div>
        </main>
      </div>

      {/* Experience Details Modal */}
      {selectedExperience && (
        <ExperienceDetails
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
          onEdit={(exp) => {
            setSelectedExperience(null);
            setEditingExperience(exp);
          }}
          onDelete={(id) => {
            handleDeleteExperience(id);
            setSelectedExperience(null);
          }}
        />
      )}

      {/* Edit Experience Modal */}
      {editingExperience && (
        <EditExperience
          experience={editingExperience}
          onClose={() => setEditingExperience(null)}
          onUpdate={handleUpdateExperience}
        />
      )}
    </div>
  );
}
