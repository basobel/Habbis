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

interface Opponent {
  id: string;
  name: string;
  level: number;
  rank: number;
  pets: {
    id: string;
    name: string;
    species: string;
    level: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }[];
  winRate: number;
  isOnline: boolean;
}

interface BattleResult {
  id: string;
  opponent: Opponent;
  result: 'win' | 'lose';
  rewards: {
    coins: number;
    xp: number;
    trophies: number;
  };
  timestamp: Date;
}

export default function ArenaScreen() {
  const { colors, isLoaded } = useThemeContext();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState<Opponent | null>(null);
  const [battleHistory, setBattleHistory] = useState<BattleResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
  const opponents: Opponent[] = [
    {
      id: '1',
      name: 'DragonMaster',
      level: 15,
      rank: 1250,
      pets: [
        { id: '1', name: 'Flame', species: 'Dragon', level: 12, rarity: 'legendary' },
        { id: '2', name: 'Storm', species: 'Eagle', level: 10, rarity: 'epic' },
      ],
      winRate: 78,
      isOnline: true,
    },
    {
      id: '2',
      name: 'PetCollector',
      level: 12,
      rank: 1100,
      pets: [
        { id: '3', name: 'Whiskers', species: 'Cat', level: 8, rarity: 'rare' },
        { id: '4', name: 'Rex', species: 'Dog', level: 9, rarity: 'common' },
      ],
      winRate: 65,
      isOnline: false,
    },
    {
      id: '3',
      name: 'BattleKing',
      level: 18,
      rank: 1450,
      pets: [
        { id: '5', name: 'Thunder', species: 'Tiger', level: 15, rarity: 'legendary' },
        { id: '6', name: 'Shadow', species: 'Wolf', level: 13, rarity: 'epic' },
      ],
      winRate: 85,
      isOnline: true,
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Symulacja odświeżania danych
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleOpponentPress = (opponent: Opponent) => {
    setSelectedOpponent(opponent);
    Alert.alert(
      'Rozpocznij walkę?',
      `Czy chcesz walczyć z ${opponent.name}?`,
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Walcz!', onPress: () => startBattle(opponent) },
      ]
    );
  };

  const startBattle = (opponent: Opponent) => {
    setIsSearching(true);
    // Symulacja wyszukiwania przeciwnika
    setTimeout(() => {
      setIsSearching(false);
      // Tutaj będzie nawigacja do ekranu walki
      Alert.alert('Walka rozpoczęta!', `Walczysz z ${opponent.name}`);
    }, 2000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return textSecondary;
      case 'rare': return primaryColor;
      case 'epic': return primary600;
      case 'legendary': return accentGold;
      default: return textSecondary;
    }
  };

  const getRankColor = (rank: number) => {
    if (rank >= 1400) return accentGold;
    if (rank >= 1200) return primary600;
    if (rank >= 1000) return primaryColor;
    return textSecondary;
  };

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: backgroundPrimary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: textPrimary }]}>Loading arena...</Text>
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
              🏆 Arena PvP
            </Text>
            <Text style={[styles.subtitle, { color: textSecondary }]}>
              Walcz z innymi graczami
            </Text>
          </View>
        </View>

        {/* Player Stats */}
        <View style={[styles.playerStats, { backgroundColor: backgroundCard }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: primaryColor }]}>1250</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Ranking</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: success500 }]}>12</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Wygrane</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: error500 }]}>3</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Przegrane</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: accentGold }]}>80%</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Win Rate</Text>
          </View>
        </View>

        {/* Search Button */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={[
              styles.searchButton,
              {
                backgroundColor: isSearching ? textSecondary : primaryColor,
                opacity: isSearching ? 0.7 : 1,
              }
            ]}
            onPress={() => setIsSearching(!isSearching)}
            disabled={isSearching}
          >
            <Ionicons
              name={isSearching ? "stop" : "search"}
              size={20}
              color={textInverse}
            />
            <Text style={[styles.searchButtonText, { color: textInverse }]}>
              {isSearching ? 'Szukam przeciwnika...' : 'Szukaj przeciwnika'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Opponents List */}
        <View style={styles.opponentsContainer}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Dostępni przeciwnicy
          </Text>
          {opponents.map((opponent) => (
            <TouchableOpacity
              key={opponent.id}
              style={[
                styles.opponentCard,
                {
                  backgroundColor: backgroundCard,
                  borderColor: opponent.isOnline ? success500 : borderPrimary,
                }
              ]}
              onPress={() => handleOpponentPress(opponent)}
              activeOpacity={0.8}
            >
              {/* Opponent Info */}
              <View style={styles.opponentHeader}>
                <View style={styles.opponentInfo}>
                  <Text style={[styles.opponentName, { color: textPrimary }]}>
                    {opponent.name}
                  </Text>
                  <Text style={[styles.opponentLevel, { color: textSecondary }]}>
                    Poziom {opponent.level}
                  </Text>
                </View>
                <View style={styles.opponentStats}>
                  <View style={[styles.rankBadge, { backgroundColor: `${getRankColor(opponent.rank)}20` }]}>
                    <Text style={[styles.rankText, { color: getRankColor(opponent.rank) }]}>
                      {opponent.rank}
                    </Text>
                  </View>
                  <Text style={[styles.winRate, { color: textSecondary }]}>
                    {opponent.winRate}% WR
                  </Text>
                </View>
              </View>

              {/* Pets */}
              <View style={styles.petsContainer}>
                <Text style={[styles.petsLabel, { color: textSecondary }]}>
                  Pets:
                </Text>
                <View style={styles.petsList}>
                  {opponent.pets.map((pet) => (
                    <View key={pet.id} style={[styles.petBadge, { backgroundColor: primary100 }]}>
                      <Text style={[styles.petName, { color: primary600 }]}>
                        {pet.name}
                      </Text>
                      <Text style={[styles.petLevel, { color: getRarityColor(pet.rarity) }]}>
                        Lv.{pet.level}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Online Status */}
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: opponent.isOnline ? success500 : textSecondary }
                ]} />
                <Text style={[styles.statusText, { color: textSecondary }]}>
                  {opponent.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Battle History */}
        <View style={styles.historyContainer}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Historia walk
          </Text>
          {battleHistory.length === 0 ? (
            <View style={[styles.emptyHistory, { backgroundColor: backgroundCard }]}>
              <Ionicons name="trophy-outline" size={48} color={textSecondary} />
              <Text style={[styles.emptyText, { color: textSecondary }]}>
                Brak historii walk
              </Text>
              <Text style={[styles.emptySubtext, { color: textSecondary }]}>
                Rozpocznij swoją pierwszą walkę!
              </Text>
            </View>
          ) : (
            battleHistory.map((battle) => (
              <View key={battle.id} style={[styles.historyItem, { backgroundColor: backgroundCard }]}>
                <View style={styles.historyInfo}>
                  <Text style={[styles.historyOpponent, { color: textPrimary }]}>
                    vs {battle.opponent.name}
                  </Text>
                  <Text style={[styles.historyResult, { 
                    color: battle.result === 'win' ? success500 : error500 
                  }]}>
                    {battle.result === 'win' ? 'Wygrana' : 'Przegrana'}
                  </Text>
                </View>
                <View style={styles.historyRewards}>
                  <Text style={[styles.rewardText, { color: textSecondary }]}>
                    +{battle.rewards.coins} coins
                  </Text>
                </View>
              </View>
            ))
          )}
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
  playerStats: {
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  opponentsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  opponentCard: {
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
  opponentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  opponentInfo: {
    flex: 1,
  },
  opponentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  opponentLevel: {
    fontSize: 14,
  },
  opponentStats: {
    alignItems: 'flex-end',
  },
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  winRate: {
    fontSize: 12,
  },
  petsContainer: {
    marginBottom: 12,
  },
  petsLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  petsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  petBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  petName: {
    fontSize: 11,
    fontWeight: '500',
  },
  petLevel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
  },
  historyContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyHistory: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyInfo: {
    flex: 1,
  },
  historyOpponent: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  historyResult: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyRewards: {
    alignItems: 'flex-end',
  },
  rewardText: {
    fontSize: 12,
  },
});
