import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
};

export const bookService = {
  getBooks: async (params = {}) => {
    const res = await api.get('/books', { params });
    return res.data;
  },
  getBookById: async (id) => {
    const res = await api.get(`/books/${id}`);
    return res.data;
  },
  createBook: async (bookData) => {
    const res = await api.post('/books', bookData);
    return res.data;
  },
  updateBook: async (id, bookData) => {
    const res = await api.put(`/books/${id}`, bookData);
    return res.data;
  },
  deleteBook: async (id) => {
    const res = await api.delete(`/books/${id}`);
    return res.data;
  },
};

export default api;
