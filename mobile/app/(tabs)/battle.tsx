import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemeContext } from '../../src/contexts/ThemeContext';
import { useNavigation } from '@/hooks/useNavigation';
import SharedHeader from '@/components/SharedHeader';
import HamburgerMenu from '@/components/HamburgerMenu';

const { width } = Dimensions.get('window');

interface BattleMode {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: string[];
  energyCost: number;
  unlocked: boolean;
}

export default function BattleScreen() {
  const { colors, isLoaded } = useThemeContext();
  const { handleNavigate } = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState(false);

  // Fallback colors
  const primaryColor = colors?.primary?.[500] || '#7C3AED';
  const primary100 = colors?.primary?.[100] || '#EDE9FE';
  const primary600 = colors?.primary?.[600] || '#6D28D9';
  const accentGold = colors?.accent?.gold || '#F59E0B';
  const textPrimary = colors?.text?.primary || '#4C1D95';
  const textSecondary = colors?.text?.secondary || '#6B7280';
  const textInverse = colors?.text?.inverse || '#FFFFFF';
  const backgroundCard = colors?.background?.card || '#FFFFFF';
  const backgroundPrimary = colors?.background?.primary || '#F5F3FF';
  const borderPrimary = colors?.border?.primary || '#C4B5FD';
  const success500 = colors?.success?.[500] || '#22C55E';
  const error500 = colors?.error?.[500] || '#EF4444';
  const warning500 = colors?.warning?.[500] || '#F59E0B';

  const battleModes: BattleMode[] = [
    {
      id: 'arena',
      title: 'Arena PvP',
      description: 'Walcz z innymi graczami w turniejach',
      icon: 'sword',
      color: error500,
      difficulty: 'hard',
      rewards: ['Trophy', 'Coins', 'XP'],
      energyCost: 20,
      unlocked: true,
    },
    {
      id: 'expedition',
      title: 'Ekspedycje',
      description: 'Wyślij pets na przygodę po nagrody',
      icon: 'map',
      color: success500,
      difficulty: 'medium',
      rewards: ['Items', 'Coins', 'Pet XP'],
      energyCost: 15,
      unlocked: true,
    },
    {
      id: 'dungeon',
      title: 'Dungeon',
      description: 'Przeżyj wyzwania i pokonaj bossów',
      icon: 'skull',
      color: warning500,
      difficulty: 'hard',
      rewards: ['Rare Items', 'Gems', 'Pet Evolution'],
      energyCost: 25,
      unlocked: true,
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Symulacja odświeżania danych
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleModePress = (mode: BattleMode) => {
    if (!mode.unlocked) return;
    
    setSelectedMode(mode.id);
    // Nawigacja do konkretnego trybu
    switch (mode.id) {
      case 'arena':
        router.push('/battle/arena');
        break;
      case 'expedition':
        router.push('/battle/expedition');
        break;
      case 'dungeon':
        router.push('/battle/dungeon');
        break;
    }
  };

  const handleQuickFight = () => {
    // Szybka walka - przejdź bezpośrednio do ekranu walki
    router.push('/battle/fight');
  };


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return success500;
      case 'medium': return warning500;
      case 'hard': return error500;
      default: return textSecondary;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Łatwy';
      case 'medium': return 'Średni';
      case 'hard': return 'Trudny';
      default: return 'Nieznany';
    }
  };

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: backgroundPrimary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: textPrimary }]}>Loading battle modes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundPrimary }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <SharedHeader
          title="🗡️ System Walki"
          subtitle="Wybierz tryb walki i rozpocznij przygodę"
          onHamburgerPress={() => setIsHamburgerMenuVisible(true)}
        />

        {/* Battle Modes Grid */}
        <View style={styles.modesGrid}>
          {battleModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeCard,
                {
                  backgroundColor: backgroundCard,
                  borderColor: mode.unlocked ? borderPrimary : '#E5E7EB',
                  opacity: mode.unlocked ? 1 : 0.6,
                },
                selectedMode === mode.id && {
                  borderColor: mode.color,
                  borderWidth: 2,
                }
              ]}
              onPress={() => handleModePress(mode)}
              disabled={!mode.unlocked}
              activeOpacity={0.8}
            >
              {/* Mode Icon */}
              <View style={[styles.modeIcon, { backgroundColor: `${mode.color}20` }]}>
                <Ionicons name={mode.icon as any} size={32} color={mode.color} />
              </View>

              {/* Mode Info */}
              <View style={styles.modeInfo}>
                <Text style={[styles.modeTitle, { color: textPrimary }]}>
                  {mode.title}
                </Text>
                <Text style={[styles.modeDescription, { color: textSecondary }]}>
                  {mode.description}
                </Text>

                {/* Difficulty Badge */}
                <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(mode.difficulty)}20` }]}>
                  <Text style={[styles.difficultyText, { color: getDifficultyColor(mode.difficulty) }]}>
                    {getDifficultyText(mode.difficulty)}
                  </Text>
                </View>

                {/* Rewards */}
                <View style={styles.rewardsContainer}>
                  <Text style={[styles.rewardsLabel, { color: textSecondary }]}>
                    Nagrody:
                  </Text>
                  <View style={styles.rewardsList}>
                    {mode.rewards.map((reward, index) => (
                      <View key={index} style={[styles.rewardItem, { backgroundColor: primary100 }]}>
                        <Text style={[styles.rewardText, { color: primary600 }]}>
                          {reward}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Energy Cost */}
                <View style={styles.energyContainer}>
                  <Ionicons name="flash" size={16} color={accentGold} />
                  <Text style={[styles.energyText, { color: textSecondary }]}>
                    {mode.energyCost} energii
                  </Text>
                </View>

                {/* Lock Icon for locked modes */}
                {!mode.unlocked && (
                  <View style={styles.lockContainer}>
                    <Ionicons name="lock-closed" size={20} color={textSecondary} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: primaryColor }]}
            onPress={handleQuickFight}
          >
            <Ionicons name="flash" size={20} color={textInverse} />
            <Text style={[styles.quickActionText, { color: textInverse }]}>
              Szybka walka
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: accentGold }]}
            onPress={() => router.push('/battle/expedition')}
          >
            <Ionicons name="map" size={20} color={textInverse} />
            <Text style={[styles.quickActionText, { color: textInverse }]}>
              Ekspedycja
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={[styles.statsContainer, { backgroundColor: backgroundCard }]}>
          <Text style={[styles.statsTitle, { color: textPrimary }]}>
            Statystyki Walki
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: primaryColor }]}>12</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Wygrane</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: success500 }]}>3</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Ekspedycje</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: warning500 }]}>1</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Dungeony</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: accentGold }]}>85</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Energia</Text>
            </View>
          </View>
        </View>
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
  scrollView: {
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
  modesGrid: {
    padding: 20,
    gap: 16,
  },
  modeCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rewardsContainer: {
    marginBottom: 12,
  },
  rewardsLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  rewardsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  rewardItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '500',
  },
  energyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  energyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  lockContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statsContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
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
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
