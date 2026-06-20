import axios from 'axios';
import { useAppStore } from '../store/useAppStore';

const getBaseUrl = () => {
  // If running in browser/webview, use relative path or absolute domain
  if (typeof window !== 'undefined') {
    // For local dev, relative path goes to Next.js API Routes.
    // For Capacitor, this must be an absolute URL of the deployed server.
    return window.location.origin.includes('localhost') || window.location.origin.includes('192.168.')
      ? '/api' 
      : 'https://my-unified-app.vercel.app/api'; 
  }
  return 'http://127.0.0.1:3000/api'; // Server-side fetching fallback
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = useAppStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAppStore.getState().logout();
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
