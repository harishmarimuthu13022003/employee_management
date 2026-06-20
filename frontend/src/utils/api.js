import axios from 'axios';

const api = axios.create({
  // Vite injects the proper base URL depending on the build mode.
  // Development (npm run dev) → VITE_API_BASE_URL_LOCAL
  // Production (Vercel)      → VITE_API_BASE_URL_PROD https://employee-management-6ud1.onrender.com
  baseURL: import.meta.env.PROD
    ? (import.meta.env.VITE_API_BASE_URL_PROD || "https://employee-management-6ud1.onrender.com/api")
    : import.meta.env.VITE_API_BASE_URL_LOCAL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach auth header
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

// Interceptor to handle session expirations
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on the login page to avoid infinite loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
