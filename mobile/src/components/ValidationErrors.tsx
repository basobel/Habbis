import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ValidationErrorsProps {
  errors: Record<string, string>;
}

export default function ValidationErrors({ errors }: ValidationErrorsProps) {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please fix the following errors:</Text>
      {Object.entries(errors).map(([field, message]) => (
        <Text key={field} style={styles.error}>
          • {message}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  error: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 4,
    lineHeight: 20,
  },
});
