import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { User } from '@/types';

interface ProfileHeaderProps {
  user: User;
  onEditPress?: () => void;
}

export default function ProfileHeader({ user, onEditPress }: ProfileHeaderProps) {
  const { colors, isLoaded } = useThemeContext();

  if (!isLoaded || !colors) {
    return null;
  }

  const levelProgress = {
    current: user.experience_points % 1000,
    required: 1000,
    percentage: (user.experience_points % 1000) / 10
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      {/* Avatar i podstawowe info */}
      <View style={styles.headerContent}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary[600] }]}>
            <Ionicons 
              name={user.avatar_icon as any || 'person'} 
              size={40} 
              color={colors.text.inverse} 
            />
          </View>
          <View style={[styles.levelBadge, { backgroundColor: colors.primary[600] }]}>
            <Text style={[styles.levelText, { color: colors.text.inverse }]}>
              {user.level}
            </Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: colors.text.primary }]}>
            {user.username}
          </Text>
          <Text style={[styles.email, { color: colors.text.secondary }]}>
            {user.email}
          </Text>
          
          {/* Waluty */}
          <View style={styles.currencies}>
            <View style={styles.currencyItem}>
              <Ionicons name="logo-bitcoin" size={16} color="#F59E0B" />
              <Text style={[styles.currencyText, { color: colors.text.primary }]}>
                {user.regular_currency.toLocaleString()}
              </Text>
            </View>
            <View style={styles.currencyItem}>
              <Ionicons name="diamond" size={16} color="#8B5CF6" />
              <Text style={[styles.currencyText, { color: colors.text.primary }]}>
                {user.premium_currency}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: colors.primary[100] }]}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Pasek doświadczenia */}
      <View style={styles.experienceContainer}>
        <View style={styles.experienceHeader}>
          <Text style={[styles.experienceLabel, { color: colors.text.secondary }]}>
            Doświadczenie
          </Text>
          <Text style={[styles.experienceValue, { color: colors.text.primary }]}>
            {levelProgress.current}/{levelProgress.required} XP
          </Text>
        </View>
        <View style={[styles.experienceBar, { backgroundColor: colors.background.secondary }]}>
          <View
            style={[
              styles.experienceFill,
              {
                backgroundColor: colors.primary[600],
                width: `${levelProgress.percentage}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Seria */}
      <View style={styles.streakContainer}>
        <View style={styles.streakItem}>
          <Ionicons name="flame" size={20} color="#EF4444" />
          <View style={styles.streakInfo}>
            <Text style={[styles.streakLabel, { color: colors.text.secondary }]}>
              Obecna seria
            </Text>
            <Text style={[styles.streakValue, { color: colors.text.primary }]}>
              {user.current_streak_days} dni
            </Text>
          </View>
        </View>
        <View style={styles.streakItem}>
          <Ionicons name="trophy" size={20} color="#F59E0B" />
          <View style={styles.streakInfo}>
            <Text style={[styles.streakLabel, { color: colors.text.secondary }]}>
              Najlepsza seria
            </Text>
            <Text style={[styles.streakValue, { color: colors.text.primary }]}>
              {user.total_streak_days} dni
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 12,
  },
  currencies: {
    flexDirection: 'row',
    gap: 16,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  experienceContainer: {
    marginBottom: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  experienceLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  experienceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  experienceBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  experienceFill: {
    height: '100%',
    borderRadius: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakInfo: {
    alignItems: 'flex-start',
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  streakValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
