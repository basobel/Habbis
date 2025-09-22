import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

interface AvatarIconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

interface IconOption {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
}

const avatarIcons: IconOption[] = [
  { name: 'person', label: 'Osoba', color: '#6B7280' },
  { name: 'shield', label: 'Wojownik', color: '#EF4444' },
  { name: 'sparkles', label: 'Mag', color: '#8B5CF6' },
  { name: 'eye', label: 'Łotr', color: '#F59E0B' },
  { name: 'shield-half', label: 'Paladyn', color: '#3B82F6' },
  { name: 'leaf', label: 'Druid', color: '#10B981' },
  { name: 'flame', label: 'Berserker', color: '#DC2626' },
  { name: 'skull', label: 'Nekromanta', color: '#6B7280' },
  { name: 'fitness', label: 'Mnich', color: '#F97316' },
  { name: 'star', label: 'Gwiazda', color: '#F59E0B' },
  { name: 'diamond', label: 'Diament', color: '#8B5CF6' },
  { name: 'heart', label: 'Serce', color: '#EF4444' },
  { name: 'thunderstorm', label: 'Burza', color: '#3B82F6' },
  { name: 'moon', label: 'Księżyc', color: '#6B7280' },
  { name: 'sunny', label: 'Słońce', color: '#F59E0B' },
  { name: 'rocket', label: 'Rakieta', color: '#8B5CF6' },
];

const IconItem: React.FC<{
  icon: IconOption;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ icon, isSelected, onSelect }) => {
  const { colors } = useThemeContext();

  return (
    <TouchableOpacity
      style={[
        styles.iconItem,
        {
          backgroundColor: isSelected ? colors.primary[600] + '20' : colors.background.secondary,
          borderColor: isSelected ? colors.primary[600] : 'transparent',
        },
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
        <Ionicons
          name={icon.name}
          size={24}
          color={isSelected ? colors.primary[600] : icon.color}
        />
      </View>
      <Text style={[
        styles.iconLabel,
        { color: isSelected ? colors.primary[600] : colors.text.secondary }
      ]}>
        {icon.label}
      </Text>
      {isSelected && (
        <View style={[styles.selectedIndicator, { backgroundColor: colors.primary[600] }]}>
          <Ionicons name="checkmark" size={12} color={colors.text.inverse} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function AvatarIconSelector({ selectedIcon, onIconSelect }: AvatarIconSelectorProps) {
  const { colors } = useThemeContext();

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {avatarIcons.map((icon) => (
          <IconItem
            key={icon.name}
            icon={icon}
            isSelected={selectedIcon === icon.name}
            onSelect={() => onIconSelect(icon.name)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollContent: {
    paddingRight: 20,
  },
  iconItem: {
    alignItems: 'center',
    marginRight: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    position: 'relative',
    minWidth: 80,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
