import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

interface ValidationErrorsProps {
  errors: Record<string, string>;
}

export default function ValidationErrors({ errors }: ValidationErrorsProps) {
  const { colors, isLoaded } = useThemeContext();

  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, {
        backgroundColor: '#F8FAFC',
        borderColor: '#EF4444',
      }]}>
        <Text style={[styles.title, { color: '#EF4444' }]}>
          Please fix the following errors:
        </Text>
        {Object.entries(errors).map(([field, message]) => (
          <Text key={field} style={[styles.error, { color: '#EF4444' }]}>
            • {message}
          </Text>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.container, {
      backgroundColor: colors.background.secondary,
      borderColor: colors.error[500],
    }]}>
      <Text style={[styles.title, { color: colors.error[500] }]}>
        Please fix the following errors:
      </Text>
      {Object.entries(errors).map(([field, message]) => (
        <Text key={field} style={[styles.error, { color: colors.error[500] }]}>
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
