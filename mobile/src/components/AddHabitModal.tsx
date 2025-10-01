 import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { useAppDispatch } from '@/store/hooks';
import { createHabit } from '@/store/slices/habitsSlice';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = React.memo(({ visible, onClose }) => {
  const { colors, isLoaded } = useThemeContext();
  const { t } = useI18n();
  const dispatch = useAppDispatch();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('fitness');
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [isLoading, setIsLoading] = useState(false);

  // Predefined categories - memoized to prevent re-creation
  const categories = React.useMemo(() => [
    { id: 'fitness', name: t('categories.fitness'), icon: 'fitness', color: '#22C55E' },
    { id: 'health', name: t('categories.health'), icon: 'heart', color: '#EF4444' },
    { id: 'mindfulness', name: t('categories.mindfulness'), icon: 'leaf', color: '#10B981' },
    { id: 'learning', name: t('categories.learning'), icon: 'book', color: '#3B82F6' },
    { id: 'productivity', name: t('categories.productivity'), icon: 'briefcase', color: '#8B5CF6' },
    { id: 'social', name: t('categories.social'), icon: 'people', color: '#F59E0B' },
  ], [t]);

  const difficulties = React.useMemo(() => [
    { id: 'easy', name: t('difficulty.easy'), color: '#22C55E' },
    { id: 'medium', name: t('difficulty.medium'), color: '#F59E0B' },
    { id: 'hard', name: t('difficulty.hard'), color: '#EF4444' },
    { id: 'expert', name: t('difficulty.expert'), color: '#8B5CF6' },
  ], [t]);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert(t('forms.alerts.error'), t('forms.alerts.habitNameRequired'));
      return;
    }

    setIsLoading(true);
    
    try {
      const habitData = {
        name: name.trim(),
        description: description.trim() || `Habit: ${name.trim()}`,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        icon: categories.find(c => c.id === selectedCategory)?.icon || 'star',
        color: categories.find(c => c.id === selectedCategory)?.color || '#6B7280',
        is_micro_habit: false,
      };

      await dispatch(createHabit(habitData) as any);
      
      // Reset form
      setName('');
      setDescription('');
      setSelectedCategory('fitness');
      setSelectedDifficulty('easy');
      onClose();
      
      Alert.alert(t('forms.alerts.success'), t('forms.alerts.habitCreatedSuccess'));
    } catch (error) {
      Alert.alert(t('forms.alerts.error'), t('forms.alerts.habitCreateFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedCategory('fitness');
    setSelectedDifficulty('easy');
    onClose();
  };

  if (!isLoaded || !colors) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background.card }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.primary }]}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Add New Habit
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Habit name */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                Habit Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                    borderColor: colors.border.primary,
                  },
                ]}
                value={name}
                onChangeText={setName}
                placeholder={t('forms.placeholders.habitName')}
                placeholderTextColor={colors.text.muted}
                maxLength={50}
              />
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                Description (optional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                    borderColor: colors.border.primary,
                  },
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder={t('forms.placeholders.habitDescription')}
                placeholderTextColor={colors.text.muted}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                Category
              </Text>
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: selectedCategory === category.id 
                          ? category.color 
                          : colors.background.primary,
                        borderColor: selectedCategory === category.id 
                          ? category.color 
                          : colors.border.primary,
                      },
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={20}
                      color={selectedCategory === category.id 
                        ? 'white' 
                        : colors.text.secondary
                      }
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        {
                          color: selectedCategory === category.id 
                            ? 'white' 
                            : colors.text.secondary,
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Difficulty */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                Difficulty
              </Text>
              <View style={styles.difficultiesGrid}>
                {difficulties.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty.id}
                    style={[
                      styles.difficultyButton,
                      {
                        backgroundColor: selectedDifficulty === difficulty.id 
                          ? difficulty.color 
                          : colors.background.primary,
                        borderColor: selectedDifficulty === difficulty.id 
                          ? difficulty.color 
                          : colors.border.primary,
                      },
                    ]}
                    onPress={() => setSelectedDifficulty(difficulty.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        {
                          color: selectedDifficulty === difficulty.id 
                            ? 'white' 
                            : colors.text.secondary,
                        },
                      ]}
                    >
                      {difficulty.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border.primary }]}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border.primary }]}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelText, { color: colors.text.secondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.createButton,
                {
                  backgroundColor: colors.primary[600],
                  opacity: isLoading ? 0.6 : 1,
                },
              ]}
              onPress={handleCreate}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={[styles.createText, { color: colors.text.inverse }]}>
                {isLoading ? t('forms.buttons.creating') : t('forms.buttons.createHabit')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 100,
    justifyContent: 'center',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  difficultiesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddHabitModal;
