import { api } from './client';

export const listingsApi = {
  // Query params can be: search, skill, skillOffered, skillWanted, level, status, user
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    return api.get(`/listings${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => api.get(`/listings/${id}`),

  create: (listingData) => api.post('/listings', listingData),

  update: (id, listingData) => api.put(`/listings/${id}`, listingData),

  delete: (id) => api.delete(`/listings/${id}`),
};
