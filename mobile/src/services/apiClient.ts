import axios from 'axios';
import { config } from '@/config/environment';
import { logger } from '@/utils/logger';
import { secureStorage } from '@/utils/secureStorage';

// Create axios instance
const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get token from secure storage
      const authToken = await secureStorage.getItem('auth_token');
      
      // Only log in development for debugging
      if (__DEV__) {
        logger.debug('API Request', { url: config.url, hasToken: !!authToken });
      }
      
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      
      return config;
    } catch (error) {
      logger.error('Error getting auth token', error);
      // Fallback to localStorage if secureStorage fails
      try {
        const fallbackToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (fallbackToken) {
          config.headers.Authorization = `Bearer ${fallbackToken}`;
        }
      } catch (fallbackError) {
        logger.error('Fallback token retrieval also failed', fallbackError);
      }
      return config;
    }
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
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      try {
        await secureStorage.removeItem('auth_token');
        // Also clear localStorage as fallback
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          // Don't reload - let the app handle the auth state change
          logger.warn('Token expired, cleared from storage');
        }
      } catch (storageError) {
        logger.error('Error clearing auth token', storageError);
        // Fallback to localStorage only
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            logger.warn('Token expired, cleared from localStorage fallback');
          }
        } catch (fallbackError) {
          logger.error('Fallback token clearing also failed', fallbackError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export { apiClient };
