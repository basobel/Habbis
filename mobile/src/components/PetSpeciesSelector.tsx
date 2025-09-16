import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';

interface PetSpeciesSelectorProps {
  selectedSpecies: string;
  onSpeciesChange: (species: string) => void;
}

const petSpecies = [
  { id: 'dragon', name: 'Dragon', emoji: '🐉', description: 'Powerful and majestic' },
  { id: 'phoenix', name: 'Phoenix', emoji: '🔥', description: 'Reborn from ashes' },
  { id: 'wolf', name: 'Wolf', emoji: '🐺', description: 'Loyal and fierce' },
  { id: 'cat', name: 'Cat', emoji: '🐱', description: 'Independent and agile' },
  { id: 'dog', name: 'Dog', emoji: '🐶', description: 'Loyal and friendly' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', description: 'Quick and energetic' },
  { id: 'bear', name: 'Bear', emoji: '🐻', description: 'Strong and protective' },
];

export default function PetSpeciesSelector({ selectedSpecies, onSpeciesChange }: PetSpeciesSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose Your Pet Species</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {petSpecies.map((species) => (
          <TouchableOpacity
            key={species.id}
            style={[
              styles.speciesCard,
              selectedSpecies === species.id && styles.selectedCard,
            ]}
            onPress={() => onSpeciesChange(species.id)}
          >
            <Text style={styles.emoji}>{species.emoji}</Text>
            <Text style={[
              styles.speciesName,
              selectedSpecies === species.id && styles.selectedText,
            ]}>
              {species.name}
            </Text>
            <Text style={[
              styles.description,
              selectedSpecies === species.id && styles.selectedDescription,
            ]}>
              {species.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  scrollView: {
    marginHorizontal: -4,
  },
  speciesCard: {
    backgroundColor: Colors.background.card,
    borderWidth: 2,
    borderColor: Colors.border.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    minWidth: 120,
    maxWidth: 140,
  },
  selectedCard: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  speciesName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedText: {
    color: Colors.primary[600],
  },
  description: {
    fontSize: 11,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  selectedDescription: {
    color: Colors.primary[600],
  },
});
