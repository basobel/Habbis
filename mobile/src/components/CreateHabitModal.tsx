import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import Modal from './Modal';
import FormInput from './FormInput';
import FormButton from './FormButton';
import { HabitDifficulty } from '@/types';

interface CreateHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateHabit: (habitData: CreateHabitData) => void;
}

interface CreateHabitData {
  name: string;
  description?: string;
  difficulty: HabitDifficulty;
  target_frequency: number;
  target_days: number[];
  color: string;
  icon: string;
  reminder_times?: string[];
}

const DIFFICULTY_OPTIONS: { value: HabitDifficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Łatwy', color: '#22C55E' },
  { value: 'medium', label: 'Średni', color: '#F59E0B' },
  { value: 'hard', label: 'Trudny', color: '#EF4444' },
  { value: 'expert', label: 'Ekspert', color: '#8B5CF6' },
];

const COLOR_OPTIONS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const ICON_OPTIONS = [
  'fitness', 'briefcase', 'person', 'book', 'star',
  'heart', 'time', 'checkmark', 'water', 'sunny'
];

const DAYS_OF_WEEK = [
  { value: 1, label: 'Pon' },
  { value: 2, label: 'Wt' },
  { value: 3, label: 'Śr' },
  { value: 4, label: 'Czw' },
  { value: 5, label: 'Pt' },
  { value: 6, label: 'Sob' },
  { value: 7, label: 'Nd' },
];

export default function CreateHabitModal({ visible, onClose, onCreateHabit }: CreateHabitModalProps) {
  const { colors } = useThemeContext();
  const { t } = useI18n();
  
  const [formData, setFormData] = useState<CreateHabitData>({
    name: '',
    description: '',
    difficulty: 'easy',
    target_frequency: 1,
    target_days: [1, 2, 3, 4, 5, 6, 7], // All days by default
    color: '#3B82F6',
    icon: 'star',
    reminder_times: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nazwa nawyku jest wymagana';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nazwa musi mieć co najmniej 2 znaki';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Nazwa nie może mieć więcej niż 50 znaków';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Opis nie może mieć więcej niż 200 znaków';
    }

    if (formData.target_frequency < 1 || formData.target_frequency > 10) {
      newErrors.target_frequency = 'Częstotliwość musi być między 1 a 10';
    }

    if (formData.target_days.length === 0) {
      newErrors.target_days = 'Wybierz co najmniej jeden dzień tygodnia';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreateHabit(formData);
      setFormData({
        name: '',
        description: '',
        difficulty: 'easy',
        target_frequency: 1,
        target_days: [1, 2, 3, 4, 5, 6, 7],
        color: '#3B82F6',
        icon: 'star',
        reminder_times: [],
      });
      setErrors({});
      onClose();
    }
  };

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      target_days: prev.target_days.includes(day)
        ? prev.target_days.filter(d => d !== day)
        : [...prev.target_days, day].sort()
    }));
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    closeButton: {
      padding: 8,
    },
    content: {
      paddingTop: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text.primary,
      backgroundColor: colors.background.card,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    difficultyContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    difficultyOption: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    difficultyOptionSelected: {
      borderColor: colors.primary[500],
      backgroundColor: `${colors.primary[500]}20`,
    },
    difficultyText: {
      fontSize: 14,
      fontWeight: '500',
    },
    frequencyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    frequencyButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    frequencyButtonActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    frequencyText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    frequencyLabel: {
      fontSize: 16,
      color: colors.text.secondary,
    },
    daysContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    dayButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border.primary,
      minWidth: 40,
      alignItems: 'center',
    },
    dayButtonSelected: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    dayText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.text.primary,
    },
    dayTextSelected: {
      color: colors.text.inverse,
    },
    colorsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    colorOptionSelected: {
      borderColor: colors.text.primary,
    },
    iconsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    iconOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconOptionSelected: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
  });

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Nowy Nawyk</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nazwa nawyku */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nazwa nawyku *</Text>
            <TextInput
              style={[styles.input, errors.name && { borderColor: colors.error }]}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="np. Piję wodę, Ćwiczę, Czytam książkę"
              placeholderTextColor={colors.text.placeholder}
              maxLength={50}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Opis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opis (opcjonalny)</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && { borderColor: colors.error }]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Krótki opis nawyku..."
              placeholderTextColor={colors.text.placeholder}
              multiline
              maxLength={200}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          {/* Trudność */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trudność</Text>
            <View style={styles.difficultyContainer}>
              {DIFFICULTY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.difficultyOption,
                    formData.difficulty === option.value && styles.difficultyOptionSelected,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, difficulty: option.value }))}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: formData.difficulty === option.value ? option.color : colors.text.primary }
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Częstotliwość */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Częstotliwość dziennie</Text>
            <View style={styles.frequencyContainer}>
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  formData.target_frequency > 1 && styles.frequencyButtonActive,
                ]}
                onPress={() => setFormData(prev => ({ 
                  ...prev, 
                  target_frequency: Math.max(1, prev.target_frequency - 1) 
                }))}
              >
                <Ionicons 
                  name="remove" 
                  size={20} 
                  color={formData.target_frequency > 1 ? colors.text.inverse : colors.text.primary} 
                />
              </TouchableOpacity>
              
              <Text style={styles.frequencyText}>{formData.target_frequency}</Text>
              
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  formData.target_frequency < 10 && styles.frequencyButtonActive,
                ]}
                onPress={() => setFormData(prev => ({ 
                  ...prev, 
                  target_frequency: Math.min(10, prev.target_frequency + 1) 
                }))}
              >
                <Ionicons 
                  name="add" 
                  size={20} 
                  color={formData.target_frequency < 10 ? colors.text.inverse : colors.text.primary} 
                />
              </TouchableOpacity>
              
              <Text style={styles.frequencyLabel}>razy dziennie</Text>
            </View>
          </View>

          {/* Dni tygodnia */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dni tygodnia *</Text>
            <View style={styles.daysContainer}>
              {DAYS_OF_WEEK.map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayButton,
                    formData.target_days.includes(day.value) && styles.dayButtonSelected,
                  ]}
                  onPress={() => toggleDay(day.value)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      formData.target_days.includes(day.value) && styles.dayTextSelected,
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.target_days && <Text style={styles.errorText}>{errors.target_days}</Text>}
          </View>

          {/* Kolor */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kolor</Text>
            <View style={styles.colorsContainer}>
              {COLOR_OPTIONS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    formData.color === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </View>
          </View>

          {/* Ikona */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ikona</Text>
            <View style={styles.iconsContainer}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    formData.icon === icon && styles.iconOptionSelected,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, icon }))}
                >
                  <Ionicons
                    name={icon as any}
                    size={20}
                    color={formData.icon === icon ? colors.text.inverse : colors.text.primary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <FormButton
            title="Anuluj"
            onPress={onClose}
            variant="secondary"
            style={{ flex: 1 }}
          />
          <FormButton
            title="Utwórz Nawyk"
            onPress={handleSubmit}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Modal>
  );
}
