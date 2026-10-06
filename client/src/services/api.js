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

export async function fetchExperiences(sortBy = null, direction = null) {
  let url = `${API_BASE}/experiences`;
  const params = new URLSearchParams();
  if (sortBy) params.append('sortBy', sortBy);
  if (direction) params.append('direction', direction);
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch experiences: ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchExperienceById(id) {
  const res = await fetch(`${API_BASE}/experiences/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch experience #${id}`);
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
    const errorBody = await res.json().catch(() => null);
    if (errorBody && errorBody.validationErrors) {
      const msgs = Object.values(errorBody.validationErrors).join(', ');
      throw new Error(msgs || errorBody.message);
    }
    throw new Error(errorBody?.message || 'Failed to create experience');
  }
  return await res.json();
}

export async function updateExperience(id, data) {
  const res = await fetch(`${API_BASE}/experiences/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    if (errorBody && errorBody.validationErrors) {
      const msgs = Object.values(errorBody.validationErrors).join(', ');
      throw new Error(msgs || errorBody.message);
    }
    throw new Error(errorBody?.message || `Failed to update experience #${id}`);
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

export async function searchExperiences(query) {
  const res = await fetch(`${API_BASE}/experiences/search?query=${encodeURIComponent(query || '')}`);
  if (!res.ok) {
    throw new Error('Search failed');
  }
  return await res.json();
}

export async function filterByCategory(category) {
  const res = await fetch(`${API_BASE}/experiences/category/${encodeURIComponent(category)}`);
  if (!res.ok) {
    throw new Error(`Failed to filter by category: ${category}`);
  }
  return await res.json();
}

export async function filterByRating(rating) {
  const res = await fetch(`${API_BASE}/experiences/rating/${rating}`);
  if (!res.ok) {
    throw new Error(`Failed to filter by rating: ${rating}`);
  }
  return await res.json();
}

// ==========================================
// DSA INTEGRATION APIS
// ==========================================

export async function fetchTimeline() {
  const res = await fetch(`${API_BASE}/experiences/timeline`);
  if (!res.ok) {
    throw new Error('Failed to fetch timeline');
  }
  return await res.json();
}

export async function fetchRecentlyViewed(limit = 10) {
  const res = await fetch(`${API_BASE}/experiences/recent?limit=${limit}`);
  if (!res.ok) {
    throw new Error('Failed to fetch recently viewed');
  }
  return await res.json();
}

export async function clearRecentlyViewed() {
  const res = await fetch(`${API_BASE}/experiences/recent`, {
    method: 'DELETE',
  });
  return res.ok;
}

export async function fetchPendingExperiences() {
  const res = await fetch(`${API_BASE}/experiences/pending`);
  if (!res.ok) {
    throw new Error('Failed to fetch pending queue');
  }
  return await res.json();
}

export async function enqueuePending(data) {
  const res = await fetch(`${API_BASE}/experiences/pending`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to enqueue pending item');
  }
  return await res.json();
}

export async function dequeueNextPending() {
  const res = await fetch(`${API_BASE}/experiences/pending/next`, {
    method: 'DELETE',
  });
  if (!res.ok || res.status === 204) {
    return null;
  }
  return await res.json();
}

export async function deletePendingById(id) {
  const res = await fetch(`${API_BASE}/experiences/pending/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

export async function fetchTopExperiences(limit = 5) {
  const res = await fetch(`${API_BASE}/experiences/top?limit=${limit}`);
  if (!res.ok) {
    throw new Error('Failed to fetch top experiences');
  }
  return await res.json();
}

export async function searchBstId(id) {
  const res = await fetch(`${API_BASE}/experiences/search/id/${id}`);
  if (!res.ok) {
    return null;
  }
  return await res.json();
}

export async function fetchBstStats() {
  const res = await fetch(`${API_BASE}/experiences/bst/stats`);
  if (!res.ok) {
    return null;
  }
  return await res.json();
}
