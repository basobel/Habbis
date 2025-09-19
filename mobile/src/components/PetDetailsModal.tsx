import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

interface PetDetailsModalProps {
  visible: boolean;
  pet: Pet | null;
  onClose: () => void;
  onFeed: (pet: Pet) => void;
  onPlay: (pet: Pet) => void;
  onEquip: (pet: Pet, item: string) => void;
}

export default function PetDetailsModal({
  visible,
  pet,
  onClose,
  onFeed,
  onPlay,
  onEquip,
}: PetDetailsModalProps) {
  const { colors, isLoaded } = useThemeContext();
  const [selectedTab, setSelectedTab] = useState<'stats' | 'equipment' | 'actions'>('stats');
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!isLoaded || !colors || !colors.primary || !colors.primary[500] || !pet) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return colors.text.secondary;
      case 'rare': return colors.primary[500];
      case 'epic': return colors.accent.gold;
      case 'legendary': return '#FF6B6B';
      default: return colors.text.secondary;
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

  const handleFeed = () => {
    onFeed(pet);
    Alert.alert('Karmienie', `${pet.name} został nakarmiony! 🍽️`);
  };

  const handlePlay = () => {
    onPlay(pet);
    Alert.alert('Zabawa', `${pet.name} bawi się z Tobą! 🎾`);
  };

  const handleEquip = (item: string) => {
    onEquip(pet, item);
    Alert.alert('Ekwipowanie', `${item} zostało założone na ${pet.name}! ⚔️`);
  };

  const equipmentItems = [
    { id: 'collar', name: 'Obroża', icon: 'diamond-outline', rarity: 'common' },
    { id: 'hat', name: 'Kapelusz', icon: 'hat', rarity: 'rare' },
    { id: 'glasses', name: 'Okulary', icon: 'glasses-outline', rarity: 'epic' },
    { id: 'crown', name: 'Korona', icon: 'crown-outline', rarity: 'legendary' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: colors.background.card,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.primary }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.avatar, { backgroundColor: colors.primary[100] }]}>
                <Ionicons
                  name={getSpeciesIcon(pet.species) as any}
                  size={32}
                  color={colors.primary[600]}
                />
              </View>
              <View style={styles.petInfo}>
                <Text style={[styles.petName, { color: colors.text.primary }]}>
                  {pet.name}
                </Text>
                <Text style={[styles.petSpecies, { color: colors.text.secondary }]}>
                  {pet.species} • Lv.{pet.level}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={[styles.tabs, { backgroundColor: colors.background.primary }]}>
            {[
              { key: 'stats', label: 'Statystyki', icon: 'stats-chart-outline' },
              { key: 'equipment', label: 'Ekwipunek', icon: 'shirt-outline' },
              { key: 'actions', label: 'Akcje', icon: 'play-outline' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  {
                    backgroundColor: selectedTab === tab.key ? colors.primary[600] : 'transparent',
                  }
                ]}
                onPress={() => setSelectedTab(tab.key as any)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={20}
                  color={selectedTab === tab.key ? colors.text.inverse : colors.text.secondary}
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: selectedTab === tab.key ? colors.text.inverse : colors.text.secondary,
                    }
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {selectedTab === 'stats' && (
              <View style={styles.statsContent}>
                {/* Health */}
                <View style={[styles.statCard, { backgroundColor: colors.background.primary }]}>
                  <View style={styles.statHeader}>
                    <Ionicons name="heart" size={20} color={colors.error[500]} />
                    <Text style={[styles.statTitle, { color: colors.text.primary }]}>Zdrowie</Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {pet.health}/{pet.maxHealth}
                    </Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: colors.border.primary }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(pet.health / pet.maxHealth) * 100}%`,
                          backgroundColor: colors.error[500],
                        }
                      ]}
                    />
                  </View>
                </View>

                {/* Hunger */}
                <View style={[styles.statCard, { backgroundColor: colors.background.primary }]}>
                  <View style={styles.statHeader}>
                    <Ionicons name="restaurant" size={20} color={colors.accent.gold} />
                    <Text style={[styles.statTitle, { color: colors.text.primary }]}>Głód</Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {pet.hunger}/{pet.maxHunger}
                    </Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: colors.border.primary }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(pet.hunger / pet.maxHunger) * 100}%`,
                          backgroundColor: pet.hunger < 30 ? colors.error[500] : colors.accent.gold,
                        }
                      ]}
                    />
                  </View>
                </View>

                {/* Happiness */}
                <View style={[styles.statCard, { backgroundColor: colors.background.primary }]}>
                  <View style={styles.statHeader}>
                    <Ionicons name="happy" size={20} color={colors.success[500]} />
                    <Text style={[styles.statTitle, { color: colors.text.primary }]}>Szczęście</Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {pet.happiness}/{pet.maxHappiness}
                    </Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: colors.border.primary }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(pet.happiness / pet.maxHappiness) * 100}%`,
                          backgroundColor: colors.success[500],
                        }
                      ]}
                    />
                  </View>
                </View>

                {/* Experience */}
                <View style={[styles.statCard, { backgroundColor: colors.background.primary }]}>
                  <View style={styles.statHeader}>
                    <Ionicons name="star" size={20} color={colors.primary[500]} />
                    <Text style={[styles.statTitle, { color: colors.text.primary }]}>Doświadczenie</Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {pet.experience}/{pet.maxExperience}
                    </Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: colors.border.primary }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(pet.experience / pet.maxExperience) * 100}%`,
                          backgroundColor: colors.primary[500],
                        }
                      ]}
                    />
                  </View>
                </View>
              </View>
            )}

            {selectedTab === 'equipment' && (
              <View style={styles.equipmentContent}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Dostępne przedmioty
                </Text>
                {equipmentItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.equipmentItem, { backgroundColor: colors.background.primary }]}
                    onPress={() => handleEquip(item.name)}
                  >
                    <View style={[styles.equipmentIcon, { backgroundColor: colors.primary[100] }]}>
                      <Ionicons name={item.icon as any} size={24} color={colors.primary[600]} />
                    </View>
                    <View style={styles.equipmentInfo}>
                      <Text style={[styles.equipmentName, { color: colors.text.primary }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.equipmentRarity, { color: getRarityColor(item.rarity) }]}>
                        {item.rarity.toUpperCase()}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedTab === 'actions' && (
              <View style={styles.actionsContent}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.accent.gold }]}
                  onPress={handleFeed}
                >
                  <Ionicons name="restaurant" size={24} color={colors.text.inverse} />
                  <Text style={[styles.actionButtonText, { color: colors.text.inverse }]}>
                    Nakarm
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.success[500] }]}
                  onPress={handlePlay}
                >
                  <Ionicons name="happy" size={24} color={colors.text.inverse} />
                  <Text style={[styles.actionButtonText, { color: colors.text.inverse }]}>
                    Pobaw się
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary[500] }]}
                  onPress={() => Alert.alert('Głaskanie', `${pet.name} jest szczęśliwy! 😊`)}
                >
                  <Ionicons name="hand-left" size={24} color={colors.text.inverse} />
                  <Text style={[styles.actionButtonText, { color: colors.text.inverse }]}>
                    Pogłaszcz
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    height: screenHeight * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  petSpecies: {
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContent: {
    gap: 16,
  },
  statCard: {
    padding: 16,
    borderRadius: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  equipmentContent: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  equipmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  equipmentRarity: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContent: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
