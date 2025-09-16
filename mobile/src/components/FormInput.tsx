import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export default function FormInput({ 
  label, 
  error, 
  required = false, 
  style, 
  ...props 
}: FormInputProps) {
  const { colors, isLoaded } = useThemeContext();

  // Debug logging
  console.log('FormInput render:', { isLoaded, colors: !!colors, error: colors?.error });

  // Don't render if theme is not loaded or colors are not available
  if (!isLoaded || !colors || !colors.error) {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: '#4C1D95' }]}>
            {label}
            {required && <Text style={[styles.required, { color: '#EF4444' }]}> *</Text>}
          </Text>
        )}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#4C1D95' },
            error ? { borderColor: '#EF4444' } : null,
            style,
          ]}
          placeholderTextColor="#94A3B8"
          {...props}
        />
        {error && <Text style={[styles.errorText, { color: '#EF4444' }]}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors?.text?.secondary || '#64748B' }]}>
          {label}
          {required && <Text style={[styles.required, { color: colors?.error?.[500] || '#EF4444' }]}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors?.input?.background || colors?.background?.card || '#FFFFFF',
            borderColor: colors?.input?.border || colors?.border?.secondary || '#E2E8F0',
            color: colors?.input?.text || colors?.text?.primary || '#4C1D95',
          },
          error ? { borderColor: colors?.error?.[500] || '#EF4444' } : null,
          style,
        ]}
        placeholderTextColor={colors?.input?.placeholder || colors?.text?.placeholder || '#9CA3AF'}
        {...props}
      />
      {error && <Text style={[styles.errorText, { color: colors?.error?.[500] || '#EF4444' }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    // Color will be set dynamically
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    // Colors will be set dynamically
  },
  inputError: {
    // Border color will be set dynamically
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    // Color will be set dynamically
  },
});
