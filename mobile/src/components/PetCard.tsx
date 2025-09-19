import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

interface Pet {
  id: string;
  name: string;
  species: string;
  level: number;
  experience: number;
  maxExperience: number;
  health: number;
  maxHealth: number;
  hunger: number;
  maxHunger: number;
  happiness: number;
  maxHappiness: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  lastFed?: Date;
  lastPlayed?: Date;
}

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
  onFeed: () => void;
  onPlay: () => void;
}

export default function PetCard({ pet, onPress, onFeed, onPlay }: PetCardProps) {
  const { colors, isLoaded } = useThemeContext();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.loadingText, { color: '#4C1D95' }]}>Loading...</Text>
      </View>
    );
  }

  // Fallback colors if primary is not available
  const primaryColor = colors.primary?.[500] || '#7C3AED';
  const primary100 = colors.primary?.[100] || '#EDE9FE';
  const primary600 = colors.primary?.[600] || '#6D28D9';
  const accentGold = colors.accent?.gold || '#F59E0B';
  const textSecondary = colors.text?.secondary || '#6B7280';
  const textPrimary = colors.text?.primary || '#4C1D95';
  const textInverse = colors.text?.inverse || '#FFFFFF';
  const backgroundCard = colors.background?.card || '#FFFFFF';
  const backgroundPrimary = colors.background?.primary || '#F5F3FF';
  const borderPrimary = colors.border?.primary || '#C4B5FD';
  const success500 = colors.success?.[500] || '#22C55E';
  const error500 = colors.error?.[500] || '#EF4444';

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return textSecondary;
      case 'rare': return primaryColor;
      case 'epic': return accentGold;
      case 'legendary': return '#FF6B6B';
      default: return textSecondary;
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

  const getSpeciesIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case 'cat': return 'paw';
      case 'dog': return 'paw';
      case 'bird': return 'bird';
      case 'fish': return 'fish';
      case 'rabbit': return 'paw';
      case 'dragon': return 'flame';
      default: return 'paw';
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const hungerPercentage = (pet.hunger / pet.maxHunger) * 100;
  const happinessPercentage = (pet.happiness / pet.maxHappiness) * 100;
  const experiencePercentage = (pet.experience / pet.maxExperience) * 100;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: backgroundCard,
            borderColor: pet.isActive ? primaryColor : borderPrimary,
            borderWidth: pet.isActive ? 2 : 1,
          }
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {/* Header with rarity and level */}
        <View style={styles.header}>
          <View style={styles.rarityContainer}>
            <Ionicons
              name={getRarityIcon(pet.rarity) as any}
              size={16}
              color={getRarityColor(pet.rarity)}
            />
            <Text style={[styles.rarityText, { color: getRarityColor(pet.rarity) }]}>
              {pet.rarity.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: primary600 }]}>
            <Text style={[styles.levelText, { color: textInverse }]}>
              Lv.{pet.level}
            </Text>
          </View>
        </View>

        {/* Pet Avatar */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: primary100 }]}>
            <Ionicons
              name={getSpeciesIcon(pet.species) as any}
              size={40}
              color={primary600}
            />
          </View>
          {pet.isActive && (
            <View style={[styles.activeIndicator, { backgroundColor: success500 }]}>
              <Ionicons name="checkmark" size={12} color={textInverse} />
            </View>
          )}
        </View>

        {/* Pet Name and Species */}
        <View style={styles.petInfo}>
          <Text style={[styles.petName, { color: textPrimary }]} numberOfLines={1}>
            {pet.name}
          </Text>
          <Text style={[styles.petSpecies, { color: textSecondary }]}>
            {pet.species}
          </Text>
        </View>

        {/* Stats Bars */}
        <View style={styles.statsContainer}>
          {/* Health */}
          <View style={styles.statRow}>
            <Ionicons name="heart" size={12} color={error500} />
            <View style={[styles.statBar, { backgroundColor: backgroundPrimary }]}>
              <View
                style={[
                  styles.statFill,
                  {
                    width: `${(pet.health / pet.maxHealth) * 100}%`,
                    backgroundColor: error500,
                  }
                ]}
              />
            </View>
          </View>

          {/* Hunger */}
          <View style={styles.statRow}>
            <Ionicons name="restaurant" size={12} color={accentGold} />
            <View style={[styles.statBar, { backgroundColor: backgroundPrimary }]}>
              <View
                style={[
                  styles.statFill,
                  {
                    width: `${hungerPercentage}%`,
                    backgroundColor: hungerPercentage < 30 ? error500 : accentGold,
                  }
                ]}
              />
            </View>
          </View>

          {/* Happiness */}
          <View style={styles.statRow}>
            <Ionicons name="happy" size={12} color={success500} />
            <View style={[styles.statBar, { backgroundColor: backgroundPrimary }]}>
              <View
                style={[
                  styles.statFill,
                  {
                    width: `${happinessPercentage}%`,
                    backgroundColor: success500,
                  }
                ]}
              />
            </View>
          </View>

          {/* Experience */}
          <View style={styles.statRow}>
            <Ionicons name="star" size={12} color={primaryColor} />
            <View style={[styles.statBar, { backgroundColor: backgroundPrimary }]}>
              <View
                style={[
                  styles.statFill,
                  {
                    width: `${experiencePercentage}%`,
                    backgroundColor: primaryColor,
                  }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: hungerPercentage < 50 ? accentGold : backgroundPrimary,
                borderColor: accentGold,
              }
            ]}
            onPress={onFeed}
            disabled={hungerPercentage >= 100}
          >
            <Ionicons
              name="restaurant"
              size={16}
              color={hungerPercentage < 50 ? textInverse : accentGold}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: happinessPercentage < 50 ? success500 : backgroundPrimary,
                borderColor: success500,
              }
            ]}
            onPress={onPlay}
            disabled={happinessPercentage >= 100}
          >
            <Ionicons
              name="happy"
              size={16}
              color={happinessPercentage < 50 ? textInverse : success500}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rarityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  petSpecies: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  statsContainer: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginLeft: 8,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
