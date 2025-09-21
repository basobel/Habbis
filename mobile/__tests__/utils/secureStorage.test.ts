/**
 * @jest-environment jsdom
 */

import { secureStorage } from '../../src/utils/secureStorage';

// Mock expo-secure-store
const mockSecureStore = {
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
};

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'web',
  },
}));

// Mock localStorage
const mockLocalStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('SecureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('should use localStorage on web platform', async () => {
      await secureStorage.setItem('test-key', 'test-value');
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('should handle errors gracefully', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      // Should not throw
      await expect(secureStorage.setItem('test-key', 'test-value')).resolves.toBeUndefined();
    });
  });

  describe('getItem', () => {
    it('should return value from localStorage on web platform', async () => {
      mockLocalStorage.getItem.mockReturnValue('test-value');
      
      const result = await secureStorage.getItem('test-key');
      
      expect(result).toBe('test-value');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should return null when key does not exist', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = await secureStorage.getItem('non-existent-key');
      
      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const result = await secureStorage.getItem('test-key');
      
      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage on web platform', async () => {
      await secureStorage.removeItem('test-key');
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle errors gracefully', async () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      // Should not throw
      await expect(secureStorage.removeItem('test-key')).resolves.toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should clear localStorage on web platform', async () => {
      await secureStorage.clear();
      
      expect(mockLocalStorage.clear).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockLocalStorage.clear.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      // Should not throw
      await expect(secureStorage.clear()).resolves.toBeUndefined();
    });
  });
});
