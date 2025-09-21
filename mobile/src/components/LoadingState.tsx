import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export default function LoadingState({ 
  message = 'Loading...', 
  size = 'large',
  color 
}: LoadingStateProps) {
  const { colors, isLoaded } = useThemeContext();

  const textColor = color || (isLoaded && colors ? colors.text.secondary : '#6B7280');
  const spinnerColor = color || (isLoaded && colors ? colors.primary[600] : '#7C3AED');

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={spinnerColor} />
      <Text style={[styles.text, { color: textColor }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
});
