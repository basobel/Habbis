import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

interface Guild {
  id: string;
  name: string;
  description: string;
  level: number;
  members: number;
  maxMembers: number;
  territory: number;
  castleLevel: number;
  isPrivate: boolean;
  requirements: {
    minLevel: number;
    minPower: number;
  };
  leader: {
    id: string;
    username: string;
    avatar?: string;
  };
  tags: string[];
  createdAt: Date;
  lastActivity: Date;
}

interface GuildCardProps {
  guild: Guild;
  onPress: () => void;
  onJoin: () => void;
}

export default function GuildCard({ guild, onPress, onJoin }: GuildCardProps) {
  const { colors } = useThemeContext();

  const getLevelColor = (level: number) => {
    if (level >= 15) return colors?.success?.[500] || '#22C55E';
    if (level >= 10) return colors?.warning?.[500] || '#F59E0B';
    return colors?.primary?.[500] || '#7C3AED';
  };

  const getMembershipStatus = () => {
    if (guild.members >= guild.maxMembers) return { text: 'Pełna', color: colors?.error?.[500] || '#EF4444' };
    if (guild.members >= guild.maxMembers * 0.8) return { text: 'Prawie pełna', color: colors?.warning?.[500] || '#F59E0B' };
    return { text: 'Rekrutuje', color: colors?.success?.[500] || '#22C55E' };
  };

  const membershipStatus = getMembershipStatus();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors?.background?.card || '#FFFFFF',
          borderColor: colors?.border?.primary || '#C4B5FD',
          shadowColor: colors?.text?.primary || '#4C1D95',
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.guildInfo}>
          <View style={styles.guildNameContainer}>
            <Text style={[styles.guildName, { color: colors?.text?.primary || '#4C1D95' }]}>
              {guild.name}
            </Text>
            {guild.isPrivate && (
              <Ionicons 
                name="lock-closed" 
                size={16} 
                color={colors?.text?.secondary || '#6B7280'} 
              />
            )}
          </View>
          <View style={styles.levelContainer}>
            <Text style={[styles.levelText, { color: getLevelColor(guild.level) }]}>
              Lv. {guild.level}
            </Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: membershipStatus.color + '20' }]}>
            <Text style={[styles.statusText, { color: membershipStatus.color }]}>
              {membershipStatus.text}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text 
        style={[styles.description, { color: colors?.text?.secondary || '#6B7280' }]}
        numberOfLines={2}
      >
        {guild.description}
      </Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={16} color={colors?.text?.secondary || '#6B7280'} />
          <Text style={[styles.statText, { color: colors?.text?.secondary || '#6B7280' }]}>
            {guild.members}/{guild.maxMembers}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="map" size={16} color={colors?.text?.secondary || '#6B7280'} />
          <Text style={[styles.statText, { color: colors?.text?.secondary || '#6B7280' }]}>
            {guild.territory} terenów
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="home" size={16} color={colors?.text?.secondary || '#6B7280'} />
          <Text style={[styles.statText, { color: colors?.text?.secondary || '#6B7280' }]}>
            Zamek Lv. {guild.castleLevel}
          </Text>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {guild.tags.slice(0, 3).map((tag, index) => (
          <View 
            key={index}
            style={[
              styles.tag,
              { backgroundColor: colors?.primary?.[100] || '#EDE9FE' }
            ]}
          >
            <Text style={[styles.tagText, { color: colors?.primary?.[600] || '#6D28D9' }]}>
              {tag}
            </Text>
          </View>
        ))}
        {guild.tags.length > 3 && (
          <View style={[styles.tag, { backgroundColor: colors?.secondary?.[100] || '#F1F5F9' }]}>
            <Text style={[styles.tagText, { color: colors?.text?.secondary || '#6B7280' }]}>
              +{guild.tags.length - 3}
            </Text>
          </View>
        )}
      </View>

      {/* Leader and Requirements */}
      <View style={styles.footer}>
        <View style={styles.leaderContainer}>
          <Text style={[styles.leaderLabel, { color: colors?.text?.secondary || '#6B7280' }]}>
            Lider:
          </Text>
          <Text style={[styles.leaderName, { color: colors?.text?.primary || '#4C1D95' }]}>
            {guild.leader.avatar} {guild.leader.username}
          </Text>
        </View>
        <View style={styles.requirementsContainer}>
          <Text style={[styles.requirementsText, { color: colors?.text?.secondary || '#6B7280' }]}>
            Min. Lv. {guild.requirements.minLevel} • {guild.requirements.minPower} siły
          </Text>
        </View>
      </View>

      {/* Join Button */}
      <TouchableOpacity
        style={[
          styles.joinButton,
          {
            backgroundColor: guild.members >= guild.maxMembers 
              ? colors?.secondary?.[300] || '#CBD5E1'
              : colors?.primary?.[600] || '#6D28D9',
          }
        ]}
        onPress={onJoin}
        disabled={guild.members >= guild.maxMembers}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={guild.members >= guild.maxMembers ? "close" : "add"} 
          size={20} 
          color={colors?.text?.inverse || '#FFFFFF'} 
        />
        <Text style={[styles.joinButtonText, { color: colors?.text?.inverse || '#FFFFFF' }]}>
          {guild.members >= guild.maxMembers ? 'Pełna' : 'Dołącz'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  guildInfo: {
    flex: 1,
  },
  guildNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  guildName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelContainer: {
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    marginBottom: 12,
  },
  leaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  leaderLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  leaderName: {
    fontSize: 12,
    fontWeight: '600',
  },
  requirementsContainer: {
    alignItems: 'flex-start',
  },
  requirementsText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});