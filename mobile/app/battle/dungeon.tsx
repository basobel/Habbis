import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../src/contexts/ThemeContext';
import { router } from 'expo-router';

interface Dungeon {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'nightmare';
  floors: number;
  energyCost: number;
  rewards: {
    coins: number;
    xp: number;
    items: string[];
    gems: number;
  };
  requirements: {
    minLevel: number;
    petCount: number;
    recommendedLevel: number;
  };
  icon: string;
  color: string;
  unlocked: boolean;
  completed: boolean;
  bestTime?: number; // w minutach
}

interface Boss {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  specialAbilities: string[];
  rewards: {
    coins: number;
    xp: number;
    items: string[];
  };
  icon: string;
  color: string;
}

export default function DungeonScreen() {
  const { colors, isLoaded } = useThemeContext();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);

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

  // Mock data
  const dungeons: Dungeon[] = [
    {
      id: '1',
      name: 'Jaskinia Goblina',
      description: 'Prosta jaskinia zamieszkana przez gobliny',
      difficulty: 'easy',
      floors: 3,
      energyCost: 15,
      rewards: {
        coins: 200,
        xp: 100,
        items: ['Goblin ząb', 'Brudny sztylet', 'Miedziana moneta'],
        gems: 5,
      },
      requirements: {
        minLevel: 3,
        petCount: 1,
        recommendedLevel: 5,
      },
      icon: 'home',
      color: success500,
      unlocked: true,
      completed: true,
      bestTime: 12,
    },
    {
      id: '2',
      name: 'Zamczysko Cienia',
      description: 'Mroczny zamek pełen nieumarłych',
      difficulty: 'medium',
      floors: 5,
      energyCost: 25,
      rewards: {
        coins: 500,
        xp: 250,
        items: ['Kościany miecz', 'Czarna zbroja', 'Dusza nieumarłego'],
        gems: 15,
      },
      requirements: {
        minLevel: 8,
        petCount: 2,
        recommendedLevel: 12,
      },
      icon: 'business',
      color: warning500,
      unlocked: true,
      completed: false,
    },
    {
      id: '3',
      name: 'Piekielna Wieża',
      description: 'Wieża sięgająca piekła, pełna demonów',
      difficulty: 'hard',
      floors: 10,
      energyCost: 40,
      rewards: {
        coins: 1000,
        xp: 500,
        items: ['Piekielny miecz', 'Demonicka zbroja', 'Serca demonów'],
        gems: 30,
      },
      requirements: {
        minLevel: 15,
        petCount: 3,
        recommendedLevel: 20,
      },
      icon: 'flame',
      color: error500,
      unlocked: true,
      completed: false,
    },
    {
      id: '4',
      name: 'Kosmiczna Ruina',
      description: 'Starożytna ruina z kosmicznymi potworami',
      difficulty: 'nightmare',
      floors: 15,
      energyCost: 60,
      rewards: {
        coins: 2000,
        xp: 1000,
        items: ['Kosmiczny miecz', 'Gwiazdowa zbroja', 'Energia wszechświata'],
        gems: 50,
      },
      requirements: {
        minLevel: 25,
        petCount: 4,
        recommendedLevel: 30,
      },
      icon: 'planet',
      color: accentGold,
      unlocked: false,
      completed: false,
    },
  ];

  const bosses: Boss[] = [
    {
      id: '1',
      name: 'Król Goblinów',
      level: 5,
      health: 100,
      maxHealth: 100,
      attack: 25,
      defense: 15,
      specialAbilities: ['Szarża', 'Wrzask bojowy'],
      rewards: {
        coins: 100,
        xp: 50,
        items: ['Korona goblina', 'Złoty sztylet'],
      },
      icon: 'skull',
      color: success500,
    },
    {
      id: '2',
      name: 'Lich Lord',
      level: 12,
      health: 250,
      maxHealth: 250,
      attack: 60,
      defense: 40,
      specialAbilities: ['Kostny szkielet', 'Czar śmierci', 'Regeneracja'],
      rewards: {
        coins: 300,
        xp: 150,
        items: ['Kostny miecz', 'Czarna księga', 'Dusza lich'],
      },
      icon: 'skull',
      color: warning500,
    },
    {
      id: '3',
      name: 'Demon Władca',
      level: 20,
      health: 500,
      maxHealth: 500,
      attack: 120,
      defense: 80,
      specialAbilities: ['Piekielny ogień', 'Teleportacja', 'Kontrola umysłu'],
      rewards: {
        coins: 800,
        xp: 400,
        items: ['Piekielny miecz', 'Demonicka zbroja', 'Serce demona'],
      },
      icon: 'flame',
      color: error500,
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Symulacja odświeżania danych
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleDungeonPress = (dungeon: Dungeon) => {
    if (!dungeon.unlocked) return;
    
    setSelectedDungeon(dungeon);
    Alert.alert(
      'Rozpocznij dungeon?',
      `Czy chcesz wejść do "${dungeon.name}"?\n\nKoszt: ${dungeon.energyCost} energii\nPiętra: ${dungeon.floors}\nTrudność: ${getDifficultyText(dungeon.difficulty)}`,
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Wejdź!', onPress: () => startDungeon(dungeon) },
      ]
    );
  };

  const startDungeon = (dungeon: Dungeon) => {
    // Tutaj będzie nawigacja do ekranu walki w dungeon
    Alert.alert('Dungeon rozpoczęty!', `Wchodzisz do "${dungeon.name}"`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return success500;
      case 'medium': return warning500;
      case 'hard': return error500;
      case 'nightmare': return accentGold;
      default: return textSecondary;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Łatwy';
      case 'medium': return 'Średni';
      case 'hard': return 'Trudny';
      case 'nightmare': return 'Koszmar';
      default: return 'Nieznany';
    }
  };

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: backgroundPrimary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: textPrimary }]}>Loading dungeons...</Text>
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
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: textPrimary }]}>
              🏰 Dungeon
            </Text>
            <Text style={[styles.subtitle, { color: textSecondary }]}>
              Pokonaj bossów i zdobądź skarby
            </Text>
          </View>
        </View>

        {/* Dungeon Stats */}
        <View style={[styles.statsContainer, { backgroundColor: backgroundCard }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: primaryColor }]}>1</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Ukończone</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: success500 }]}>3</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Bossy</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: accentGold }]}>12m</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Najlepszy czas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: warning500 }]}>85</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Energia</Text>
          </View>
        </View>

        {/* Dungeons List */}
        <View style={styles.dungeonsContainer}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Dostępne dungeony
          </Text>
          {dungeons.map((dungeon) => (
            <TouchableOpacity
              key={dungeon.id}
              style={[
                styles.dungeonCard,
                {
                  backgroundColor: backgroundCard,
                  borderColor: dungeon.unlocked ? borderPrimary : '#E5E7EB',
                  opacity: dungeon.unlocked ? 1 : 0.6,
                }
              ]}
              onPress={() => handleDungeonPress(dungeon)}
              disabled={!dungeon.unlocked}
              activeOpacity={0.8}
            >
              {/* Dungeon Icon */}
              <View style={[styles.dungeonIcon, { backgroundColor: `${dungeon.color}20` }]}>
                <Ionicons name={dungeon.icon as any} size={32} color={dungeon.color} />
              </View>

              {/* Dungeon Info */}
              <View style={styles.dungeonInfo}>
                <View style={styles.dungeonHeader}>
                  <Text style={[styles.dungeonName, { color: textPrimary }]}>
                    {dungeon.name}
                  </Text>
                  {dungeon.completed && (
                    <View style={[styles.completedBadge, { backgroundColor: success500 }]}>
                      <Ionicons name="checkmark" size={16} color={textInverse} />
                    </View>
                  )}
                </View>
                
                <Text style={[styles.dungeonDescription, { color: textSecondary }]}>
                  {dungeon.description}
                </Text>

                {/* Difficulty Badge */}
                <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(dungeon.difficulty)}20` }]}>
                  <Text style={[styles.difficultyText, { color: getDifficultyColor(dungeon.difficulty) }]}>
                    {getDifficultyText(dungeon.difficulty)}
                  </Text>
                </View>

                {/* Dungeon Stats */}
                <View style={styles.dungeonStats}>
                  <View style={styles.statRow}>
                    <Ionicons name="layers" size={16} color={textSecondary} />
                    <Text style={[styles.statText, { color: textSecondary }]}>
                      {dungeon.floors} pięter
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Ionicons name="flash" size={16} color={accentGold} />
                    <Text style={[styles.statText, { color: textSecondary }]}>
                      {dungeon.energyCost} energii
                    </Text>
                  </View>
                  {dungeon.bestTime && (
                    <View style={styles.statRow}>
                      <Ionicons name="time" size={16} color={success500} />
                      <Text style={[styles.statText, { color: textSecondary }]}>
                        {dungeon.bestTime}m
                      </Text>
                    </View>
                  )}
                </View>

                {/* Requirements */}
                <View style={styles.requirementsContainer}>
                  <Text style={[styles.requirementsLabel, { color: textSecondary }]}>
                    Wymagania:
                  </Text>
                  <Text style={[styles.requirementsText, { color: textSecondary }]}>
                    Poziom {dungeon.requirements.minLevel}, {dungeon.requirements.petCount} pets
                  </Text>
                </View>

                {/* Rewards */}
                <View style={styles.rewardsContainer}>
                  <Text style={[styles.rewardsLabel, { color: textSecondary }]}>
                    Nagrody:
                  </Text>
                  <View style={styles.rewardsList}>
                    <View style={[styles.rewardItem, { backgroundColor: primary100 }]}>
                      <Text style={[styles.rewardText, { color: primary600 }]}>
                        {dungeon.rewards.coins} coins
                      </Text>
                    </View>
                    <View style={[styles.rewardItem, { backgroundColor: primary100 }]}>
                      <Text style={[styles.rewardText, { color: primary600 }]}>
                        {dungeon.rewards.gems} gems
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Lock Icon for locked dungeons */}
                {!dungeon.unlocked && (
                  <View style={styles.lockContainer}>
                    <Ionicons name="lock-closed" size={20} color={textSecondary} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bosses Section */}
        <View style={styles.bossesContainer}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Bossy do pokonania
          </Text>
          {bosses.map((boss) => (
            <View key={boss.id} style={[styles.bossCard, { backgroundColor: backgroundCard }]}>
              <View style={[styles.bossIcon, { backgroundColor: `${boss.color}20` }]}>
                <Ionicons name={boss.icon as any} size={32} color={boss.color} />
              </View>
              
              <View style={styles.bossInfo}>
                <Text style={[styles.bossName, { color: textPrimary }]}>
                  {boss.name}
                </Text>
                <Text style={[styles.bossLevel, { color: textSecondary }]}>
                  Poziom {boss.level}
                </Text>
                
                {/* Boss Stats */}
                <View style={styles.bossStats}>
                  <View style={styles.bossStat}>
                    <Ionicons name="heart" size={14} color={error500} />
                    <Text style={[styles.bossStatText, { color: textSecondary }]}>
                      {boss.health}/{boss.maxHealth}
                    </Text>
                  </View>
                  <View style={styles.bossStat}>
                    <Ionicons name="flash" size={14} color={warning500} />
                    <Text style={[styles.bossStatText, { color: textSecondary }]}>
                      {boss.attack}
                    </Text>
                  </View>
                  <View style={styles.bossStat}>
                    <Ionicons name="shield" size={14} color={primaryColor} />
                    <Text style={[styles.bossStatText, { color: textSecondary }]}>
                      {boss.defense}
                    </Text>
                  </View>
                </View>

                {/* Special Abilities */}
                <View style={styles.abilitiesContainer}>
                  <Text style={[styles.abilitiesLabel, { color: textSecondary }]}>
                    Umiejętności:
                  </Text>
                  <View style={styles.abilitiesList}>
                    {boss.specialAbilities.map((ability, index) => (
                      <View key={index} style={[styles.abilityItem, { backgroundColor: primary100 }]}>
                        <Text style={[styles.abilityText, { color: primary600 }]}>
                          {ability}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  dungeonsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dungeonCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dungeonIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dungeonInfo: {
    flex: 1,
  },
  dungeonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dungeonName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dungeonDescription: {
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
  dungeonStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  requirementsContainer: {
    marginBottom: 12,
  },
  requirementsLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  requirementsText: {
    fontSize: 12,
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
  lockContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  bossesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bossCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bossIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bossInfo: {
    flex: 1,
  },
  bossName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bossLevel: {
    fontSize: 14,
    marginBottom: 12,
  },
  bossStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  bossStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bossStatText: {
    fontSize: 12,
    fontWeight: '500',
  },
  abilitiesContainer: {
    marginBottom: 8,
  },
  abilitiesLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  abilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  abilityItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  abilityText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
