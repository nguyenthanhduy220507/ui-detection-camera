import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Camera API
export const cameraApi = {
  getAll: () => api.get('/cameras'),
  getOne: (id: string) => api.get(`/cameras/${id}`),
  create: (data: any) => api.post('/cameras', data),
  update: (id: string, data: any) => api.patch(`/cameras/${id}`, data),
  delete: (id: string) => api.delete(`/cameras/${id}`),
  updateStatus: (id: string, status: string) => 
    api.patch(`/cameras/${id}/status`, { status }),
};

// Camera Groups API
export const cameraGroupApi = {
  getAll: () => api.get('/camera-groups'),
  getTree: () => api.get('/camera-groups/tree'),
  getOne: (id: string) => api.get(`/camera-groups/${id}`),
  create: (data: any) => api.post('/camera-groups', data),
  delete: (id: string) => api.delete(`/camera-groups/${id}`),
};

// Alert API
export const alertApi = {
  getAll: (cameraId?: string) => 
    api.get('/alerts', { params: { cameraId } }),
  getRecent: (limit: number = 10) => 
    api.get('/alerts/recent', { params: { limit } }),
  getOne: (id: string) => api.get(`/alerts/${id}`),
  delete: (id: string) => api.delete(`/alerts/${id}`),
};

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (username: string, password: string, role?: string) =>
    api.post('/auth/register', { username, password, role }),
};

