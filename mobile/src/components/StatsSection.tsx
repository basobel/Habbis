import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { UserStatistics } from '@/types/user';

interface StatsSectionProps {
  statistics: UserStatistics;
  userLevel: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  subtitle?: string;
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  const { colors } = useThemeContext();

  return (
    <View style={[styles.statCard, { backgroundColor: colors?.background.card }]}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: colors?.text.primary }]}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
        <Text style={[styles.statTitle, { color: colors?.text.secondary }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: colors?.text.tertiary }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function StatsSection({ statistics, userLevel }: StatsSectionProps) {
  const { colors, isLoaded } = useThemeContext();

  if (!isLoaded || !colors) {
    return null;
  }

  const statsData = [
    {
      title: 'Nawyki ukończone',
      value: statistics.total_habits_completed,
      icon: 'checkmark-circle' as const,
      color: '#10B981',
      subtitle: `${statistics.habits_completed_today} dzisiaj`
    },
    {
      title: 'Nawyki utworzone',
      value: statistics.total_habits_created,
      icon: 'add-circle' as const,
      color: '#3B82F6',
      subtitle: 'Wszystkie czasy'
    },
    {
      title: 'Dni aktywne',
      value: statistics.total_days_active,
      icon: 'calendar' as const,
      color: '#8B5CF6',
      subtitle: 'Łącznie'
    },
    {
      title: 'Wskaźnik ukończenia',
      value: `${statistics.completion_rate}%`,
      icon: 'trending-up' as const,
      color: '#F59E0B',
      subtitle: 'Średnia'
    },
    {
      title: 'Idealne dni',
      value: statistics.perfect_days,
      icon: 'star' as const,
      color: '#EF4444',
      subtitle: 'Wszystkie nawyki'
    },
    {
      title: 'Bitwy wygrane',
      value: statistics.battles_won,
      icon: 'flash' as const,
      color: '#F97316',
      subtitle: `${statistics.battles_lost} przegranych`
    },
    {
      title: 'Osiągnięcia',
      value: statistics.achievements_unlocked,
      icon: 'medal' as const,
      color: '#06B6D4',
      subtitle: 'Odblokowane'
    },
    {
      title: 'Zwierzęta',
      value: statistics.pets_owned,
      icon: 'paw' as const,
      color: '#84CC16',
      subtitle: 'W posiadaniu'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Statystyki
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            subtitle={stat.subtitle}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
    fontWeight: '500',
  },
});
