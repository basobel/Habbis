import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router, useRouter } from 'expo-router';
import { getMe } from '@/store/slices/authSlice';
import { RootState } from '@/store';

export default function IndexScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const [isRouterReady, setIsRouterReady] = useState(false);
  
  // Check if auth state is available
  if (!authState) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Habbis</Text>
        <Text style={styles.subtitle}>Loading...</Text>
        <ActivityIndicator size="large" color="#1E40AF" style={styles.loader} />
      </View>
    );
  }
  
  const { isAuthenticated, isLoading, user } = authState;

  // Wait for router to be ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRouterReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isRouterReady) return;
    
    // Check if user is already authenticated
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      // Try to get user data from stored token
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated, isRouterReady]);

  useEffect(() => {
    if (!isRouterReady) return;
    
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    } else if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isLoading, isAuthenticated, isRouterReady]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habbis</Text>
      <Text style={styles.subtitle}>Gamified Habit Tracking</Text>
      <ActivityIndicator size="large" color="#1E40AF" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },
  loader: {
    marginTop: 16,
  },
});
