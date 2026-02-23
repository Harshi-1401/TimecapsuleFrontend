import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Capsule API
export const capsuleAPI = {
  create: (formData) => {
    return api.post('/capsules', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getAll: () => api.get('/capsules'),
  getOne: (id) => api.get(`/capsules/${id}`),
  getPublic: () => api.get('/capsules/public'),
  delete: (id) => api.delete(`/capsules/${id}`)
};

export default api;
