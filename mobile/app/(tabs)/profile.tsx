import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMe, logout } from '@/store/slices/authSlice';
import { RootState } from '@/types';
import { useThemeContext } from '@/contexts/ThemeContext';
import FadeInView from '@/components/FadeInView';
import ProfileHeader from '@/components/ProfileHeader';
import StatsSection from '@/components/StatsSection';
import ClassSection from '@/components/ClassSection';
import EquipmentSection from '@/components/EquipmentSection';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { colors, isLoaded } = useThemeContext();

  const [refreshing, setRefreshing] = React.useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleLogout = async () => {
    try {
      await dispatch(logout() as any);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getMe() as any);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMe() as any);
  }, []);

  // Sprawdź autoryzację i przekieruj na logowanie jeśli nieautoryzowany
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#4C1D95' }]}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  // Jeśli nie jest autoryzowany, pokaż loading (useEffect przekieruje na logowanie)
  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>
            Sprawdzanie autoryzacji...
          </Text>
        </View>
      </View>
    );
  }

  // Jeśli nie ma danych użytkownika ale jest autoryzowany, pokaż loading
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>
            Ładowanie danych użytkownika...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <FadeInView duration={400}>
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <ScrollView
          style={styles.scrollView}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <ProfileHeader 
            user={user} 
            onEditPress={() => router.push('/(tabs)/edit-profile')} 
          />

          {/* Statistics Section */}
          {user.statistics && (
            <StatsSection 
              statistics={user.statistics} 
              userLevel={user.level} 
            />
          )}

          {/* Class Section */}
          <ClassSection 
            userClass={user.class || 'warrior'} 
            userLevel={user.level}
            onClassChange={() => console.log('Change class')} // TODO: Implement class change
          />

          {/* Equipment Section */}
          <EquipmentSection 
            equipment={user.equipment || []} 
            pets={[]} // TODO: Add pets data
          />

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: colors.primary[600] }]}
              onPress={() => router.push('/(tabs)/settings')}
            >
              <Ionicons name="settings" size={20} color="white" />
              <Text style={[styles.quickActionText, { color: 'white' }]}>
                Ustawienia
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: colors.primary[100] }]}
              onPress={() => router.push('/(tabs)/statistics')}
            >
              <Ionicons name="bar-chart" size={20} color={colors.primary[600]} />
              <Text style={[styles.quickActionText, { color: colors.primary[600] }]}>
                Statystyki
              </Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.error?.[500] || '#EF4444' }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="white" />
            <Text style={[styles.logoutText, { color: 'white' }]}>
              Wyloguj się
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 12,
    gap: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});