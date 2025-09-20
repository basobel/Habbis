import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { useThemeFallback } from '@/hooks/useThemeFallback';

interface FormButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const buttonVariants = {
  primary: {
    backgroundColor: (getPrimaryColor: () => string) => getPrimaryColor(),
    textColor: (getTextColor: (variant: string) => string) => getTextColor('inverse'),
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: () => 'transparent',
    textColor: (getPrimaryColor: () => string) => getPrimaryColor(),
    borderWidth: 1,
    borderColor: (getPrimaryColor: () => string) => getPrimaryColor(),
  },
  danger: {
    backgroundColor: (getErrorColor: () => string) => getErrorColor(),
    textColor: (getTextColor: (variant: string) => string) => getTextColor('inverse'),
    borderWidth: 0,
  },
};

export default function FormButton({ 
  title, 
  loading = false, 
  variant = 'primary', 
  size = 'medium',
  style,
  disabled,
  ...props 
}: FormButtonProps) {
  const { 
    getPrimaryColor, 
    getTextColor, 
    getErrorColor,
    getBackgroundColor,
    isLoaded 
  } = useThemeFallback();

  const variantConfig = buttonVariants[variant];
  
  const buttonStyle = [
    styles.button,
    styles[size],
    {
      backgroundColor: variantConfig.backgroundColor(getPrimaryColor),
      borderWidth: variantConfig.borderWidth,
      ...(variantConfig.borderWidth > 0 && {
        borderColor: variantConfig.borderColor?.(getPrimaryColor),
      }),
    },
    (disabled || loading) && { 
      backgroundColor: getBackgroundColor('secondary'),
      borderColor: getBackgroundColor('secondary'),
    },
    style,
  ];

  const textStyle = [
    styles.text,
    {
      color: variantConfig.textColor(getTextColor),
    },
    (disabled || loading) && { 
      color: getTextColor('inverse'),
    },
  ];

  const indicatorColor = variant === 'secondary' ? getPrimaryColor() : getTextColor('inverse');

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
