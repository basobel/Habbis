// Fallback colors for when theme is not loaded
export const FALLBACK_COLORS = {
  primary: '#7C3AED',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
    placeholder: '#9CA3AF',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    card: '#FFFFFF',
  },
  border: {
    primary: '#E2E8F0',
    secondary: '#E2E8F0',
  },
  error: {
    500: '#EF4444',
  },
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

// Common spacing values
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Common border radius values
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Common font sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
} as const;

// Common font weights
export const FONT_WEIGHTS = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;
