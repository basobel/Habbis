import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useThemeFallback } from '@/hooks/useThemeFallback';

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
  const { 
    getTextColor, 
    getBackgroundColor, 
    getBorderColor, 
    getErrorColor,
    isLoaded 
  } = useThemeFallback();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: getTextColor('secondary') }]}>
          {label}
          {required && <Text style={[styles.required, { color: getErrorColor() }]}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: getBackgroundColor('card'),
            borderColor: error ? getErrorColor() : getBorderColor('primary'),
            color: getTextColor('primary'),
          },
          style,
        ]}
        placeholderTextColor={getTextColor('placeholder')}
        {...props}
      />
      {error && <Text style={[styles.errorText, { color: getErrorColor() }]}>{error}</Text>}
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
