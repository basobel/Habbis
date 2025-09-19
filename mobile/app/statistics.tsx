import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useNavigation } from '@/hooks/useNavigation';
import SharedHeader from '@/components/SharedHeader';
import HamburgerMenu from '@/components/HamburgerMenu';

const { width: screenWidth } = Dimensions.get('window');

export default function StatisticsScreen() {
  const { colors, isLoaded } = useThemeContext();
  const { handleNavigate } = useNavigation();
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState(false);

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#4C1D95' }]}>Statystyki</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#6B7280' }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statsData = [
    {
      title: 'Dzisiaj',
      value: '3/5',
      subtitle: 'nawyków wykonanych',
      icon: 'today-outline',
      color: colors.primary[500],
    },
    {
      title: 'Ten tydzień',
      value: '18/25',
      subtitle: 'nawyków wykonanych',
      icon: 'calendar-outline',
      color: colors.success[500],
    },
    {
      title: 'Ten miesiąc',
      value: '72/100',
      subtitle: 'nawyków wykonanych',
      icon: 'stats-chart-outline',
      color: colors.accent.gold,
    },
    {
      title: 'Najdłuższa seria',
      value: '12 dni',
      subtitle: 'bez przerwy',
      icon: 'flame-outline',
      color: colors.error[500],
    },
  ];

  const weeklyData = [
    { day: 'Pon', completed: 4, total: 5 },
    { day: 'Wt', completed: 3, total: 5 },
    { day: 'Śr', completed: 5, total: 5 },
    { day: 'Czw', completed: 2, total: 5 },
    { day: 'Pt', completed: 4, total: 5 },
    { day: 'Sob', completed: 3, total: 5 },
    { day: 'Ndz', completed: 1, total: 5 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Statystyki</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Śledź swoje postępy
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <View
              key={index}
              style={[styles.statCard, { backgroundColor: colors.background.card }]}
            >
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <Ionicons name={stat.icon as any} size={24} color={colors.text.inverse} />
              </View>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statTitle, { color: colors.text.primary }]}>
                {stat.title}
              </Text>
              <Text style={[styles.statSubtitle, { color: colors.text.secondary }]}>
                {stat.subtitle}
              </Text>
            </View>
          ))}
        </View>

        {/* Weekly Progress */}
        <View style={[styles.weeklyCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Postęp w tym tygodniu
          </Text>
          <View style={styles.weeklyChart}>
            {weeklyData.map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <View style={styles.dayBars}>
                  <View
                    style={[
                      styles.completedBar,
                      {
                        height: (day.completed / day.total) * 60,
                        backgroundColor: colors.success[500],
                      }
                    ]}
                  />
                  <View
                    style={[
                      styles.totalBar,
                      {
                        height: 60,
                        backgroundColor: colors.background.primary,
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.dayLabel, { color: colors.text.secondary }]}>
                  {day.day}
                </Text>
                <Text style={[styles.dayValue, { color: colors.text.primary }]}>
                  {day.completed}/{day.total}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Habits Performance */}
        <View style={[styles.habitsCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Wydajność nawyków
          </Text>
          <View style={styles.habitsList}>
            {[
              { name: 'Poranny jogging', completion: 85, streak: 7 },
              { name: 'Czytanie książki', completion: 60, streak: 3 },
              { name: 'Medytacja', completion: 90, streak: 12 },
              { name: 'Nauka języka', completion: 45, streak: 2 },
              { name: 'Pisanie dziennika', completion: 70, streak: 5 },
            ].map((habit, index) => (
              <View key={index} style={styles.habitItem}>
                <View style={styles.habitInfo}>
                  <Text style={[styles.habitName, { color: colors.text.primary }]}>
                    {habit.name}
                  </Text>
                  <Text style={[styles.habitStreak, { color: colors.text.secondary }]}>
                    {habit.streak} dni z rzędu
                  </Text>
                </View>
                <View style={styles.habitProgress}>
                  <View style={[styles.habitProgressBar, { backgroundColor: colors.background.primary }]}>
                    <View
                      style={[
                        styles.habitProgressFill,
                        {
                          width: `${habit.completion}%`,
                          backgroundColor: habit.completion >= 80 
                            ? colors.success[500] 
                            : habit.completion >= 60 
                            ? colors.accent.gold 
                            : colors.error[500],
                        }
                      ]}
                    />
                  </View>
                  <Text style={[styles.habitPercentage, { color: colors.text.primary }]}>
                    {habit.completion}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={[styles.insightsCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Wnioski
          </Text>
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <Ionicons name="trending-up" size={20} color={colors.success[500]} />
              <Text style={[styles.insightText, { color: colors.text.primary }]}>
                Twoja wydajność wzrosła o 15% w tym miesiącu
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="time" size={20} color={colors.primary[500]} />
              <Text style={[styles.insightText, { color: colors.text.primary }]}>
                Najlepsze wyniki osiągasz rano (7:00-9:00)
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="trophy" size={20} color={colors.accent.gold} />
              <Text style={[styles.insightText, { color: colors.text.primary }]}>
                Medytacja to Twój najsilniejszy nawyk
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (screenWidth - 44) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  weeklyCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayBars: {
    position: 'relative',
    height: 60,
    width: 20,
    marginBottom: 8,
  },
  completedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 2,
  },
  totalBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  dayValue: {
    fontSize: 10,
    fontWeight: '600',
  },
  habitsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  habitsList: {
    gap: 16,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  habitStreak: {
    fontSize: 14,
  },
  habitProgress: {
    alignItems: 'flex-end',
    width: 80,
  },
  habitProgressBar: {
    width: 60,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  habitProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  habitPercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  insightsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
});
