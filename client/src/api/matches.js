import { api } from './client';

export const matchesApi = {
  getMatches: () => api.get('/matches'),
};
