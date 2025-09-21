/**
 * @jest-environment jsdom
 */

import { logger } from '../../src/utils/logger';

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('debug', () => {
    it('should log debug message in development', () => {
      // Mock __DEV__ to true
      (global as any).__DEV__ = true;
      
      logger.debug('Test debug message', { data: 'test' });
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[DEBUG] Test debug message',
        { data: 'test' }
      );
    });

    it('should not log debug message in production', () => {
      // Mock __DEV__ to false
      (global as any).__DEV__ = false;
      
      logger.debug('Test debug message', { data: 'test' });
      
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should log info message in development', () => {
      (global as any).__DEV__ = true;
      
      logger.info('Test info message', { data: 'test' });
      
      expect(mockConsoleInfo).toHaveBeenCalledWith(
        '[INFO] Test info message',
        { data: 'test' }
      );
    });

    it('should not log info message in production', () => {
      (global as any).__DEV__ = false;
      
      logger.info('Test info message', { data: 'test' });
      
      expect(mockConsoleInfo).not.toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should always log warn message', () => {
      logger.warn('Test warn message', { data: 'test' });
      
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '[WARN] Test warn message',
        { data: 'test' }
      );
    });
  });

  describe('error', () => {
    it('should always log error message', () => {
      logger.error('Test error message', { data: 'test' });
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        '[ERROR] Test error message',
        { data: 'test' }
      );
    });
  });
});
