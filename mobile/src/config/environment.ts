// Environment configuration
export const config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
    timeout: 10000,
  },
  app: {
    name: 'Habbis',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  features: {
    enableLogging: __DEV__,
    enableAnalytics: !__DEV__,
    enableCrashReporting: !__DEV__,
  },
};
