module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/android/',
    '<rootDir>/ios/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@expo|expo|@unimodules|unimodules|sentry-expo|native-base|react-navigation|@react-navigation|@react-native-community|@react-native-picker|react-native-vector-icons|react-native-svg|react-native-gesture-handler|react-native-reanimated|react-native-screens|react-native-safe-area-context|@react-native-async-storage|expo-secure-store|expo-constants|expo-linking|expo-notifications|expo-splash-screen|expo-status-bar|expo-system-ui|expo-web-browser|expo-linear-gradient|expo-haptics|expo-blur)/)',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};