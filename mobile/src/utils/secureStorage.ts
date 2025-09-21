import { Platform } from 'react-native';

// Dynamic import for expo-secure-store to handle cases where it's not available
let SecureStore: any = null;

// Try to import expo-secure-store, fallback to null if not available
try {
  SecureStore = require('expo-secure-store');
} catch (error) {
  console.warn('expo-secure-store not available, falling back to localStorage');
}

class SecureStorage {
  private static instance: SecureStorage;
  
  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web' || !SecureStore) {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error('Error storing secure item:', error);
      // Fallback to localStorage if SecureStore fails
      try {
        localStorage.setItem(key, value);
      } catch (fallbackError) {
        console.error('Fallback storage also failed:', fallbackError);
        throw error;
      }
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web' || !SecureStore) {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error('Error retrieving secure item:', error);
      // Fallback to localStorage if SecureStore fails
      try {
        return localStorage.getItem(key);
      } catch (fallbackError) {
        console.error('Fallback retrieval also failed:', fallbackError);
        return null;
      }
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web' || !SecureStore) {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Error removing secure item:', error);
      // Fallback to localStorage if SecureStore fails
      try {
        localStorage.removeItem(key);
      } catch (fallbackError) {
        console.error('Fallback removal also failed:', fallbackError);
        throw error;
      }
    }
  }

  async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web' || !SecureStore) {
        localStorage.clear();
      } else {
        // SecureStore doesn't have a clear method, so we need to remove items individually
        // This is a limitation, but we can work around it
        console.warn('SecureStore clear not implemented - remove items individually');
        // For now, just clear localStorage as fallback
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  }
}

export const secureStorage = SecureStorage.getInstance();
