import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMe, logout } from '@/store/slices/authSlice';
import { RootState } from '@/types';
import { useThemeContext } from '@/contexts/ThemeContext';
import HabitCard from '@/components/HabitCard';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const { habits, stats } = useSelector((state: RootState) => state.habits);
  const { colors, isLoaded } = useThemeContext();

  const [refreshing, setRefreshing] = React.useState(false);
  const [isUserStatsVisible, setIsUserStatsVisible] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  const handleLogout = async () => {
    try {
      await dispatch(logout() as any);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    dispatch(getMe() as any);
  }, [dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (dispatch(getMe() as any) as any).finally(() => setRefreshing(false));
  }, [dispatch]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
        
        // Ukryj panel przy scrollowaniu w dół, pokaż przy scrollowaniu w górę
        if (scrollDirection === 'down' && currentScrollY > 50) {
          setIsUserStatsVisible(false);
        } else if (scrollDirection === 'up' || currentScrollY <= 50) {
          setIsUserStatsVisible(true);
        }
        
        lastScrollY.current = currentScrollY;
      },
    }
  );

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
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={[styles.topNavigationBar, { backgroundColor: '#FFFFFF' }]}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#4C1D95" />
          </TouchableOpacity>
          <Text style={[styles.appTitle, { color: '#4C1D95' }]}>
            {user?.username || 'Habbis'}
          </Text>
          <View style={styles.topBarActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="search" size={24} color="#4C1D95" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="filter" size={24} color="#4C1D95" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={styles.habitsScrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={[styles.emptyState, { backgroundColor: '#FFFFFF' }]}>
            <Ionicons name="checkmark-circle-outline" size={48} color="#9CA3AF" />
            <Text style={[styles.emptyStateTitle, { color: '#4C1D95' }]}>Loading...</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Top Navigation Bar */}
      <View style={[styles.topNavigationBar, { backgroundColor: colors.background.card }]}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={colors.text.primary} />
        </TouchableOpacity>
            <Text style={[styles.appTitle, { color: colors.text.primary }]}>
              {user?.username || 'Habbis'}
            </Text>
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="search" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="filter" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Stats Panel - Full Version with Progress Bars */}
      {user && isUserStatsVisible && (
        <Animated.View 
          style={[
            styles.userStatsPanel, 
            { 
              backgroundColor: colors.background.card,
              opacity: isUserStatsVisible ? 1 : 0,
              transform: [{
                translateY: isUserStatsVisible ? 0 : -100
              }]
            }
          ]}
        >
          <View style={styles.userStatsContent}>
            {/* Left side - Avatar with Level Badge */}
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: colors.primary[100] }]}>
                <Ionicons name="person" size={40} color={colors.primary[600]} />
              </View>
              <View style={styles.levelBadge}>
                <Text style={[styles.levelText, { color: colors.text.inverse }]}>
                  Lvl {user.level || 1}
                </Text>
              </View>
            </View>

            {/* Right side - Full Stats with Progress Bars */}
            <View style={styles.fullStats}>
              {/* Health */}
              <View style={styles.statRow}>
                <View style={styles.statIcon}>
                  <Ionicons name="heart" size={16} color="#EF4444" />
                </View>
                <View style={styles.statContent}>
                  <View style={styles.statHeader}>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Zdrowie</Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {user.health || 50} / 100
                    </Text>
                  </View>
                  <View style={[styles.progressBarContainer, { backgroundColor: colors.background.primary }]}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${((user.health || 50) / 100) * 100}%`,
                          backgroundColor: '#EF4444'
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>

              {/* Experience */}
              <View style={styles.statRow}>
                <View style={styles.statIcon}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                </View>
                <View style={styles.statContent}>
                  <View style={styles.statHeader}>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Doświadczenie</Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {user.experience_points || 2500} / 5000
                    </Text>
                  </View>
                  <View style={[styles.progressBarContainer, { backgroundColor: colors.background.primary }]}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${((user.experience_points || 2500) / 5000) * 100}%`,
                          backgroundColor: '#F59E0B'
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>

              {/* Power */}
              <View style={styles.statRow}>
                <View style={styles.statIcon}>
                  <Ionicons name="flash" size={16} color="#3B82F6" />
                </View>
                <View style={styles.statContent}>
                  <View style={styles.statHeader}>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Moc</Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {user.power || 250} / 500
                    </Text>
                  </View>
                  <View style={[styles.progressBarContainer, { backgroundColor: colors.background.primary }]}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${((user.power || 250) / 500) * 100}%`,
                          backgroundColor: '#3B82F6'
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>

              {/* Bottom Row - Level, Gold, Premium Currency */}
              <View style={styles.bottomStats}>
                <View style={styles.currencyItem}>
                  <Ionicons name="trophy" size={16} color={colors.primary[600]} />
                  <Text style={[styles.currencyValue, { color: colors.text.primary }]}>
                    Poziom {user.level || 1} Mag
                  </Text>
                </View>
                <View style={styles.currencyItem}>
                  <Ionicons name="logo-bitcoin" size={16} color="#F59E0B" />
                  <Text style={[styles.currencyValue, { color: colors.text.primary }]}>
                    {user.gold || 0}
                  </Text>
                </View>
                <View style={styles.currencyItem}>
                  <Ionicons name="gift" size={16} color="#10B981" />
                  <Text style={[styles.currencyValue, { color: colors.text.primary }]}>
                    {user.premium_currency || 100}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Scrollable Habits List */}
      <ScrollView
        style={styles.habitsScrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {habits.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.background.card }]}>
            <Ionicons name="checkmark-circle-outline" size={48} color={colors.text.muted} />
            <Text style={[styles.emptyStateTitle, { color: colors.text.primary }]}>No habits yet</Text>
            <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>
              Create your first habit to start building good routines!
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary[600] }]}
              onPress={() => console.log('Create habit pressed')}
            >
              <Text style={[styles.createButtonText, { color: colors.text.inverse }]}>Create Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={() => {
                  // Handle habit completion
                  console.log('Complete habit:', habit.id);
                }}
                onSkip={() => {
                  // Handle habit skip
                  console.log('Skip habit:', habit.id);
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Top Navigation Bar - Fixed at top
  topNavigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuButton: {
    padding: 8,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  // User Stats Panel - Full version with progress bars
  userStatsPanel: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  userStatsContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
  },
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  fullStats: {
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  statContent: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  bottomStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Scrollable Habits List
  habitsScrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 16,
    marginTop: 32,
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
    paddingBottom: 60, // Space for bottom tab bar (reduced from 100 to 60)
  },
});
