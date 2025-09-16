import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router, useRouter } from 'expo-router';
import { getMe } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function IndexScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { colors, isLoaded } = useThemeContext();
  const authState = useSelector((state: RootState) => state.auth);
  const [isRouterReady, setIsRouterReady] = useState(false);
  
  // Wait for router to be ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRouterReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isRouterReady || !authState) return;
    
    const { isAuthenticated } = authState;
    
    // Check if user is already authenticated
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      // Try to get user data from stored token
      dispatch(getMe() as any);
    }
  }, [dispatch, authState, isRouterReady]);

  useEffect(() => {
    if (!isRouterReady || !authState) return;
    
    const { isAuthenticated, isLoading } = authState;
    
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    } else if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [authState, isRouterReady]);
  
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
