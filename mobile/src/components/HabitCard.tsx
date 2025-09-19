import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Habit } from '@/types';

interface HabitCardProps {
  habit: Habit;
  onComplete: () => void;
  onSkip: () => void;
}

export default function HabitCard({ habit, onComplete, onSkip }: HabitCardProps) {
  const { colors } = useThemeContext();

  const getButtonColor = () => {
    // Alternate between orange and blue like in the example
    const colors = ['#F97316', '#3B82F6'];
    return colors[habit.id % 2];
  };

  const getHabitDescription = () => {
    // Create a more descriptive text like in the example
    const descriptions = [
      `W pełni wykorzystuję swoje życie rozpoczynając dzień o godzinie 6 rano.`,
      `W celu utrzymania higieny jamy ustnej oraz zdrowego organizmu myję zęby.`,
      `W celu oczyszczenia organizmu ze szkodliwych substancji piję szklankę zdrowego napoju.`,
      `Przynajmniej 4 razy w tygodniu w celu poprawy samodyscyplimy i poprawy zdrowia oraz zrzucenia nadwagi biegam przez przynajmniej 10 minut.`,
      `W celu poprawy koncentracji wykonuję serce róży przez przynajmniej 5 minut.`,
    ];
    return descriptions[habit.id % descriptions.length] || habit.description;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      {/* Left side - Action button */}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: getButtonColor() }]}
        onPress={onComplete}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Center - Habit description */}
      <View style={styles.descriptionContainer}>
        <Text style={[styles.description, { color: colors.text.primary }]}>
          {getHabitDescription()}
        </Text>
      </View>

      {/* Right side - Skip button */}
      <TouchableOpacity
        style={[styles.skipButton, { backgroundColor: colors.border.primary }]}
        onPress={onSkip}
        activeOpacity={0.8}
      >
        <Ionicons name="remove" size={20} color={colors.text.muted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  descriptionContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  skipButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
