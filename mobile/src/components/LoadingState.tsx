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

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <ActivityIndicator size={size} color="#7C3AED" />
        <Text style={[styles.message, { color: '#6B7280' }]}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ActivityIndicator 
        size={size} 
        color={color || colors.primary[600]} 
      />
      <Text style={[styles.message, { color: colors.text.secondary }]}>
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
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});