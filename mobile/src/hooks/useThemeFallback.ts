import { useThemeContext } from '@/contexts/ThemeContext';

interface FallbackColors {
  primary: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  backgroundCard: string;
  backgroundSecondary: string;
  borderPrimary: string;
  borderSecondary: string;
  error: string;
  success: string;
  placeholder: string;
}

const fallbackColors: FallbackColors = {
  primary: '#7C3AED',
  textPrimary: '#4C1D95',
  textSecondary: '#64748B',
  textInverse: '#FFFFFF',
  backgroundCard: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  borderPrimary: '#E2E8F0',
  borderSecondary: '#E2E8F0',
  error: '#EF4444',
  success: '#10B981',
  placeholder: '#9CA3AF',
};

export const useThemeFallback = () => {
  const { colors, isLoaded } = useThemeContext();

  const getColor = (path: string, fallback: string): string => {
    if (!isLoaded || !colors) {
      return fallback;
    }

    const keys = path.split('.');
    let value: any = colors;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return fallback;
      }
    }
    
    return typeof value === 'string' ? value : fallback;
  };

  const getTextColor = (variant: 'primary' | 'secondary' | 'inverse' | 'placeholder' = 'primary'): string => {
    const fallbackMap = {
      primary: fallbackColors.textPrimary,
      secondary: fallbackColors.textSecondary,
      inverse: fallbackColors.textInverse,
      placeholder: fallbackColors.placeholder,
    };
    
    return getColor(`text.${variant}`, fallbackMap[variant]);
  };

  const getBackgroundColor = (variant: 'card' | 'secondary' | 'primary' = 'card'): string => {
    const fallbackMap = {
      card: fallbackColors.backgroundCard,
      secondary: fallbackColors.backgroundSecondary,
      primary: fallbackColors.backgroundCard,
    };
    
    return getColor(`background.${variant}`, fallbackMap[variant]);
  };

  const getBorderColor = (variant: 'primary' | 'secondary' | 'error' = 'primary'): string => {
    const fallbackMap = {
      primary: fallbackColors.borderPrimary,
      secondary: fallbackColors.borderSecondary,
      error: fallbackColors.error,
    };
    
    return getColor(`border.${variant}`, fallbackMap[variant]);
  };

  const getPrimaryColor = (shade: number = 600): string => {
    return getColor(`primary.${shade}`, fallbackColors.primary);
  };

  const getErrorColor = (shade: number = 500): string => {
    return getColor(`error.${shade}`, fallbackColors.error);
  };

  const getSuccessColor = (shade: number = 500): string => {
    return getColor(`success.${shade}`, fallbackColors.success);
  };

  return {
    colors,
    isLoaded,
    fallbackColors,
    getColor,
    getTextColor,
    getBackgroundColor,
    getBorderColor,
    getPrimaryColor,
    getErrorColor,
    getSuccessColor,
  };
};
