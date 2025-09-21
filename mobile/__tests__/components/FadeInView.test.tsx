/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Animated } from 'react-native';
import FadeInView from '../../src/components/FadeInView';

// Mock Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = jest.fn(() => ({
    start: jest.fn(),
  }));
  return RN;
});

describe('FadeInView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    const { getByText } = render(
      <FadeInView>
        <div>Test Content</div>
      </FadeInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should use default duration and delay', () => {
    render(
      <FadeInView>
        <div>Test Content</div>
      </FadeInView>
    );
    
    expect(Animated.timing).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        toValue: 1,
        duration: 300,
        delay: 0,
        useNativeDriver: true,
      })
    );
  });

  it('should use custom duration and delay', () => {
    render(
      <FadeInView duration={500} delay={100}>
        <div>Test Content</div>
      </FadeInView>
    );
    
    expect(Animated.timing).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      })
    );
  });

  it('should start animation on mount', () => {
    const mockStart = jest.fn();
    (Animated.timing as jest.Mock).mockReturnValue({
      start: mockStart,
    });
    
    render(
      <FadeInView>
        <div>Test Content</div>
      </FadeInView>
    );
    
    expect(mockStart).toHaveBeenCalled();
  });
});
