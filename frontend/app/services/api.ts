import axios from 'axios';
import { Platform } from 'react-native';
import { NativeModules } from 'react-native';
import { useAppStore } from '../store/useAppStore';

// Dynamically extract the host Mac's IP address from the Metro bundler script URL
const getBaseUrl = () => {
  const scriptURL = NativeModules.SourceCode?.scriptURL || '';
  
  // In Release builds, scriptURL is 'assets://index.android.bundle'
  // We must explicitly check for this and use the fallback IP.
  let host = '192.168.1.22';
  
  if (scriptURL.startsWith('http')) {
    host = scriptURL.split('://')[1]?.split('/')[0]?.split(':')[0] || host;
  }
  
  const url = `http://${host}:3000/api`;
  console.log("[API Service] Resolved Base URL for requests:", url);
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to append authorization token
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

export default api;
