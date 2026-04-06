const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error);
  }
  return res.json();
}

// Dashboard
export const fetchDashboardStats = () => request('/dashboard/stats');

// Team
export const fetchTeamMembers = () => request('/team');

// Clients
export const fetchClients = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/clients${qs ? '?' + qs : ''}`);
};
export const fetchClient = (id) => request(`/clients/${id}`);
export const createClient = (data) => request('/clients', { method: 'POST', body: JSON.stringify(data) });
export const updateClient = (id, data) => request(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteClient = (id) => request(`/clients/${id}`, { method: 'DELETE' });

// Milestones
export const fetchMilestones = (clientId) => request(`/milestones/client/${clientId}`);
export const createMilestone = (data) => request('/milestones', { method: 'POST', body: JSON.stringify(data) });
export const updateMilestone = (id, data) => request(`/milestones/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteMilestone = (id) => request(`/milestones/${id}`, { method: 'DELETE' });

// Actions
export const fetchActions = () => request('/actions');
export const fetchUrgentActions = () => request('/actions/urgent');
export const fetchActionsByOwner = (name) => request(`/actions/by-owner/${encodeURIComponent(name)}`);
export const createAction = (data) => request('/actions', { method: 'POST', body: JSON.stringify(data) });
export const updateAction = (id, data) => request(`/actions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const updateActionStatus = (id, status) => request(`/actions/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const deleteAction = (id) => request(`/actions/${id}`, { method: 'DELETE' });
