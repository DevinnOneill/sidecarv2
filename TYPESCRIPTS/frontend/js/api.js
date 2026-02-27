/**
 * SIDECAR — TypeScript API Client (browser-side)
 * All responses now wrapped: { success: true, data: ... }
 * Types mirror src/types/index.ts — shared contract.
 */

const API_BASE = window.location.origin;

async function apiFetch(path, options = {}) {
  const token = sessionStorage.getItem('sidecar_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const json = await res.json();
  // Unwrap the { success, data } envelope
  return json.data !== undefined ? json.data : json;
}

const API = {
  health:           ()         => apiFetch('/api/health'),
  getUsers:         ()         => apiFetch('/api/auth/users'),
  login:            (userId)   => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ userId }) }),
  getSailors:       (p = {})   => apiFetch('/api/sailors?' + new URLSearchParams(p)),
  getSailor:        (id)       => apiFetch(`/api/sailors/${id}`),
  getSailorApps:    (id)       => apiFetch(`/api/sailors/${id}/applications`),
  getSailorEmails:  (id)       => apiFetch(`/api/sailors/${id}/emails`),
  getBillets:       (p = {})   => apiFetch('/api/billets?' + new URLSearchParams(p)),
  getBillet:        (id)       => apiFetch(`/api/billets/${id}`),
  getOrders:        (p = {})   => apiFetch('/api/orders?' + new URLSearchParams(p)),
  runPreQA:         (data)     => apiFetch('/api/orders/preqa', { method: 'POST', body: JSON.stringify(data) }),
  getAvails:        (p = {})   => apiFetch('/api/avails?' + new URLSearchParams(p)),
  getChannels:      ()         => apiFetch('/api/messages/channels'),
  getMessages:      (id)       => apiFetch(`/api/messages/channels/${id}`),
  getDashboard:     ()         => apiFetch('/api/analytics/dashboard'),
  getFleetData:     ()         => apiFetch('/api/analytics/fleet-readiness'),
  getAnnouncements: (p = {})   => apiFetch('/api/announcements?' + new URLSearchParams(p)),
  getAuditLog:      (p = {})   => apiFetch('/api/audit?' + new URLSearchParams(p)),
};
