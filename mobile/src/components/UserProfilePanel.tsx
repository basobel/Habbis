import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { User } from '@/types';

interface UserProfilePanelProps {
  user: User;
}

export default function UserProfilePanel({ user }: UserProfilePanelProps) {
  const { colors } = useThemeContext();

  const getHealthPercentage = () => {
    // Assuming max health is 100, adjust based on your game logic
    const maxHealth = 100;
    const currentHealth = user.health || 50;
    return Math.min((currentHealth / maxHealth) * 100, 100);
  };

  const getExperiencePercentage = () => {
    // Calculate experience percentage for next level
    const currentLevel = user.level || 1;
    const currentXP = user.experience_points || 0;
    const xpForCurrentLevel = (currentLevel - 1) * 1000; // Example: 1000 XP per level
    const xpForNextLevel = currentLevel * 1000;
    const xpProgress = currentXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    return Math.min((xpProgress / xpNeeded) * 100, 100);
  };

  const getPowerPercentage = () => {
    // Example power calculation - adjust based on your game logic
    const maxPower = 500;
    const currentPower = user.power || 250;
    return Math.min((currentPower / maxPower) * 100, 100);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      <View style={styles.content}>
        {/* Left side - Avatar */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.primary[100] }]}>
            <Ionicons name="person" size={40} color={colors.primary[600]} />
          </View>
        </View>

        {/* Right side - Stats */}
        <View style={styles.statsContainer}>
          {/* Health */}
          <View style={styles.statRow}>
            <View style={styles.statIcon}>
              <Ionicons name="heart" size={16} color="#EF4444" />
            </View>
            <View style={styles.statContent}>
              <View style={styles.statHeader}>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>
                  {user.health || 50} / 100
                </Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  Zdrowie
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border.primary }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: '#EF4444',
                      width: `${getHealthPercentage()}%`
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
                <Text style={[styles.statValue, { color: colors.text.primary }]}>
                  {user.experience_points || 0} / {(user.level || 1) * 1000}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  Doświadczenie
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border.primary }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: '#F59E0B',
                      width: `${getExperiencePercentage()}%`
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
                <Text style={[styles.statValue, { color: colors.text.primary }]}>
                  {user.power || 250} / 500
                </Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  Moc
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border.primary }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: '#3B82F6',
                      width: `${getPowerPercentage()}%`
                    }
                  ]} 
                />
              </View>
            </View>
          </View>

          {/* Level and Currency */}
          <View style={styles.bottomRow}>
            <View style={styles.levelContainer}>
              <Ionicons name="trophy" size={16} color={colors.primary[600]} />
              <Text style={[styles.levelText, { color: colors.text.primary }]}>
                Poziom {user.level || 1} {user.class || 'Mag'}
              </Text>
            </View>
            <View style={styles.currencyContainer}>
              <View style={styles.currencyItem}>
                <Ionicons name="logo-bitcoin" size={16} color="#F59E0B" />
                <Text style={[styles.currencyValue, { color: colors.text.primary }]}>
                  {user.gold || 0}
                </Text>
              </View>
              <View style={styles.currencyItem}>
                <Ionicons name="gift" size={16} color="#10B981" />
                <Text style={[styles.currencyValue, { color: colors.text.primary }]}>
                  {user.premium_currency || 0}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
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
  },
  statContent: {
    flex: 1,
    marginLeft: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  currencyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyValue: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
