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
import Toast from './components/Toast';
import ConfirmationModal from './components/ConfirmationModal';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('lifelog-theme') || 'dark';
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('lifelog-theme', next);
  };

  // Modal states
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
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

  const executeDeleteExperience = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((item) => item.id !== id));
      if (selectedExperience && selectedExperience.id === id) {
        setSelectedExperience(null);
      }
      showNotification(`Experience #${id} permanently deleted.`, 'info');
    } catch {
      showNotification(`Failed to delete experience #${id}`, 'error');
    }
  };

  const handleSearch = async (query) => {
    if (!query || !query.trim()) {
      return loadExperiences();
    }
    try {
      setLoading(true);
      const results = await searchExperiences(query.trim());
      setExperiences(results || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    try {
      setLoading(true);
      const results = await filterByCategory(category);
      setExperiences(results || []);
    } catch (err) {
      console.error('Category filter failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortBy, direction) => {
    loadExperiences(sortBy, direction);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      <Navbar
        health={health}
        onRefreshHealth={loadHealth}
        theme={theme}
        onToggleTheme={toggleTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Notification Toast */}
      {notification && (
        <Toast
          message={notification.msg}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteConfirmId)}
        title="Delete Experience"
        message="Are you sure you want to permanently delete this experience? It will be removed from PostgreSQL and custom Java DSA indices."
        confirmLabel="Delete Experience"
        isDanger={true}
        onConfirm={executeDeleteExperience}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-50 w-72 bg-slate-950 border-r border-slate-800 h-full flex flex-col">
            <Sidebar
              currentTab={currentTab}
              setTab={(tab) => {
                setTab(tab);
                setIsMobileMenuOpen(false);
              }}
              experienceCount={experiences.length}
            />
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:flex">
          <Sidebar
            currentTab={currentTab}
            setTab={setTab}
            experienceCount={experiences.length}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-950/50">
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
                onDelete={(id) => setDeleteConfirmId(id)}
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
            setDeleteConfirmId(id);
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
