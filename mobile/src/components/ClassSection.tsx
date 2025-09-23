import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

interface ClassSectionProps {
  userClass?: string;
  userLevel: number;
  onClassChange?: () => void;
}

const CLASSES = {
  warrior: {
    name: 'Wojownik',
    description: 'Specjalista od siły i wytrwałości',
    icon: 'shield' as const,
    color: '#EF4444',
    stats: { strength: 15, endurance: 12, intelligence: 8, agility: 10 }
  },
  mage: {
    name: 'Mag',
    description: 'Mistrz mocy i inteligencji',
    icon: 'flash' as const,
    color: '#8B5CF6',
    stats: { strength: 8, endurance: 10, intelligence: 18, agility: 9 }
  },
  rogue: {
    name: 'Łotr',
    description: 'Zwinny i szybki',
    icon: 'eye' as const,
    color: '#10B981',
    stats: { strength: 10, endurance: 9, intelligence: 12, agility: 16 }
  },
  paladin: {
    name: 'Paladyn',
    description: 'Zbalansowany obrońca',
    icon: 'star' as const,
    color: '#F59E0B',
    stats: { strength: 12, endurance: 14, intelligence: 11, agility: 8 }
  }
};

export default function ClassSection({ userClass = 'warrior', userLevel, onClassChange }: ClassSectionProps) {
  const { colors, isLoaded } = useThemeContext();

  if (!isLoaded || !colors) {
    return null;
  }

  const currentClass = CLASSES[userClass as keyof typeof CLASSES] || CLASSES.warrior;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Klasa i Profesja
        </Text>
        <TouchableOpacity
          style={[styles.changeButton, { backgroundColor: colors.primary[100] }]}
          onPress={onClassChange}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-horizontal" size={16} color={colors.primary[600]} />
          <Text style={[styles.changeButtonText, { color: colors.primary[600] }]}>
            Zmień
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.classInfo}>
        <View style={[styles.classIcon, { backgroundColor: currentClass.color }]}>
          <Ionicons name={currentClass.icon} size={32} color="white" />
        </View>
        
        <View style={styles.classDetails}>
          <Text style={[styles.className, { color: colors.text.primary }]}>
            {currentClass.name}
          </Text>
          <Text style={[styles.classDescription, { color: colors.text.secondary }]}>
            {currentClass.description}
          </Text>
          <Text style={[styles.classLevel, { color: colors.primary[600] }]}>
            Poziom {userLevel}
          </Text>
        </View>
      </View>

      {/* Atrybuty klasy */}
      <View style={styles.statsContainer}>
        <Text style={[styles.statsTitle, { color: colors.text.primary }]}>
          Atrybuty klasy
        </Text>
        
        <View style={styles.statsGrid}>
          {Object.entries(currentClass.stats).map(([stat, value]) => (
            <View key={stat} style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                {stat === 'strength' ? 'Siła' :
                 stat === 'endurance' ? 'Wytrwałość' :
                 stat === 'intelligence' ? 'Inteligencja' :
                 stat === 'agility' ? 'Zwinność' : stat}
              </Text>
              <View style={[styles.statBar, { backgroundColor: colors.background.secondary }]}>
                <View
                  style={[
                    styles.statFill,
                    {
                      backgroundColor: currentClass.color,
                      width: `${(value / 20) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bonusy za poziom */}
      <View style={styles.bonusContainer}>
        <Text style={[styles.bonusTitle, { color: colors.text.primary }]}>
          Bonusy za poziom {userLevel}
        </Text>
        <View style={styles.bonusList}>
          <View style={styles.bonusItem}>
            <Ionicons name="add-circle" size={16} color={colors.primary[600]} />
            <Text style={[styles.bonusText, { color: colors.text.secondary }]}>
              +{Math.floor(userLevel / 5)} do wszystkich atrybutów
            </Text>
          </View>
          <View style={styles.bonusItem}>
            <Ionicons name="diamond" size={16} color={colors.primary[600]} />
            <Text style={[styles.bonusText, { color: colors.text.secondary }]}>
              +{userLevel * 10}% do doświadczenia
            </Text>
          </View>
          <View style={styles.bonusItem}>
            <Ionicons name="shield" size={16} color={colors.primary[600]} />
            <Text style={[styles.bonusText, { color: colors.text.secondary }]}>
              +{Math.floor(userLevel / 10)} do obrony
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  changeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  classInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  classIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  classDetails: {
    flex: 1,
  },
  className: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  classDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  classLevel: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    width: 80,
  },
  statBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 24,
    textAlign: 'right',
  },
  bonusContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 16,
  },
  bonusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bonusList: {
    gap: 8,
  },
  bonusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bonusText: {
    fontSize: 14,
    flex: 1,
  },
});
