import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExperienceList from './components/ExperienceList';
import AddExperience from './components/AddExperience';
import { checkBackendHealth, fetchExperiences, createExperience, deleteExperience } from './services/api';

export default function App() {
  const [currentTab, setTab] = useState('dashboard');
  const [experiences, setExperiences] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

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

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await fetchExperiences();
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

    // Health poll interval every 30s
    const interval = setInterval(loadHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddExperience = async (payload) => {
    const created = await createExperience(payload);
    setExperiences((prev) => [created, ...prev]);
    showNotification('Experience saved successfully!', 'success');
  };

  const handleDeleteExperience = async (id) => {
    await deleteExperience(id);
    setExperiences((prev) => prev.filter((item) => item.id !== id));
    showNotification('Experience deleted', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      <Navbar health={health} onRefreshHealth={loadHealth} />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-4 py-3 rounded-xl border text-sm font-medium shadow-xl backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            {notification.msg}
          </div>
        </div>
      )}

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
              />
            )}

            {currentTab === 'experiences' && (
              <ExperienceList
                experiences={experiences}
                onDelete={handleDeleteExperience}
                onNavigate={setTab}
              />
            )}

            {currentTab === 'add-experience' && (
              <AddExperience
                onAdd={handleAddExperience}
                onNavigate={setTab}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
