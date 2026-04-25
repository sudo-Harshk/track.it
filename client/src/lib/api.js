const trimmed = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
/** In dev, empty VITE_API_URL + Vite `server.proxy` uses same-origin `/api/...`. */
const baseUrl = import.meta.env.DEV && trimmed === '' ? '' : trimmed || 'http://localhost:3001';

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const error = new Error(payload.error || payload.message || 'Request failed');
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getJobs() {
  return request('/api/jobs');
}

export function addJob(data) {
  return request('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateJob(id, data) {
  return request(`/api/jobs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteJob(id) {
  return request(`/api/jobs/${id}`, {
    method: 'DELETE',
  });
}

