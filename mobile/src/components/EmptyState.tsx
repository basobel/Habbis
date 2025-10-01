import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'default' | 'search' | 'error' | 'success';
}

export default function EmptyState({ 
  icon,
  title, 
  message, 
  actionText, 
  onAction,
  variant = 'default' 
}: EmptyStateProps) {
  const { colors, isLoaded } = useThemeContext();

  const getIconAndColor = () => {
    if (icon) {
      return { icon, color: '#6B7280' };
    }

    switch (variant) {
      case 'search':
        return { icon: 'search' as const, color: '#6B7280' };
      case 'error':
        return { icon: 'alert-circle' as const, color: '#EF4444' };
      case 'success':
        return { icon: 'checkmark-circle' as const, color: '#10B981' };
      default:
        return { icon: 'document-text' as const, color: '#6B7280' };
    }
  };

  const { icon: displayIcon, color: iconColor } = getIconAndColor();
  const backgroundColor = isLoaded && colors ? colors.background.primary : '#FFFFFF';
  const textColor = isLoaded && colors ? colors.text.primary : '#1F2937';
  const secondaryTextColor = isLoaded && colors ? colors.text.secondary : '#6B7280';
  const buttonColor = isLoaded && colors ? colors.primary[600] : '#7C3AED';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Ionicons name={displayIcon} size={48} color={iconColor} />
      <Text style={[styles.title, { color: textColor }]}>
        {title}
      </Text>
      {message && (
        <Text style={[styles.message, { color: secondaryTextColor }]}>
          {message}
        </Text>
      )}
      {actionText && onAction && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: buttonColor }]}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
