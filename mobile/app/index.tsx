import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { getMe } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function IndexScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { colors, isLoaded } = useThemeContext();
  const authState = useSelector((state: RootState) => state.auth);
  const [hasNavigated, setHasNavigated] = useState(false);
  
  // Single effect to handle navigation logic
  useEffect(() => {
    if (!isLoaded || !colors || hasNavigated) return;
    
    // If auth state is not available yet, go to login
    if (!authState) {
      if (__DEV__) console.log('No auth state, going to login...');
      setHasNavigated(true);
      router.replace('/login');
      return;
    }
    
    const { isAuthenticated, isLoading, error } = authState;
    
    if (__DEV__) console.log('Auth state:', { isAuthenticated, isLoading, error });
    
    // If still loading, wait
    if (isLoading) {
      if (__DEV__) console.log('Still loading...');
      return;
    }
    
    // If there's an error, go to login
    if (error) {
      if (__DEV__) console.log('Auth error:', error);
      setHasNavigated(true);
      router.replace('/login');
      return;
    }
    
    // If not authenticated, go to login
    if (!isAuthenticated) {
      if (__DEV__) console.log('Not authenticated, going to login');
      setHasNavigated(true);
      router.replace('/login');
      return;
    }
    
    // If authenticated, go to main app
    if (isAuthenticated) {
      if (__DEV__) console.log('Authenticated, going to main app');
      setHasNavigated(true);
      router.replace('/(tabs)');
      return;
    }
  }, [isLoaded, colors, authState?.isAuthenticated, authState?.isLoading, authState?.error, hasNavigated]);
  
  // Check if theme is loaded
  if (!isLoaded || !colors) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Habbis</Text>
        <Text style={styles.subtitle}>Loading...</Text>
        <ActivityIndicator size="large" color="#7C3AED" style={styles.loader} />
      </View>
    );
  }
  
  // Check if auth state is available
  if (!authState) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Habbis</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Loading...</Text>
        <ActivityIndicator size="large" color={colors.primary[600]} style={styles.loader} />
      </View>
    );
  }
  
  const { isAuthenticated, isLoading, user } = authState;

  return (
    <View style={[styles.container, { backgroundColor: colors?.background?.primary || '#F5F3FF' }]}>
      <Text style={[styles.title, { color: colors?.text?.primary || '#4C1D95' }]}>Habbis</Text>
      <Text style={[styles.subtitle, { color: colors?.text?.secondary || '#64748B' }]}>Gamified Habit Tracking</Text>
      <ActivityIndicator size="large" color={colors?.primary?.[600] || '#7C3AED'} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  loader: {
    marginTop: 16,
  },
});
