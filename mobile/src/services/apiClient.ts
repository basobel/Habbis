import axios from 'axios';

// Base URL for API
const BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage to avoid circular dependency
    const token = typeof window !== 'undefined' ? localStorage.getItem('persist:root') : null;
    let authToken = null;
    
    if (token) {
      try {
        const parsed = JSON.parse(token);
        const auth = JSON.parse(parsed.auth || '{}');
        authToken = auth.token;
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    console.log('apiClient request:', { url: config.url, hasToken: !!authToken });
    
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root');
        window.location.reload(); // Simple way to reset app state
      }
    }
    
    return Promise.reject(error);
  }
);

export { apiClient };
