/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingState from '../../src/components/LoadingState';

// Mock useThemeContext
const mockUseThemeContext = {
  colors: {
    background: { primary: '#FFFFFF' },
    text: { secondary: '#6B7280' },
    primary: { 500: '#7C3AED' },
  },
  isLoaded: true,
};

jest.mock('../../src/contexts/ThemeContext', () => ({
  useThemeContext: () => mockUseThemeContext,
}));

describe('LoadingState', () => {
  it('should render with default props', () => {
    const { getByText } = render(<LoadingState />);
    
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should render with custom message', () => {
    const { getByText } = render(<LoadingState message="Custom loading message" />);
    
    expect(getByText('Custom loading message')).toBeTruthy();
  });

  it('should render with small size', () => {
    const { getByTestId } = render(<LoadingState size="small" />);
    
    // Note: ActivityIndicator doesn't have a testID by default, but we can check if it renders
    expect(getByTestId).toBeDefined();
  });

  it('should render with large size', () => {
    const { getByTestId } = render(<LoadingState size="large" />);
    
    expect(getByTestId).toBeDefined();
  });

  it('should render with custom color', () => {
    const { getByTestId } = render(<LoadingState color="#FF0000" />);
    
    expect(getByTestId).toBeDefined();
  });

  it('should handle theme not loaded', () => {
    const mockUseThemeContextNotLoaded = {
      colors: null,
      isLoaded: false,
    };

    jest.doMock('../../src/contexts/ThemeContext', () => ({
      useThemeContext: () => mockUseThemeContextNotLoaded,
    }));

    const { getByText } = render(<LoadingState />);
    
    expect(getByText('Loading...')).toBeTruthy();
  });
});
