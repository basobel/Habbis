import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import HamburgerMenu from '@/components/HamburgerMenu';

interface Habit {
  id: string;
  title: string;
  description: string;
  streak: number;
  target: number;
  completed: boolean;
  category: 'health' | 'work' | 'personal' | 'learning';
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function HabitsScreen() {
  const { colors, isLoaded } = useThemeContext();
  const [refreshing, setRefreshing] = useState(false);
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState(false);

  // Mock data
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      title: 'Poranna gimnastyka',
      description: '15 minut ćwiczeń każdego ranka',
      streak: 7,
      target: 30,
      completed: false,
      category: 'health',
      difficulty: 'medium',
    },
    {
      id: '2',
      title: 'Czytanie książek',
      description: '30 minut czytania dziennie',
      streak: 12,
      target: 21,
      completed: true,
      category: 'learning',
      difficulty: 'easy',
    },
    {
      id: '3',
      title: 'Medytacja',
      description: '10 minut medytacji',
      streak: 3,
      target: 7,
      completed: false,
      category: 'personal',
      difficulty: 'easy',
    },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleHabitToggle = (habitId: string) => {
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit.id === habitId
          ? { ...habit, completed: !habit.completed, streak: habit.completed ? habit.streak - 1 : habit.streak + 1 }
          : habit
      )
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return 'fitness';
      case 'work': return 'briefcase';
      case 'personal': return 'person';
      case 'learning': return 'book';
      default: return 'star';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return '#22C55E';
      case 'work': return '#3B82F6';
      case 'personal': return '#8B5CF6';
      case 'learning': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#22C55E';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'profile':
        router.push('/(tabs)/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'premium':
        router.push('/premium');
        break;
      case 'achievements':
        router.push('/achievements');
        break;
      case 'logout':
        // Handle logout
        break;
    }
  };

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#4C1D95' }]}>Loading habits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={() => setIsHamburgerMenuVisible(true)}
        >
          <Ionicons name="menu" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.title, { color: colors.text.primary }]}>Moje Nawyk</Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {habits.length} nawyków • {habits.filter(h => h.completed).length} ukończonych dziś
            </Text>
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary[600] }]}>
            <Ionicons name="add" size={24} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Habits List */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
            {habits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                style={[
                  styles.habitCard,
                  {
                    backgroundColor: colors.background.card,
                    borderColor: habit.completed ? colors.primary[500] : colors.border.primary,
                    borderWidth: habit.completed ? 2 : 1,
                  }
                ]}
                onPress={() => handleHabitToggle(habit.id)}
                activeOpacity={0.8}
              >
                <View style={styles.habitHeader}>
                  <View style={styles.habitInfo}>
                    <View style={[styles.categoryIcon, { backgroundColor: `${getCategoryColor(habit.category)}20` }]}>
                      <Ionicons
                        name={getCategoryIcon(habit.category) as any}
                        size={20}
                        color={getCategoryColor(habit.category)}
                      />
                    </View>
                    <View style={styles.habitText}>
                      <Text style={[styles.habitTitle, { color: colors.text.primary }]}>
                        {habit.title}
                      </Text>
                      <Text style={[styles.habitDescription, { color: colors.text.secondary }]}>
                        {habit.description}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.completionButton,
                    {
                      backgroundColor: habit.completed ? colors.primary[500] : colors.background.primary,
                      borderColor: habit.completed ? colors.primary[500] : colors.border.primary,
                    }
                  ]}>
                    <Ionicons
                      name={habit.completed ? "checkmark" : "add"}
                      size={20}
                      color={habit.completed ? colors.text.inverse : colors.text.secondary}
                    />
                  </View>
                </View>

                <View style={styles.habitStats}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.primary[600] }]}>
                      {habit.streak}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                      Streak
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text.secondary }]}>
                      {habit.target}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                      Cel
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
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  hamburgerButton: {
    padding: 8,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
});