import { api } from './client';

export const requestsApi = {
  // Get all sent and received requests (can filter by type: 'sent' | 'received' | 'all')
  getAll: (type = 'all') => api.get(`/requests?type=${type}`),

  // Send an exchange request for a listing
  create: (data) => api.post('/requests', data),

  // Update status (status: 'accepted' | 'rejected')
  updateStatus: (id, status) => api.patch(`/requests/${id}`, { status }),
};
