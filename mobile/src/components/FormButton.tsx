import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

interface FormButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export default function FormButton({ 
  title, 
  loading = false, 
  variant = 'primary', 
  size = 'medium',
  style,
  disabled,
  ...props 
}: FormButtonProps) {
  const { colors, isLoaded } = useThemeContext();

  // Fallback colors if theme not loaded
  const fallbackColors = {
    primary: '#7C3AED',
    textInverse: '#FFFFFF',
    textSecondary: '#64748B',
    error: '#EF4444',
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (!isLoaded || !colors) {
      // Fallback styles
      switch (variant) {
        case 'primary':
          return [...baseStyle, { backgroundColor: fallbackColors.primary }];
        case 'secondary':
          return [...baseStyle, { 
            backgroundColor: 'transparent', 
            borderWidth: 1, 
            borderColor: fallbackColors.primary 
          }];
        case 'danger':
          return [...baseStyle, { backgroundColor: fallbackColors.error }];
        default:
          return [...baseStyle, { backgroundColor: fallbackColors.primary }];
      }
    }

    // Theme-based styles
    switch (variant) {
      case 'primary':
        return [...baseStyle, { backgroundColor: colors?.primary?.[600] || fallbackColors.primary }];
      case 'secondary':
        return [...baseStyle, { 
          backgroundColor: 'transparent', 
          borderWidth: 1, 
          borderColor: colors?.primary?.[600] || fallbackColors.primary 
        }];
      case 'danger':
        return [...baseStyle, { backgroundColor: colors?.error?.[500] || fallbackColors.error }];
      default:
        return [...baseStyle, { backgroundColor: colors?.primary?.[600] || fallbackColors.primary }];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    if (!isLoaded || !colors) {
      // Fallback styles
      switch (variant) {
        case 'primary':
        case 'danger':
          return [...baseStyle, { color: fallbackColors.textInverse }];
        case 'secondary':
          return [...baseStyle, { color: fallbackColors.primary }];
        default:
          return [...baseStyle, { color: fallbackColors.textInverse }];
      }
    }

    // Theme-based styles
    switch (variant) {
      case 'primary':
      case 'danger':
        return [...baseStyle, { color: colors?.text?.inverse || fallbackColors.textInverse }];
      case 'secondary':
        return [...baseStyle, { color: colors?.primary?.[600] || fallbackColors.primary }];
      default:
        return [...baseStyle, { color: colors?.text?.inverse || fallbackColors.textInverse }];
    }
  };

  const getIndicatorColor = () => {
    if (!isLoaded || !colors) {
      return variant === 'primary' ? fallbackColors.textInverse : fallbackColors.primary;
    }
    return variant === 'primary' ? colors?.text?.inverse || fallbackColors.textInverse : colors?.primary?.[600] || fallbackColors.primary;
  };

  const buttonStyle = [
    ...getButtonStyle(),
    (disabled || loading) && { 
      backgroundColor: colors?.secondary?.[400] || fallbackColors.textSecondary,
      borderColor: colors?.secondary?.[400] || fallbackColors.textSecondary,
    },
    style,
  ];

  const textStyle = [
    ...getTextStyle(),
    (disabled || loading) && { 
      color: colors?.text?.inverse || fallbackColors.textInverse 
    },
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={getIndicatorColor()} 
          size="small" 
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
