import React, { useState } from 'react';
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
import { useThemeContext } from '@/contexts/ThemeContext';
import { useNavigation } from '@/hooks/useNavigation';
import PetCard from '@/components/PetCard';
import PetDetailsModal from '@/components/PetDetailsModal';
import SharedHeader from '@/components/SharedHeader';
import HamburgerMenu from '@/components/HamburgerMenu';

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

export default function PetsScreen() {
  const { colors, isLoaded } = useThemeContext();
  const { handleNavigate } = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'common' | 'rare' | 'epic' | 'legendary'>('all');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState(false);

  // Mock data - w przyszłości będzie z Redux store
  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Whiskers',
      species: 'Cat',
      level: 5,
      experience: 750,
      maxExperience: 1000,
      health: 85,
      maxHealth: 100,
      hunger: 60,
      maxHunger: 100,
      happiness: 90,
      maxHappiness: 100,
      rarity: 'rare',
      isActive: true,
      lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      lastPlayed: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
      id: '2',
      name: 'Buddy',
      species: 'Dog',
      level: 3,
      experience: 400,
      maxExperience: 600,
      health: 95,
      maxHealth: 100,
      hunger: 30,
      maxHunger: 100,
      happiness: 70,
      maxHappiness: 100,
      rarity: 'common',
      isActive: false,
      lastFed: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      lastPlayed: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: '3',
      name: 'Phoenix',
      species: 'Dragon',
      level: 8,
      experience: 1200,
      maxExperience: 1500,
      health: 100,
      maxHealth: 100,
      hunger: 80,
      maxHunger: 100,
      happiness: 95,
      maxHappiness: 100,
      rarity: 'legendary',
      isActive: false,
      lastFed: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      lastPlayed: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    {
      id: '4',
      name: 'Bubbles',
      species: 'Fish',
      level: 2,
      experience: 150,
      maxExperience: 300,
      health: 70,
      maxHealth: 100,
      hunger: 90,
      maxHunger: 100,
      happiness: 60,
      maxHappiness: 100,
      rarity: 'common',
      isActive: false,
      lastFed: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      lastPlayed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handlePetPress = (pet: Pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const handleFeedPet = (pet: Pet) => {
    Alert.alert(
      'Karmienie',
      `Nakarmiłeś ${pet.name}! 🍽️`,
      [{ text: 'OK' }]
    );
    // Update pet hunger
    setPets(prevPets =>
      prevPets.map(p =>
        p.id === pet.id
          ? { ...p, hunger: Math.min(p.hunger + 30, p.maxHunger), lastFed: new Date() }
          : p
      )
    );
  };

  const handlePlayWithPet = (pet: Pet) => {
    Alert.alert(
      'Zabawa',
      `${pet.name} jest szczęśliwy! 🎾`,
      [{ text: 'OK' }]
    );
    // Update pet happiness
    setPets(prevPets =>
      prevPets.map(p =>
        p.id === pet.id
          ? { ...p, happiness: Math.min(p.happiness + 20, p.maxHappiness), lastPlayed: new Date() }
          : p
      )
    );
  };

  const handleEquipPet = (pet: Pet, item: string) => {
    // Update pet equipment
    console.log(`Equipped ${item} on ${pet.name}`);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPet(null);
  };

  const filteredPets = pets.filter(pet => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return pet.isActive;
    return pet.rarity === selectedFilter;
  });

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case 'all': return 'grid-outline';
      case 'active': return 'star';
      case 'common': return 'star-outline';
      case 'rare': return 'star';
      case 'epic': return 'diamond-outline';
      case 'legendary': return 'diamond';
      default: return 'grid-outline';
    }
  };

  const getFilterColor = (filter: string) => {
    if (selectedFilter === filter) return colors?.primary?.[600] || '#6D28D9';
    return colors?.text?.secondary || '#6B7280';
  };


  if (!isLoaded || !colors || !colors.primary || !colors.primary[500]) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#4C1D95' }]}>Loading pets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <SharedHeader
        title="Moje Zwierzęta"
        subtitle={`${pets.length} zwierząt • ${pets.filter(p => p.isActive).length} aktywnych`}
        onHamburgerPress={() => setIsHamburgerMenuVisible(true)}
        rightAction={{
          icon: 'add',
          onPress: () => {
            // TODO: Implement add pet
            console.log('Add pet');
          }
        }}
      />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { key: 'all', label: 'Wszystkie' },
            { key: 'active', label: 'Aktywne' },
            { key: 'common', label: 'Pospolite' },
            { key: 'rare', label: 'Rzadkie' },
            { key: 'epic', label: 'Epickie' },
            { key: 'legendary', label: 'Legendarne' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                {
                  backgroundColor: selectedFilter === filter.key ? colors.primary?.[100] || '#EDE9FE' : 'transparent',
                  borderColor: selectedFilter === filter.key ? colors.primary?.[500] || '#7C3AED' : colors.border?.primary || '#C4B5FD',
                }
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <Ionicons
                name={getFilterIcon(filter.key) as any}
                size={16}
                color={getFilterColor(filter.key)}
              />
              <Text style={[styles.filterText, { color: getFilterColor(filter.key) }]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Pets Grid */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {filteredPets.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.background.card }]}>
            <Ionicons name="paw-outline" size={48} color={colors.text.muted} />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              Brak zwierząt
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
              {selectedFilter === 'all' 
                ? 'Dodaj swoje pierwsze zwierzę!' 
                : `Brak zwierząt w kategorii ${selectedFilter}`
              }
            </Text>
            <TouchableOpacity
              style={[styles.addPetButton, { backgroundColor: colors.primary[600] }]}
            >
              <Text style={[styles.addPetButtonText, { color: colors.text.inverse }]}>
                Dodaj zwierzę
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.petsGrid}>
            {filteredPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onPress={() => handlePetPress(pet)}
                onFeed={() => handleFeedPet(pet)}
                onPlay={() => handlePlayWithPet(pet)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Pet Details Modal */}
      <PetDetailsModal
        visible={modalVisible}
        pet={selectedPet}
        onClose={handleCloseModal}
        onFeed={handleFeedPet}
        onPlay={handlePlayWithPet}
        onEquip={handleEquipPet}
      />

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  filterContainer: {
    paddingVertical: 12,
    marginTop: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 32,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  addPetButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addPetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  petsGrid: {
    paddingBottom: 20,
  },
});