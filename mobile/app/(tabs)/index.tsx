import React, { useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import FadeInView from '@/components/FadeInView';
import ScreenWrapper from '@/components/ScreenWrapper';
import ScreenScrollView from '@/components/ScreenScrollView';
import useScreenState from '@/hooks/useScreenState';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { 
  fetchHabits, 
  completeHabit, 
  skipHabit,
  undoHabit,
  selectAllHabits,
  selectActiveHabits,
  selectHabitsLoading,
  selectHabitsError 
} from '../../src/store/slices/habitsSlice';
import { selectIsAuthenticated } from '../../src/store/slices/authSlice';
import { Habit } from '../../src/types';

export default function HabitsScreen() {
  const { colors, isLoaded } = useThemeContext();
  const { refreshing, onRefresh } = useScreenState();
  const dispatch = useAppDispatch();
  
  // Redux state
  const habits = useAppSelector(selectActiveHabits);
  const isLoading = useAppSelector(selectHabitsLoading);
  const error = useAppSelector(selectHabitsError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Helper function
  const isCompletedToday = useCallback((habit: Habit) => {
    return habit.last_completed_at && 
      new Date(habit.last_completed_at).toDateString() === new Date().toDateString();
  }, []);

  // Memoized computed values
  const completedTodayCount = useMemo(() => 
    habits.filter((h: Habit) => isCompletedToday(h)).length,
    [habits, isCompletedToday]
  );

  // Load habits on component mount
  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany przed pobraniem nawyków
    if (isAuthenticated) {
      const loadHabits = async () => {
        try {
          await dispatch(fetchHabits({ active: true }));
        } catch (error) {
          console.log('Error loading habits:', error);
        }
      };
      
      loadHabits();
    }
  }, [dispatch, isAuthenticated]);

  // Handle refresh
  const handleRefresh = async () => {
    await dispatch(fetchHabits({ active: true }));
    onRefresh();
  };

  const handleHabitToggle = async (habitId: number) => {
    const habit = habits.find((h: Habit) => h.id === habitId);
    if (!habit) return;

    // Check if habit is completed today
    const habitCompletedToday = habit.last_completed_at && 
      new Date(habit.last_completed_at).toDateString() === new Date().toDateString();

    if (habitCompletedToday) {
      // Undo habit completion (cofnij wykonanie)
      await dispatch(undoHabit(habitId));
    } else {
      // Complete habit
      await dispatch(completeHabit({ id: habitId }));
    }
    
    // Refresh habits to get updated data
    await dispatch(fetchHabits({ active: true }));
  };

  const getCategoryIcon = (icon: string) => {
    // Map backend icon names to Ionicons
    const iconMap: { [key: string]: string } = {
      'fitness': 'fitness',
      'briefcase': 'briefcase',
      'person': 'person',
      'book': 'book',
      'star': 'star',
      'heart': 'heart',
      'time': 'time',
      'checkmark': 'checkmark',
    };
    return iconMap[icon] || 'star';
  };

  const getCategoryColor = (color: string) => {
    return color || '#6B7280';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#22C55E';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      case 'expert': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#4C1D95' }]}>Loading habits...</Text>
        </View>
      </View>
    );
  }

  if (isLoading && habits.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>Loading habits...</Text>
        </View>
      </View>
    );
  }

  return (
    <FadeInView duration={400}>
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.title, { color: colors.text.primary }]}>Moje Nawyk</Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {habits.length} nawyków • {completedTodayCount} ukończonych dziś
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary[600] }]}
            onPress={() => {
              // TODO: Implement add habit
              console.log('Add habit');
            }}
          >
            <Ionicons name="add" size={20} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Habits List */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {habits.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.background.card }]}>
            <Ionicons name="checkmark-circle-outline" size={48} color={colors.text.muted} />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              Brak nawyków
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
              Dodaj swój pierwszy nawyk!
            </Text>
            <TouchableOpacity
              style={[styles.addHabitButton, { backgroundColor: colors.primary[600] }]}
            >
              <Text style={[styles.addHabitButtonText, { color: colors.text.inverse }]}>
                Dodaj nawyk
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {habits.map((habit: Habit) => {
              const completed = isCompletedToday(habit);
              return (
                <TouchableOpacity
                  key={habit.id}
                  style={[
                    styles.habitCard,
                    {
                      backgroundColor: colors.background.card,
                      borderColor: completed ? colors.primary[500] : colors.border.primary,
                      borderWidth: completed ? 2 : 1,
                    }
                  ]}
                  onPress={() => handleHabitToggle(habit.id)}
                  activeOpacity={0.8}
                >
                <View style={styles.habitHeader}>
                  <View style={styles.habitInfo}>
                    <View style={[styles.categoryIcon, { backgroundColor: `${getCategoryColor(habit.color)}20` }]}>
                      <Ionicons
                        name={getCategoryIcon(habit.icon) as any}
                        size={20}
                        color={getCategoryColor(habit.color)}
                      />
                    </View>
                    <View style={styles.habitText}>
                      <Text style={[styles.habitTitle, { color: colors.text.primary }]}>
                        {habit.name}
                      </Text>
                      <Text style={[styles.habitDescription, { color: colors.text.secondary }]}>
                        {habit.description || 'Brak opisu'}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.completionButton,
                    {
                      backgroundColor: completed ? colors.primary[500] : colors.background.primary,
                      borderColor: completed ? colors.primary[500] : colors.border.primary,
                    }
                  ]}>
                    <Ionicons
                      name={completed ? "checkmark" : "add"}
                      size={20}
                      color={completed ? colors.text.inverse : colors.text.secondary}
                    />
                  </View>
                </View>

                <View style={styles.habitStats}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.primary[600] }]}>
                      {habit.current_streak}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                      Streak
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text.secondary }]}>
                      {habit.total_completions}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                      Ukończone
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(habit.difficulty)}20` }]}>
                      <Text style={[styles.difficultyText, { color: getDifficultyColor(habit.difficulty) }]}>
                        {habit.difficulty.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {completed && (
                  <View style={styles.completedHint}>
                    <Text style={[styles.completedHintText, { color: colors.text.secondary }]}>
                      Kliknij ponownie, aby cofnąć wykonanie
                    </Text>
                  </View>
                )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Wysokość TopPanel + margines
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 32,
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
    marginBottom: 24,
  },
  addHabitButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addHabitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  habitsList: {
    paddingBottom: 20,
  },
  habitCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitText: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  completionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  completedHint: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    alignItems: 'center',
  },
  completedHintText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});