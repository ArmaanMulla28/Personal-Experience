const API_BASE = '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Health check failed:', err);
    return null;
  }
}

export async function fetchExperiences() {
  const res = await fetch(`${API_BASE}/experiences`);
  if (!res.ok) {
    throw new Error(`Failed to fetch experiences: ${res.statusText}`);
  }
  return await res.json();
}

export async function createExperience(data) {
  const res = await fetch(`${API_BASE}/experiences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to create experience');
  }
  return await res.json();
}

export async function deleteExperience(id) {
  const res = await fetch(`${API_BASE}/experiences/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete experience #${id}`);
  }
  return true;
}
