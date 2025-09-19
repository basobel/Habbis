import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

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

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const { colors } = useThemeContext();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return colors?.success?.[500] || '#22C55E';
      case 'rare': return colors?.primary?.[500] || '#7C3AED';
      case 'epic': return colors?.warning?.[500] || '#F59E0B';
      case 'legendary': return colors?.error?.[500] || '#EF4444';
      default: return colors?.text?.secondary || '#6B7280';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'star-outline';
      case 'rare': return 'star';
      case 'epic': return 'diamond-outline';
      case 'legendary': return 'diamond';
      default: return 'star-outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'time': return 'time-outline';
      case 'progress': return 'trending-up-outline';
      case 'quick': return 'flash-outline';
      case 'special': return 'gift-outline';
      case 'social': return 'people-outline';
      case 'guild': return 'home-outline';
      default: return 'trophy-outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'badge': return 'medal-outline';
      case 'title': return 'ribbon-outline';
      case 'reward': return 'gift-outline';
      case 'progress': return 'bar-chart-outline';
      default: return 'trophy-outline';
    }
  };

  const progressPercentage = achievement.maxProgress > 0 
    ? (achievement.progress / achievement.maxProgress) * 100 
    : 0;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors?.background?.card || '#FFFFFF',
          borderColor: achievement.isUnlocked 
            ? getRarityColor(achievement.rarity)
            : colors?.border?.primary || '#C4B5FD',
          shadowColor: achievement.isUnlocked 
            ? getRarityColor(achievement.rarity)
            : colors?.text?.primary || '#4C1D95',
        }
      ]}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={[styles.achievementIcon, { opacity: achievement.isUnlocked ? 1 : 0.5 }]}>
            {achievement.icon}
          </Text>
          {achievement.isUnlocked && (
            <View style={[styles.unlockedBadge, { backgroundColor: getRarityColor(achievement.rarity) }]}>
              <Ionicons name="checkmark" size={12} color={colors?.text?.inverse || '#FFFFFF'} />
            </View>
          )}
        </View>
        
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={[
              styles.title,
              { 
                color: achievement.isUnlocked 
                  ? colors?.text?.primary || '#4C1D95'
                  : colors?.text?.secondary || '#6B7280'
              }
            ]}>
              {achievement.title}
            </Text>
            <View style={styles.rarityContainer}>
              <Ionicons 
                name={getRarityIcon(achievement.rarity) as any} 
                size={16} 
                color={getRarityColor(achievement.rarity)} 
              />
            </View>
          </View>
          <Text style={[styles.description, { color: colors?.text?.secondary || '#6B7280' }]}>
            {achievement.description}
          </Text>
        </View>

        <View style={styles.pointsContainer}>
          <Text style={[styles.points, { color: getRarityColor(achievement.rarity) }]}>
            {achievement.points}
          </Text>
          <Text style={[styles.pointsLabel, { color: colors?.text?.secondary || '#6B7280' }]}>
            pkt
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      {achievement.type === 'progress' && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors?.secondary?.[200] || '#E2E8F0' }]}>
            <View 
              style={[
                styles.progressFill,
                { 
                  backgroundColor: getRarityColor(achievement.rarity),
                  width: `${progressPercentage}%`
                }
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors?.text?.secondary || '#6B7280' }]}>
            {achievement.progress}/{achievement.maxProgress}
          </Text>
        </View>
      )}

      {/* Category and Type */}
      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Ionicons 
            name={getCategoryIcon(achievement.category) as any} 
            size={14} 
            color={colors?.text?.secondary || '#6B7280'} 
          />
          <Text style={[styles.metaText, { color: colors?.text?.secondary || '#6B7280' }]}>
            {achievement.category}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons 
            name={getTypeIcon(achievement.type) as any} 
            size={14} 
            color={colors?.text?.secondary || '#6B7280'} 
          />
          <Text style={[styles.metaText, { color: colors?.text?.secondary || '#6B7280' }]}>
            {achievement.type}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons 
            name="star-outline" 
            size={14} 
            color={getRarityColor(achievement.rarity)} 
          />
          <Text style={[styles.metaText, { color: getRarityColor(achievement.rarity) }]}>
            {achievement.rarity}
          </Text>
        </View>
      </View>

      {/* Requirements */}
      <View style={styles.requirementsContainer}>
        <Text style={[styles.requirementsTitle, { color: colors?.text?.primary || '#4C1D95' }]}>
          Wymagania:
        </Text>
        {achievement.requirements.map((requirement, index) => (
          <View key={index} style={styles.requirementItem}>
            <Ionicons 
              name="checkmark-circle-outline" 
              size={14} 
              color={colors?.text?.secondary || '#6B7280'} 
            />
            <Text style={[styles.requirementText, { color: colors?.text?.secondary || '#6B7280' }]}>
              {requirement}
            </Text>
          </View>
        ))}
      </View>

      {/* Rewards */}
      <View style={styles.rewardsContainer}>
        <Text style={[styles.rewardsTitle, { color: colors?.text?.primary || '#4C1D95' }]}>
          Nagrody:
        </Text>
        <View style={styles.rewardsList}>
          <View style={styles.rewardItem}>
            <Ionicons name="star" size={16} color={getRarityColor(achievement.rarity)} />
            <Text style={[styles.rewardText, { color: getRarityColor(achievement.rarity) }]}>
              {achievement.rewards.points} punktów
            </Text>
          </View>
          {achievement.rewards.title && (
            <View style={styles.rewardItem}>
              <Ionicons name="ribbon" size={16} color={colors?.primary?.[600] || '#6D28D9'} />
              <Text style={[styles.rewardText, { color: colors?.primary?.[600] || '#6D28D9' }]}>
                Tytuł: {achievement.rewards.title}
              </Text>
            </View>
          )}
          {achievement.rewards.item && (
            <View style={styles.rewardItem}>
              <Ionicons name="gift" size={16} color={colors?.warning?.[500] || '#F59E0B'} />
              <Text style={[styles.rewardText, { color: colors?.warning?.[500] || '#F59E0B' }]}>
                {achievement.rewards.item}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Unlocked Date */}
      {achievement.isUnlocked && achievement.unlockedAt && (
        <View style={styles.unlockedContainer}>
          <Ionicons name="time" size={14} color={colors?.success?.[500] || '#22C55E'} />
          <Text style={[styles.unlockedText, { color: colors?.success?.[500] || '#22C55E' }]}>
            Odblokowano: {formatDate(achievement.unlockedAt)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  achievementIcon: {
    fontSize: 32,
  },
  unlockedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  rarityContainer: {
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  points: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  requirementsContainer: {
    marginBottom: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  requirementText: {
    fontSize: 12,
    flex: 1,
  },
  rewardsContainer: {
    marginBottom: 8,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  rewardsList: {
    gap: 4,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '500',
  },
  unlockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  unlockedText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
