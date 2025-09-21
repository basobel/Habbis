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

  if (!isLoaded || !colors) {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput style={[styles.input, style]} {...props} />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          {label}
          {required && <Text style={[styles.required, { color: colors.error[500] }]}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background.card,
            borderColor: error ? colors.error[500] : colors.border.primary,
            color: colors.text.primary,
          },
          style,
        ]}
        placeholderTextColor={colors.text.placeholder}
        {...props}
      />
      {error && <Text style={[styles.errorText, { color: colors.error[500] }]}>{error}</Text>}
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
