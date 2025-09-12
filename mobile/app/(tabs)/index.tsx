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
import { getMe } from '@/store/slices/authSlice';
import { RootState } from '@/types';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const { habits, stats } = useSelector((state: RootState) => state.habits);

  const [refreshing, setRefreshing] = React.useState(false);

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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}, {user?.username || 'User'}!
        </Text>
        <Text style={styles.subtitle}>{getStreakMessage()}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>{user?.level || 1}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color="#EF4444" />
          <Text style={styles.statNumber}>{user?.current_streak_days || 0}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="diamond" size={24} color="#8B5CF6" />
          <Text style={styles.statNumber}>{user?.premium_currency || 0}</Text>
          <Text style={styles.statLabel}>Gems</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          <TouchableOpacity onPress={() => router.push('/habits')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No habits yet</Text>
            <Text style={styles.emptyStateText}>
              Create your first habit to start building good routines!
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/habits/create')}
            >
              <Text style={styles.createButtonText}>Create Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {habits.slice(0, 3).map((habit) => (
              <TouchableOpacity
                key={habit.id}
                style={styles.habitCard}
                onPress={() => router.push(`/habits/${habit.id}`)}
              >
                <View style={styles.habitInfo}>
                  <View style={[styles.habitIcon, { backgroundColor: habit.color }]}>
                    <Ionicons name="star" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.habitDetails}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    <Text style={styles.habitStreak}>
                      {habit.current_streak} day streak
                    </Text>
                  </View>
                </View>
                <View style={styles.habitStatus}>
                  {habit.isCompletedToday ? (
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={24} color="#9CA3AF" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/pets')}
          >
            <Ionicons name="paw" size={24} color="#1E40AF" />
            <Text style={styles.actionButtonText}>Feed Pet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/battles')}
          >
            <Ionicons name="flash" size={24} color="#1E40AF" />
            <Text style={styles.actionButtonText}>Battle</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/achievements')}
          >
            <Ionicons name="trophy" size={24} color="#1E40AF" />
            <Text style={styles.actionButtonText}>Achievements</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
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
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  habitsList: {
    paddingHorizontal: 24,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#1F2937',
    marginBottom: 4,
  },
  habitStreak: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#FFFFFF',
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
    color: '#1E40AF',
    marginTop: 8,
  },
});
