import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeFallback } from '@/hooks/useThemeFallback';

interface ValidationErrorsProps {
  errors: Record<string, string>;
}

export default function ValidationErrors({ errors }: ValidationErrorsProps) {
  const { getTextColor, getBackgroundColor, getBorderColor, getErrorColor } = useThemeFallback();

  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, {
      backgroundColor: getBackgroundColor('secondary'),
      borderColor: getBorderColor('error'),
    }]}>
      <Text style={[styles.title, { color: getErrorColor() }]}>
        Please fix the following errors:
      </Text>
      {Object.entries(errors).map(([field, message]) => (
        <Text key={field} style={[styles.error, { color: getErrorColor() }]}>
          • {message}
        </Text>
      ))}
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
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  error: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
});
