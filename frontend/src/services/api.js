import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  verifyEmail: async (data) => {
    const response = await api.post('/auth/verify-email', data);
    return response.data;
  },
  resendOTP: async (data) => {
    const response = await api.post('/auth/resend-otp', data);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateAvatar: async (avatar) => {
    const response = await api.put('/auth/avatar', { avatar });
    return response.data;
  },

  setup2FA: async () => {
    const response = await api.post('/auth/2fa/setup');
    return response.data;
  },
  verify2FA: async (token) => {
    const response = await api.post('/auth/2fa/verify', { token });
    return response.data;
  },
  disable2FA: async (password) => {
    const response = await api.post('/auth/2fa/disable', { password });
    return response.data;
  }
};

export const todoApi = {
  getTodos: async (params = {}) => {
    const response = await api.get('/todos', { params });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/todos/stats');
    return response.data;
  },
  createTodo: async (todoData) => {
    const response = await api.post('/todos', todoData);
    return response.data;
  },
  updateTodo: async (id, updateData) => {
    const response = await api.put(`/todos/${id}`, updateData);
    return response.data;
  },
  deleteTodo: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },
  clearCompleted: async () => {
    const response = await api.delete('/todos/completed/clear');
    return response.data;
  }
};

export default api;
