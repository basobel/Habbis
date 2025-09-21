import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
  variant?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({ 
  message, 
  onRetry, 
  showRetry = false,
  variant = 'error' 
}: ErrorMessageProps) {
  const { colors, isLoaded } = useThemeContext();

  const getIconAndColor = () => {
    switch (variant) {
      case 'warning':
        return { icon: 'warning' as const, color: '#F59E0B' };
      case 'info':
        return { icon: 'information-circle' as const, color: '#3B82F6' };
      default:
        return { icon: 'alert-circle' as const, color: '#EF4444' };
    }
  };

  const { icon, color } = getIconAndColor();
  const backgroundColor = isLoaded && colors ? colors.background.secondary : '#F8FAFC';
  const borderColor = isLoaded && colors ? colors.border.primary : '#E2E8F0';
  const textColor = isLoaded && colors ? colors.text.primary : '#1F2937';
  const retryButtonColor = isLoaded && colors ? colors.primary[600] : '#7C3AED';

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <View style={styles.content}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={[styles.message, { color: textColor }]}>
          {message}
        </Text>
      </View>
      {showRetry && onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: retryButtonColor }]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
