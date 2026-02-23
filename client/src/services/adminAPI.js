import api from './api';

// Admin API endpoints
export const adminAPI = {
  // System stats
  getStats: () => api.get('/admin/stats'),
  
  // User management
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Capsule management
  getAllCapsules: (params) => api.get('/admin/capsules', { params }),
  deleteCapsule: (id) => api.delete(`/admin/capsules/${id}`),
  reviewCapsule: (id) => api.put(`/admin/capsules/${id}/review`),
  
  // Create admin
  createAdmin: (data) => api.post('/admin/create-admin', data)
};

// Report capsule (for regular users)
export const reportCapsule = (id, reason) => api.post(`/capsules/${id}/report`, { reason });
