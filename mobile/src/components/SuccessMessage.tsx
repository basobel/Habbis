import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

interface SuccessMessageProps {
  message: string;
  visible?: boolean;
}

export default function SuccessMessage({ message, visible = true }: SuccessMessageProps) {
  const { colors, isLoaded } = useThemeContext();

  if (!visible || !message) {
    return null;
  }

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
      }]}>
        <Text style={[styles.message, { color: '#10B981' }]}>
          {message}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {
      backgroundColor: colors.background.secondary,
      borderColor: colors.border.primary,
    }]}>
      <Text style={[styles.message, { color: colors.accent.success || '#10B981' }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
