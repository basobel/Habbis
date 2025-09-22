import axios from 'axios';
import { config } from '@/config/environment';
import { store } from '@/store';
import { clearAuth } from '@/store/slices/authSlice';
import { router } from 'expo-router';
import { logger } from '@/utils/logger';
import { secureStorage } from '@/utils/secureStorage';

// Create axios instance for auth interceptor
const authApiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Global reference to store for use in interceptor
let globalStore: typeof store | null = null;

export const setGlobalStore = (storeInstance: typeof store) => {
  globalStore = storeInstance;
};

// Function to handle automatic logout
const handleAuthError = async () => {
  try {
    logger.warn('Authentication error detected, logging out user');
    
    // Clear auth data from storage
    await secureStorage.removeItem('auth_token');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    
    // Clear auth state in Redux
    if (globalStore) {
      globalStore.dispatch(clearAuth());
    }
    
    // Navigate to login screen - use setTimeout to avoid navigation issues
    setTimeout(() => {
      try {
        router.replace('/login');
      } catch (navError) {
        logger.error('Navigation error during logout:', navError);
        // Fallback: reload the app
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }, 100);
    
    logger.info('User automatically logged out due to authentication error');
  } catch (error) {
    logger.error('Error during automatic logout:', error);
  }
};

// Response interceptor for handling auth errors
authApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';
    const url = error.config?.url || '';
    const fullUrl = error.config?.baseURL + url;
    
    logger.error('API Error', {
      url,
      fullUrl,
      status,
      message,
      method: error.config?.method,
      headers: error.config?.headers,
      responseData: error.response?.data,
    });
    
    // Only logout on actual authentication errors, not on other 401/403 errors
    const isAuthError = status === 401 && (
      message.toLowerCase().includes('unauthenticated') ||
      message.toLowerCase().includes('token') ||
      message.toLowerCase().includes('unauthorized') ||
      message.toLowerCase().includes('expired') ||
      message.toLowerCase().includes('invalid')
    );
    
    const isForbiddenError = status === 403 && (
      message.toLowerCase().includes('forbidden') ||
      message.toLowerCase().includes('access denied') ||
      message.toLowerCase().includes('unauthorized')
    );
    
    if (isAuthError || isForbiddenError) {
      logger.warn(`Authentication error: ${status}`, {
        url,
        method: error.config?.method,
        message,
        isAuthError,
        isForbiddenError,
      });
      
      // Only logout on actual auth errors and if user is authenticated
      if (globalStore) {
        const state = globalStore.getState();
        if (state.auth?.isAuthenticated) {
          await handleAuthError();
        } else {
          logger.info('User not authenticated, skipping logout');
        }
      } else {
        logger.warn('Global store not available, skipping logout');
      }
    } else if (status === 401 || status === 403) {
      // Log other 401/403 errors but don't logout
      logger.info(`Non-auth error: ${status}`, {
        url,
        method: error.config?.method,
        message,
      });
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor to add auth token (existing functionality)
authApiClient.interceptors.request.use(
  async (config) => {
    try {
      const authToken = await secureStorage.getItem('auth_token');
      
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      
      return config;
    } catch (error) {
      logger.error('Error getting auth token', error);
      
      // Fallback to localStorage
      try {
        const fallbackToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (fallbackToken) {
          config.headers.Authorization = `Bearer ${fallbackToken}`;
        }
      } catch (fallbackError) {
        logger.error('Fallback token retrieval failed', fallbackError);
      }
      
      return config;
    }
  },
  (error) => {
    logger.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

export { handleAuthError, authApiClient };
