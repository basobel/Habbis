import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function AchievementsScreen() {
  const { colors, isLoaded } = useThemeContext();

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#4C1D95' }]}>Osiągnięcia</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#6B7280' }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const achievements = [
    {
      id: 'first_habit',
      title: 'Pierwszy krok',
      description: 'Stwórz swój pierwszy nawyk',
      icon: 'footsteps-outline',
      unlocked: true,
      progress: 100,
      reward: '10 XP',
    },
    {
      id: 'week_streak',
      title: 'Tygodniowa seria',
      description: 'Utrzymaj nawyk przez 7 dni z rzędu',
      icon: 'calendar-outline',
      unlocked: true,
      progress: 100,
      reward: '50 XP',
    },
    {
      id: 'month_streak',
      title: 'Miesięczna seria',
      description: 'Utrzymaj nawyk przez 30 dni z rzędu',
      icon: 'trophy-outline',
      unlocked: false,
      progress: 65,
      reward: '200 XP',
    },
    {
      id: 'habit_master',
      title: 'Mistrz nawyków',
      description: 'Stwórz 10 różnych nawyków',
      icon: 'star-outline',
      unlocked: false,
      progress: 30,
      reward: '100 XP',
    },
    {
      id: 'early_bird',
      title: 'Ranny ptaszek',
      description: 'Wykonaj nawyk przed 7:00 rano',
      icon: 'sunny-outline',
      unlocked: false,
      progress: 0,
      reward: '25 XP',
    },
    {
      id: 'night_owl',
      title: 'Nocna sowa',
      description: 'Wykonaj nawyk po 22:00',
      icon: 'moon-outline',
      unlocked: false,
      progress: 0,
      reward: '25 XP',
    },
    {
      id: 'perfect_week',
      title: 'Idealny tydzień',
      description: 'Wykonaj wszystkie nawyki przez cały tydzień',
      icon: 'checkmark-circle-outline',
      unlocked: false,
      progress: 0,
      reward: '150 XP',
    },
    {
      id: 'social_butterfly',
      title: 'Motywator',
      description: 'Dołącz do gildii i pomóż innym',
      icon: 'people-outline',
      unlocked: false,
      progress: 0,
      reward: '75 XP',
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Osiągnięcia</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {unlockedCount} z {totalCount} odblokowanych
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Overview */}
        <View style={[styles.progressCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.progressHeader}>
            <Ionicons name="trophy" size={24} color={colors.accent.gold} />
            <Text style={[styles.progressTitle, { color: colors.text.primary }]}>
              Twój postęp
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.background.primary }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(unlockedCount / totalCount) * 100}%`,
                    backgroundColor: colors.accent.gold
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.text.secondary }]}>
              {Math.round((unlockedCount / totalCount) * 100)}%
            </Text>
          </View>
        </View>

        {/* Achievements List */}
        <View style={styles.achievementsList}>
          {achievements.map((achievement, index) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                { 
                  backgroundColor: colors.background.card,
                  opacity: achievement.unlocked ? 1 : 0.6,
                }
              ]}
            >
              <View style={styles.achievementLeft}>
                <View
                  style={[
                    styles.achievementIcon,
                    {
                      backgroundColor: achievement.unlocked 
                        ? colors.accent.gold 
                        : colors.background.primary,
                    }
                  ]}
                >
                  <Ionicons
                    name={achievement.icon as any}
                    size={24}
                    color={achievement.unlocked ? colors.text.inverse : colors.text.muted}
                  />
                </View>
                <View style={styles.achievementText}>
                  <Text
                    style={[
                      styles.achievementTitle,
                      { 
                        color: achievement.unlocked 
                          ? colors.text.primary 
                          : colors.text.muted 
                      }
                    ]}
                  >
                    {achievement.title}
                  </Text>
                  <Text
                    style={[
                      styles.achievementDescription,
                      { 
                        color: achievement.unlocked 
                          ? colors.text.secondary 
                          : colors.text.muted 
                      }
                    ]}
                  >
                    {achievement.description}
                  </Text>
                  {!achievement.unlocked && achievement.progress > 0 && (
                    <View style={styles.progressContainer}>
                      <View style={[styles.miniProgressBar, { backgroundColor: colors.border.primary }]}>
                        <View
                          style={[
                            styles.miniProgressFill,
                            {
                              width: `${achievement.progress}%`,
                              backgroundColor: colors.primary[500],
                            }
                          ]}
                        />
                      </View>
                      <Text style={[styles.progressLabel, { color: colors.text.muted }]}>
                        {achievement.progress}%
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.achievementRight}>
                {achievement.unlocked ? (
                  <View style={[styles.unlockedBadge, { backgroundColor: colors.success[100] }]}>
                    <Ionicons name="checkmark" size={16} color={colors.success[600]} />
                  </View>
                ) : (
                  <View style={[styles.lockedBadge, { backgroundColor: colors.background.primary }]}>
                    <Ionicons name="lock-closed" size={16} color={colors.text.muted} />
                  </View>
                )}
                <Text style={[styles.rewardText, { color: colors.accent.gold }]}>
                  {achievement.reward}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Motivation Section */}
        <View style={[styles.motivationCard, { backgroundColor: colors.background.card }]}>
          <Ionicons name="bulb-outline" size={32} color={colors.accent.gold} />
          <Text style={[styles.motivationTitle, { color: colors.text.primary }]}>
            Kontynuuj swoją podróż!
          </Text>
          <Text style={[styles.motivationText, { color: colors.text.secondary }]}>
            Każdy nawyk to krok w kierunku lepszej wersji siebie. 
            Osiągnięcia pomogą Ci śledzić postępy i motywować się do dalszych działań.
          </Text>
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
  progressCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniProgressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  achievementRight: {
    alignItems: 'center',
  },
  unlockedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  lockedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  motivationCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  motivationText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
