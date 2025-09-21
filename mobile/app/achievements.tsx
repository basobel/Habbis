import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useNavigation } from '@/hooks/useNavigation';
import TopPanel from '@/components/TopPanel';
import CircularMenu from '@/components/CircularMenu';
import AchievementCard from '@/components/AchievementCard';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'time' | 'progress' | 'quick' | 'special' | 'social' | 'guild';
  type: 'badge' | 'title' | 'reward' | 'progress';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
  icon: string;
  color: string;
  requirements: string[];
  rewards: {
    points: number;
    title?: string;
    item?: string;
  };
}

export default function AchievementsScreen() {
  const { colors, isLoaded } = useThemeContext();
  const { handleNavigate } = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock data - w przyszłości będzie z Redux store
  const [achievements] = useState<Achievement[]>([
    // Czasowe osiągnięcia
    {
      id: '1',
      title: 'Wczesny Ptak',
      description: 'Wykonaj zadanie o 5:00 rano',
      category: 'time',
      type: 'badge',
      rarity: 'rare',
      points: 50,
      isUnlocked: true,
      progress: 1,
      maxProgress: 1,
      unlockedAt: new Date('2024-01-15T05:00:00'),
      icon: '🌅',
      color: '#F59E0B',
      requirements: ['Wykonaj zadanie między 5:00 a 6:00'],
      rewards: { points: 50, title: 'Wczesny Ptak' }
    },
    {
      id: '2',
      title: 'Nocny Marek',
      description: 'Wykonaj zadanie po północy',
      category: 'time',
      type: 'badge',
      rarity: 'epic',
      points: 100,
      isUnlocked: false,
      progress: 0,
      maxProgress: 1,
      icon: '🌙',
      color: '#8B5CF6',
      requirements: ['Wykonaj zadanie między 00:00 a 02:00'],
      rewards: { points: 100, title: 'Nocny Marek' }
    },
    {
      id: '3',
      title: 'Weekendowy Wojownik',
      description: 'Wykonaj 10 zadań w weekend',
      category: 'time',
      type: 'progress',
      rarity: 'common',
      points: 75,
      isUnlocked: false,
      progress: 7,
      maxProgress: 10,
      icon: '🏆',
      color: '#22C55E',
      requirements: ['Wykonaj zadania w sobotę lub niedzielę'],
      rewards: { points: 75, title: 'Weekendowy Wojownik' }
    },
    // Progresowe osiągnięcia
    {
      id: '4',
      title: 'Żelazna Wola',
      description: 'Utrzymaj streak przez 30 dni',
      category: 'progress',
      type: 'progress',
      rarity: 'legendary',
      points: 500,
      isUnlocked: false,
      progress: 15,
      maxProgress: 30,
      icon: '💪',
      color: '#EF4444',
      requirements: ['Nie przerwij serii przez 30 dni'],
      rewards: { points: 500, title: 'Żelazna Wola', item: 'Złoty Medal' }
    },
    {
      id: '5',
      title: 'Mistrz Nawyków',
      description: 'Ukończ 100 nawyków',
      category: 'progress',
      type: 'badge',
      rarity: 'epic',
      points: 200,
      isUnlocked: true,
      progress: 100,
      maxProgress: 100,
      unlockedAt: new Date('2024-01-20T14:30:00'),
      icon: '🎯',
      color: '#7C3AED',
      requirements: ['Ukończ 100 różnych nawyków'],
      rewards: { points: 200, title: 'Mistrz Nawyków' }
    },
    // Szybkie osiągnięcia
    {
      id: '6',
      title: 'Pierwsze Kroki',
      description: 'Stwórz swój pierwszy nawyk',
      category: 'quick',
      type: 'badge',
      rarity: 'common',
      points: 10,
      isUnlocked: true,
      progress: 1,
      maxProgress: 1,
      unlockedAt: new Date('2024-01-01T10:00:00'),
      icon: '👶',
      color: '#22C55E',
      requirements: ['Stwórz pierwszy nawyk'],
      rewards: { points: 10, title: 'Nowicjusz' }
    },
    {
      id: '7',
      title: 'Perfekcjonista',
      description: 'Wykonaj wszystkie zadania w jednym dniu',
      category: 'quick',
      type: 'badge',
      rarity: 'rare',
      points: 75,
      isUnlocked: false,
      progress: 0,
      maxProgress: 1,
      icon: '✨',
      color: '#F59E0B',
      requirements: ['Wykonaj wszystkie aktywne nawyki w jednym dniu'],
      rewards: { points: 75, title: 'Perfekcjonista' }
    },
    // Specjalne osiągnięcia
    {
      id: '8',
      title: 'Dzień Urodzin',
      description: 'Wykonaj zadanie w dniu urodzin',
      category: 'special',
      type: 'badge',
      rarity: 'legendary',
      points: 1000,
      isUnlocked: false,
      progress: 0,
      maxProgress: 1,
      icon: '🎂',
      color: '#EC4899',
      requirements: ['Wykonaj zadanie w dniu swoich urodzin'],
      rewards: { points: 1000, title: 'Solenizant', item: 'Tort Urodzinowy' }
    },
    {
      id: '9',
      title: 'Nowy Rok, Nowy Ja',
      description: 'Wykonaj zadanie 1 stycznia',
      category: 'special',
      type: 'badge',
      rarity: 'epic',
      points: 300,
      isUnlocked: true,
      progress: 1,
      maxProgress: 1,
      unlockedAt: new Date('2024-01-01T00:00:00'),
      icon: '🎊',
      color: '#10B981',
      requirements: ['Wykonaj zadanie 1 stycznia'],
      rewards: { points: 300, title: 'Nowy Rok, Nowy Ja' }
    },
    // Społeczne osiągnięcia
    {
      id: '10',
      title: 'Mentor',
      description: 'Pomóż 5 innym graczom',
      category: 'social',
      type: 'badge',
      rarity: 'epic',
      points: 150,
      isUnlocked: false,
      progress: 2,
      maxProgress: 5,
      icon: '👨‍🏫',
      color: '#3B82F6',
      requirements: ['Pomóż innym graczom w komentarzach lub poradach'],
      rewards: { points: 150, title: 'Mentor' }
    },
    // Gildiowe osiągnięcia
    {
      id: '11',
      title: 'Gildiowy Bohater',
      description: 'Przyczyn się do rozwoju gildii',
      category: 'guild',
      type: 'progress',
      rarity: 'rare',
      points: 200,
      isUnlocked: false,
      progress: 0,
      maxProgress: 10,
      icon: '🏰',
      color: '#8B5CF6',
      requirements: ['Wykonaj 10 zadań gildiowych'],
      rewards: { points: 200, title: 'Gildiowy Bohater' }
    }
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const categories = [
    { key: 'time', label: 'Czasowe', icon: '🕐', color: '#F59E0B' },
    { key: 'progress', label: 'Progresowe', icon: '📈', color: '#22C55E' },
    { key: 'quick', label: 'Szybkie', icon: '⚡', color: '#EF4444' },
    { key: 'special', label: 'Specjalne', icon: '🎯', color: '#8B5CF6' },
    { key: 'social', label: 'Społeczne', icon: '👥', color: '#3B82F6' },
    { key: 'guild', label: 'Gildiowe', icon: '🏰', color: '#EC4899' },
  ];

  const filteredAchievements = selectedCategory 
    ? achievements.filter(achievement => achievement.category === selectedCategory)
    : achievements;

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalPoints = achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.points, 0);

  const getCategoryStats = (categoryKey: string) => {
    const categoryAchievements = achievements.filter(a => a.category === categoryKey);
    const unlocked = categoryAchievements.filter(a => a.isUnlocked).length;
    const total = categoryAchievements.length;
    return { unlocked, total };
  };

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <TopPanel />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#4C1D95' }]}>Loading achievements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <TopPanel />

      {/* Stats Overview */}
      <View style={[styles.statsContainer, { backgroundColor: colors.background.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary?.[600] || '#6D28D9' }]}>
            {unlockedCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Osiągnięcia
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success?.[500] || '#22C55E' }]}>
            {totalPoints}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Punkty
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.warning?.[500] || '#F59E0B' }]}>
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Postęp
          </Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === null 
                  ? colors.primary?.[100] || '#EDE9FE'
                  : colors.background.card || '#FFFFFF',
                borderColor: selectedCategory === null 
                  ? colors.primary?.[600] || '#6D28D9'
                  : colors.border.primary || '#C4B5FD',
              }
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.categoryIcon}>🏆</Text>
            <Text style={[
              styles.categoryLabel,
              { color: selectedCategory === null ? colors.primary?.[600] || '#6D28D9' : colors.text.secondary }
            ]}>
              Wszystkie
            </Text>
          </TouchableOpacity>
          {categories.map((category) => {
            const stats = getCategoryStats(category.key);
            return (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selectedCategory === category.key 
                      ? colors.primary?.[100] || '#EDE9FE'
                      : colors.background.card || '#FFFFFF',
                    borderColor: selectedCategory === category.key 
                      ? colors.primary?.[600] || '#6D28D9'
                      : colors.border.primary || '#C4B5FD',
                  }
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryLabel,
                  { color: selectedCategory === category.key ? colors.primary?.[600] || '#6D28D9' : colors.text.secondary }
                ]}>
                  {category.label}
                </Text>
                <Text style={[styles.categoryCount, { color: colors.text.secondary }]}>
                  {stats.unlocked}/{stats.total}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Achievements List */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {filteredAchievements.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.background.card }]}>
            <Ionicons name="trophy-outline" size={64} color={colors.text.secondary} />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              Brak osiągnięć
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
              W tej kategorii nie ma jeszcze osiągnięć
            </Text>
          </View>
        ) : (
          <View style={styles.achievementsList}>
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Circular Menu */}
      <CircularMenu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, fontWeight: '500' },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
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
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 10,
    marginTop: 2,
  },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 32,
    borderRadius: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
  achievementsList: { paddingBottom: 20 },
});