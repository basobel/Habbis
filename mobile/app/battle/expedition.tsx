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

interface Expedition {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // w godzinach
  energyCost: number;
  rewards: {
    coins: number;
    xp: number;
    items: string[];
  };
  requirements: {
    minLevel: number;
    petCount: number;
  };
  icon: string;
  color: string;
  unlocked: boolean;
}

interface ActiveExpedition {
  id: string;
  expedition: Expedition;
  pets: string[]; // pet IDs
  startTime: Date;
  endTime: Date;
  status: 'active' | 'completed' | 'failed';
}

export default function ExpeditionScreen() {
  const { colors, isLoaded } = useThemeContext();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedExpedition, setSelectedExpedition] = useState<Expedition | null>(null);
  const [activeExpeditions, setActiveExpeditions] = useState<ActiveExpedition[]>([]);

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
  const expeditions: Expedition[] = [
    {
      id: '1',
      name: 'Leśna Przygoda',
      description: 'Pets eksplorują tajemniczy las w poszukiwaniu skarbów',
      difficulty: 'easy',
      duration: 2,
      energyCost: 10,
      rewards: {
        coins: 100,
        xp: 50,
        items: ['Leśne jagody', 'Drewno', 'Kamień'],
      },
      requirements: {
        minLevel: 1,
        petCount: 1,
      },
      icon: 'leaf',
      color: success500,
      unlocked: true,
    },
    {
      id: '2',
      name: 'Górska Wyprawa',
      description: 'Wspinaczka na szczyt góry po rzadkie minerały',
      difficulty: 'medium',
      duration: 4,
      energyCost: 20,
      rewards: {
        coins: 250,
        xp: 120,
        items: ['Górski kryształ', 'Ruda żelaza', 'Złoty pył'],
      },
      requirements: {
        minLevel: 5,
        petCount: 2,
      },
      icon: 'mountain',
      color: warning500,
      unlocked: true,
    },
    {
      id: '3',
      name: 'Morska Ekspedycja',
      description: 'Głębokie wody skrywają starożytne artefakty',
      difficulty: 'hard',
      duration: 8,
      energyCost: 35,
      rewards: {
        coins: 500,
        xp: 250,
        items: ['Perła', 'Koral', 'Starożytny artefakt'],
      },
      requirements: {
        minLevel: 10,
        petCount: 3,
      },
      icon: 'water',
      color: primary600,
      unlocked: true,
    },
    {
      id: '4',
      name: 'Kosmiczna Misja',
      description: 'Podróż w kosmos po nieznane technologie',
      difficulty: 'hard',
      duration: 12,
      energyCost: 50,
      rewards: {
        coins: 1000,
        xp: 500,
        items: ['Kosmiczny metal', 'Energia gwiazd', 'Technologia'],
      },
      requirements: {
        minLevel: 15,
        petCount: 4,
      },
      icon: 'rocket',
      color: accentGold,
      unlocked: false,
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Symulacja odświeżania danych
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleExpeditionPress = (expedition: Expedition) => {
    if (!expedition.unlocked) return;
    
    setSelectedExpedition(expedition);
    Alert.alert(
      'Rozpocznij ekspedycję?',
      `Czy chcesz wysłać pets na "${expedition.name}"?\n\nKoszt: ${expedition.energyCost} energii\nCzas: ${expedition.duration}h`,
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Wyślij!', onPress: () => startExpedition(expedition) },
      ]
    );
  };

  const startExpedition = (expedition: Expedition) => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + expedition.duration * 60 * 60 * 1000);
    
    const newExpedition: ActiveExpedition = {
      id: Date.now().toString(),
      expedition,
      pets: ['1', '2'], // Mock pet IDs
      startTime,
      endTime,
      status: 'active',
    };
    
    setActiveExpeditions(prev => [...prev, newExpedition]);
    Alert.alert('Ekspedycja rozpoczęta!', `Pets wyruszyły na "${expedition.name}"`);
  };

  const claimExpedition = (expeditionId: string) => {
    setActiveExpeditions(prev => 
      prev.map(exp => 
        exp.id === expeditionId 
          ? { ...exp, status: 'completed' as const }
          : exp
      )
    );
    Alert.alert('Nagrody odebrane!', 'Sprawdź swój ekwipunek');
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

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Zakończona';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: backgroundPrimary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: textPrimary }]}>Loading expeditions...</Text>
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
              🗺️ Ekspedycje
            </Text>
            <Text style={[styles.subtitle, { color: textSecondary }]}>
              Wyślij pets na przygodę
            </Text>
          </View>
        </View>

        {/* Energy Status */}
        <View style={[styles.energyStatus, { backgroundColor: backgroundCard }]}>
          <View style={styles.energyInfo}>
            <Ionicons name="flash" size={20} color={accentGold} />
            <Text style={[styles.energyText, { color: textPrimary }]}>
              Energia: 85/100
            </Text>
          </View>
          <View style={[styles.energyBar, { backgroundColor: primary100 }]}>
            <View style={[styles.energyFill, { 
              width: '85%', 
              backgroundColor: accentGold 
            }]} />
          </View>
        </View>

        {/* Active Expeditions */}
        {activeExpeditions.length > 0 && (
          <View style={styles.activeExpeditions}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              Aktywne ekspedycje
            </Text>
            {activeExpeditions.map((activeExp) => (
              <View key={activeExp.id} style={[styles.activeCard, { backgroundColor: backgroundCard }]}>
                <View style={styles.activeHeader}>
                  <Text style={[styles.activeName, { color: textPrimary }]}>
                    {activeExp.expedition.name}
                  </Text>
                  <Text style={[styles.activeStatus, { 
                    color: activeExp.status === 'completed' ? success500 : warning500 
                  }]}>
                    {activeExp.status === 'completed' ? 'Zakończona' : 'W trakcie'}
                  </Text>
                </View>
                
                <Text style={[styles.activeTime, { color: textSecondary }]}>
                  {formatTimeRemaining(activeExp.endTime)}
                </Text>
                
                {activeExp.status === 'completed' && (
                  <TouchableOpacity
                    style={[styles.claimButton, { backgroundColor: success500 }]}
                    onPress={() => claimExpedition(activeExp.id)}
                  >
                    <Text style={[styles.claimButtonText, { color: textInverse }]}>
                      Odbierz nagrody
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Available Expeditions */}
        <View style={styles.expeditionsContainer}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Dostępne ekspedycje
          </Text>
          {expeditions.map((expedition) => (
            <TouchableOpacity
              key={expedition.id}
              style={[
                styles.expeditionCard,
                {
                  backgroundColor: backgroundCard,
                  borderColor: expedition.unlocked ? borderPrimary : '#E5E7EB',
                  opacity: expedition.unlocked ? 1 : 0.6,
                }
              ]}
              onPress={() => handleExpeditionPress(expedition)}
              disabled={!expedition.unlocked}
              activeOpacity={0.8}
            >
              {/* Expedition Icon */}
              <View style={[styles.expeditionIcon, { backgroundColor: `${expedition.color}20` }]}>
                <Ionicons name={expedition.icon as any} size={32} color={expedition.color} />
              </View>

              {/* Expedition Info */}
              <View style={styles.expeditionInfo}>
                <Text style={[styles.expeditionName, { color: textPrimary }]}>
                  {expedition.name}
                </Text>
                <Text style={[styles.expeditionDescription, { color: textSecondary }]}>
                  {expedition.description}
                </Text>

                {/* Difficulty Badge */}
                <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(expedition.difficulty)}20` }]}>
                  <Text style={[styles.difficultyText, { color: getDifficultyColor(expedition.difficulty) }]}>
                    {getDifficultyText(expedition.difficulty)}
                  </Text>
                </View>

                {/* Requirements */}
                <View style={styles.requirementsContainer}>
                  <Text style={[styles.requirementsLabel, { color: textSecondary }]}>
                    Wymagania:
                  </Text>
                  <Text style={[styles.requirementsText, { color: textSecondary }]}>
                    Poziom {expedition.requirements.minLevel}, {expedition.requirements.petCount} pets
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
                        {expedition.rewards.coins} coins
                      </Text>
                    </View>
                    <View style={[styles.rewardItem, { backgroundColor: primary100 }]}>
                      <Text style={[styles.rewardText, { color: primary600 }]}>
                        {expedition.rewards.xp} XP
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Cost and Duration */}
                <View style={styles.costContainer}>
                  <View style={styles.costItem}>
                    <Ionicons name="flash" size={16} color={accentGold} />
                    <Text style={[styles.costText, { color: textSecondary }]}>
                      {expedition.energyCost} energii
                    </Text>
                  </View>
                  <View style={styles.costItem}>
                    <Ionicons name="time" size={16} color={textSecondary} />
                    <Text style={[styles.costText, { color: textSecondary }]}>
                      {expedition.duration}h
                    </Text>
                  </View>
                </View>

                {/* Lock Icon for locked expeditions */}
                {!expedition.unlocked && (
                  <View style={styles.lockContainer}>
                    <Ionicons name="lock-closed" size={20} color={textSecondary} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
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
  energyStatus: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  energyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  energyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  energyBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  energyFill: {
    height: '100%',
    borderRadius: 4,
  },
  activeExpeditions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  activeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeTime: {
    fontSize: 14,
    marginBottom: 12,
  },
  claimButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  claimButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  expeditionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  expeditionCard: {
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
  expeditionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  expeditionInfo: {
    flex: 1,
  },
  expeditionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  expeditionDescription: {
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
  costContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  costItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  costText: {
    fontSize: 12,
    fontWeight: '500',
  },
  lockContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
