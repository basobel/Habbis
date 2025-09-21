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

  if (!isLoaded || !colors) {
    return (
      <TouchableOpacity style={[styles.button, styles[size], style]} disabled>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    );
  }

  const getButtonColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          textColor: colors.primary[600],
          borderColor: colors.primary[600],
          borderWidth: 1,
        };
      case 'danger':
        return {
          backgroundColor: colors.error[500],
          textColor: colors.text.inverse,
          borderColor: colors.error[500],
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.primary[600],
          textColor: colors.text.inverse,
          borderColor: colors.primary[600],
          borderWidth: 0,
        };
    }
  };

  const buttonColors = getButtonColors();
  
  const buttonStyle = [
    styles.button,
    styles[size],
    {
      backgroundColor: (disabled || loading) ? colors.background.secondary : buttonColors.backgroundColor,
      borderColor: (disabled || loading) ? colors.background.secondary : buttonColors.borderColor,
      borderWidth: buttonColors.borderWidth,
    },
    style,
  ];

  const textStyle = [
    styles.text,
    {
      color: (disabled || loading) ? colors.text.secondary : buttonColors.textColor,
    },
  ];

  const indicatorColor = variant === 'secondary' ? colors.primary[600] : colors.text.inverse;

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={indicatorColor} 
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
