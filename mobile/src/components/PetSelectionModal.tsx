import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../contexts/ThemeContext';
import PetCard from './PetCard';

const { height: screenHeight } = Dimensions.get('window');

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

interface PetSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedPets: Pet[]) => void;
  maxPets: number;
  minPets: number;
  title: string;
  description: string;
  pets: Pet[];
}

export default function PetSelectionModal({
  visible,
  onClose,
  onConfirm,
  maxPets,
  minPets,
  title,
  description,
  pets,
}: PetSelectionModalProps) {
  const { colors, isLoaded } = useThemeContext();
  const [selectedPets, setSelectedPets] = useState<Pet[]>([]);
  const [slideAnim] = useState(new Animated.Value(screenHeight));

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

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handlePetSelect = (pet: Pet) => {
    const isSelected = selectedPets.some(p => p.id === pet.id);
    
    if (isSelected) {
      // Usuń pet z wyboru
      setSelectedPets(prev => prev.filter(p => p.id !== pet.id));
    } else {
      // Dodaj pet do wyboru (sprawdź limit)
      if (selectedPets.length >= maxPets) {
        Alert.alert('Limit pets', `Możesz wybrać maksymalnie ${maxPets} pets`);
        return;
      }
      setSelectedPets(prev => [...prev, pet]);
    }
  };

  const handleConfirm = () => {
    if (selectedPets.length < minPets) {
      Alert.alert('Za mało pets', `Musisz wybrać co najmniej ${minPets} pets`);
      return;
    }
    onConfirm(selectedPets);
    setSelectedPets([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedPets([]);
    onClose();
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

  if (!isLoaded || !colors) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: backgroundCard,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={[styles.title, { color: textPrimary }]}>
                  {title}
                </Text>
                <Text style={[styles.description, { color: textSecondary }]}>
                  {description}
                </Text>
                <Text style={[styles.selectionInfo, { color: textSecondary }]}>
                  Wybrano: {selectedPets.length}/{maxPets} pets
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Ionicons name="close" size={24} color={textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Selected Pets Preview */}
            {selectedPets.length > 0 && (
              <View style={[styles.selectedPetsContainer, { backgroundColor: primary100 }]}>
                <Text style={[styles.selectedPetsTitle, { color: primary600 }]}>
                  Wybrane pets:
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.selectedPetsList}>
                    {selectedPets.map((pet) => (
                      <View key={pet.id} style={[styles.selectedPetItem, { backgroundColor: backgroundCard }]}>
                        <Text style={[styles.selectedPetName, { color: textPrimary }]}>
                          {pet.name}
                        </Text>
                        <Text style={[styles.selectedPetLevel, { color: getRarityColor(pet.rarity) }]}>
                          Lv.{pet.level}
                        </Text>
                        <TouchableOpacity
                          style={styles.removePetButton}
                          onPress={() => handlePetSelect(pet)}
                        >
                          <Ionicons name="close-circle" size={16} color={error500} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Pets Grid */}
            <ScrollView style={styles.petsGrid} showsVerticalScrollIndicator={false}>
              <View style={styles.petsList}>
                {pets.map((pet) => {
                  const isSelected = selectedPets.some(p => p.id === pet.id);
                  return (
                    <TouchableOpacity
                      key={pet.id}
                      style={[
                        styles.petCard,
                        {
                          backgroundColor: backgroundCard,
                          borderColor: isSelected ? primaryColor : borderPrimary,
                          borderWidth: isSelected ? 2 : 1,
                        }
                      ]}
                      onPress={() => handlePetSelect(pet)}
                      activeOpacity={0.8}
                    >
                      {/* Selection Indicator */}
                      {isSelected && (
                        <View style={[styles.selectionIndicator, { backgroundColor: primaryColor }]}>
                          <Ionicons name="checkmark" size={16} color={textInverse} />
                        </View>
                      )}

                      {/* Pet Avatar */}
                      <View style={[styles.petAvatar, { backgroundColor: primary100 }]}>
                        <Ionicons
                          name="paw"
                          size={24}
                          color={primary600}
                        />
                      </View>

                      {/* Pet Info */}
                      <View style={styles.petInfo}>
                        <Text style={[styles.petName, { color: textPrimary }]}>
                          {pet.name}
                        </Text>
                        <Text style={[styles.petSpecies, { color: textSecondary }]}>
                          {pet.species}
                        </Text>
                        <Text style={[styles.petLevel, { color: getRarityColor(pet.rarity) }]}>
                          Lv.{pet.level} • {pet.rarity.toUpperCase()}
                        </Text>
                      </View>

                      {/* Pet Stats */}
                      <View style={styles.petStats}>
                        <View style={styles.statRow}>
                          <Ionicons name="heart" size={12} color={error500} />
                          <Text style={[styles.statText, { color: textSecondary }]}>
                            {pet.health}/{pet.maxHealth}
                          </Text>
                        </View>
                        <View style={styles.statRow}>
                          <Ionicons name="star" size={12} color={primaryColor} />
                          <Text style={[styles.statText, { color: textSecondary }]}>
                            {pet.experience}/{pet.maxExperience}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: borderPrimary }]}
                onPress={handleClose}
              >
                <Text style={[styles.cancelButtonText, { color: textSecondary }]}>
                  Anuluj
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor: selectedPets.length >= minPets ? primaryColor : textSecondary,
                    opacity: selectedPets.length >= minPets ? 1 : 0.6,
                  }
                ]}
                onPress={handleConfirm}
                disabled={selectedPets.length < minPets}
              >
                <Text style={[styles.confirmButtonText, { color: textInverse }]}>
                  Potwierdź ({selectedPets.length})
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
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
    height: screenHeight * 0.85,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  selectionInfo: {
    fontSize: 12,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  selectedPetsContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  selectedPetsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  selectedPetsList: {
    flexDirection: 'row',
    gap: 8,
  },
  selectedPetItem: {
    padding: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    position: 'relative',
  },
  selectedPetName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedPetLevel: {
    fontSize: 10,
    fontWeight: '500',
  },
  removePetButton: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  petsGrid: {
    flex: 1,
    padding: 16,
  },
  petsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  petCard: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  petAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  petInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  petName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  petSpecies: {
    fontSize: 12,
    marginBottom: 2,
  },
  petLevel: {
    fontSize: 10,
    fontWeight: '600',
  },
  petStats: {
    gap: 4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 10,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
