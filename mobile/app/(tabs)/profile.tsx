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
import { useNavigation } from '@/hooks/useNavigation';
import HabitCard from '@/components/HabitCard';
import HamburgerMenu from '@/components/HamburgerMenu';
import SharedHeader from '@/components/SharedHeader';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const { habits, stats } = useSelector((state: RootState) => state.habits);
  const { colors, isLoaded } = useThemeContext();
  const { handleNavigate } = useNavigation();

  const [refreshing, setRefreshing] = React.useState(false);
  const [isUserStatsVisible, setIsUserStatsVisible] = useState(true);
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState(false);
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


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getMe() as any);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMe() as any);
  }, [dispatch]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  if (!isLoaded || !colors || !colors.primary || !colors.primary[500]) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#4C1D95' }]}>Loading profile...</Text>
      </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header with Hamburger Menu */}
      <SharedHeader
        title={`Witaj, ${user?.username || 'Użytkowniku'}!`}
        subtitle="Kontynuuj swoją podróż z nawykami"
        onHamburgerPress={() => setIsHamburgerMenuVisible(true)}
      />

      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* User Stats */}
        {isUserStatsVisible && (
          <Animated.View
            style={[
              styles.statsContainer,
              { backgroundColor: colors.background.card },
            ]}
          >
            <View style={styles.statsHeader}>
              <Text style={[styles.statsTitle, { color: colors.text.primary }]}>
                Twoje statystyki
              </Text>
              <TouchableOpacity
                onPress={() => setIsUserStatsVisible(false)}
                style={styles.closeStatsButton}
              >
                <Ionicons name="close" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary?.[600] || '#6D28D9' }]}>
                  {stats?.total_habits || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  Nawyków
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.success?.[500] || '#22C55E' }]}>
                  {stats?.total_completions || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  Ukończone
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.warning?.[500] || '#F59E0B' }]}>
                  {stats?.current_streak || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  Streak
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.accent?.gold || '#F59E0B' }]}>
                  {stats?.completion_rate || 0}%
                </Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  Skuteczność
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.primary?.[600] || '#6D28D9' }]}
            onPress={() => router.push('/(tabs)/pets')}
          >
            <Ionicons name="paw" size={24} color={colors.text.inverse} />
            <Text style={[styles.quickActionText, { color: colors.text.inverse }]}>
              Moje Zwierzęta
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.accent?.gold || '#F59E0B' }]}
            onPress={() => router.push('/(tabs)/battle')}
          >
            <Ionicons name="flash" size={24} color={colors.text.inverse} />
            <Text style={[styles.quickActionText, { color: colors.text.inverse }]}>
              Walka
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Habits */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Ostatnie nawyki
          </Text>
          {habits && habits.length > 0 ? (
            <View style={styles.habitsList}>
              {habits.slice(0, 3).map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={() => {}}
                  onSkip={() => {}}
                />
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.background.card }]}>
              <Ionicons name="checkmark-circle-outline" size={48} color={colors.text.muted} />
              <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                Brak nawyków
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                Dodaj swój pierwszy nawyk!
              </Text>
            </View>
          )}
        </View>

        {/* Achievements Preview */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Osiągnięcia
          </Text>
          <View style={[styles.achievementsPreview, { backgroundColor: colors.background.card }]}>
            <View style={styles.achievementItem}>
              <Ionicons name="trophy" size={24} color={colors.accent?.gold || '#F59E0B'} />
              <Text style={[styles.achievementText, { color: colors.text.primary }]}>
                Pierwszy krok
              </Text>
            </View>
            <View style={styles.achievementItem}>
              <Ionicons name="flame" size={24} color={colors.warning?.[500] || '#F59E0B'} />
              <Text style={[styles.achievementText, { color: colors.text.primary }]}>
                7 dni streak
              </Text>
            </View>
            <View style={styles.achievementItem}>
              <Ionicons name="star" size={24} color={colors.primary?.[600] || '#6D28D9'} />
              <Text style={[styles.achievementText, { color: colors.text.primary }]}>
                Perfekcjonista
              </Text>
            </View>
          </View>
    </View>
      </ScrollView>

      {/* Hamburger Menu */}
      <HamburgerMenu
        isVisible={isHamburgerMenuVisible}
        onClose={() => setIsHamburgerMenuVisible(false)}
        onNavigate={handleNavigate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  statsContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeStatsButton: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  habitsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  achievementsPreview: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  achievementText: {
    fontSize: 16,
    fontWeight: '500',
  },
});