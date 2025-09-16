import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMe, logout } from '@/store/slices/authSlice';
import { RootState } from '@/types';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const { habits, stats } = useSelector((state: RootState) => state.habits);
  const { colors, isLoaded } = useThemeContext();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout() as any);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getMe()).finally(() => setRefreshing(false));
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStreakMessage = () => {
    if (!user) return 'Start your journey!';
    if (user.current_streak_days === 0) return 'Ready to start a new streak?';
    if (user.current_streak_days === 1) return 'Great start! Keep it up!';
    return `Amazing! ${user.current_streak_days} day streak!`;
  };

  // Don't render if theme is not loaded
  if (!isLoaded || !colors) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: '#F5F3FF' }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: '#4C1D95' }]}>
            {getGreeting()}, {user?.username || 'User'}!
          </Text>
          <Text style={[styles.subtitle, { color: '#6D28D9' }]}>{getStreakMessage()}</Text>
        </View>
        {/* ... rest of fallback content ... */}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.greeting, { color: colors.text.primary }]}>
            {getGreeting()}, {user?.username || 'User'}!
          </Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{getStreakMessage()}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.background.card }]}>
          <Ionicons name="trophy" size={24} color="#F59E0B" />
          <Text style={[styles.statNumber, { color: colors.text.primary }]}>{user?.level || 1}</Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Level</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.background.card }]}>
          <Ionicons name="flame" size={24} color="#EF4444" />
          <Text style={[styles.statNumber, { color: colors.text.primary }]}>{user?.current_streak_days || 0}</Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Streak</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.background.card }]}>
          <Ionicons name="diamond" size={24} color={colors.primary[600]} />
          <Text style={[styles.statNumber, { color: colors.text.primary }]}>{user?.premium_currency || 0}</Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Gems</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Today's Habits</Text>
          <TouchableOpacity onPress={() => router.push('/habits')}>
            <Text style={[styles.seeAllText, { color: colors.primary[600] }]}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {habits.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.background.card }]}>
            <Ionicons name="checkmark-circle-outline" size={48} color={colors.text.muted} />
            <Text style={[styles.emptyStateTitle, { color: colors.text.primary }]}>No habits yet</Text>
            <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>
              Create your first habit to start building good routines!
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary[600] }]}
              onPress={() => router.push('/habits/create')}
            >
              <Text style={[styles.createButtonText, { color: colors.text.inverse }]}>Create Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {habits.slice(0, 3).map((habit) => (
              <TouchableOpacity
                key={habit.id}
                style={[styles.habitCard, { backgroundColor: colors.background.card }]}
                onPress={() => router.push(`/habits/${habit.id}`)}
              >
                <View style={styles.habitInfo}>
                  <View style={[styles.habitIcon, { backgroundColor: habit.color }]}>
                    <Ionicons name="star" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.habitDetails}>
                    <Text style={[styles.habitName, { color: colors.text.primary }]}>{habit.name}</Text>
                    <Text style={[styles.habitStreak, { color: colors.text.secondary }]}>
                      {habit.current_streak} day streak
                    </Text>
                  </View>
                </View>
                <View style={styles.habitStatus}>
                  {habit.isCompletedToday ? (
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={24} color={colors.text.muted} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Quick Actions</Text>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.background.card }]}
            onPress={() => router.push('/pets')}
          >
            <Ionicons name="paw" size={24} color={colors.primary[600]} />
            <Text style={[styles.actionButtonText, { color: colors.primary[600] }]}>Feed Pet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.background.card }]}
            onPress={() => router.push('/battles')}
          >
            <Ionicons name="flash" size={24} color={colors.primary[600]} />
            <Text style={[styles.actionButtonText, { color: colors.primary[600] }]}>Battle</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.background.card }]}
            onPress={() => router.push('/achievements')}
          >
            <Ionicons name="trophy" size={24} color={colors.primary[600]} />
            <Text style={[styles.actionButtonText, { color: colors.primary[600] }]}>Achievements</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 24,
    borderRadius: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  habitsList: {
    paddingHorizontal: 24,
  },
  habitCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  habitStreak: {
    fontSize: 14,
  },
  habitStatus: {
    marginLeft: 12,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});
