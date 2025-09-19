import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

interface CreateGuildModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateGuild: (guildData: any) => void;
}

interface GuildFormData {
  name: string;
  description: string;
  isPrivate: boolean;
  maxMembers: number;
  requirements: {
    minLevel: number;
    minPower: number;
  };
  tags: string[];
}

export default function CreateGuildModal({ visible, onClose, onCreateGuild }: CreateGuildModalProps) {
  const { colors } = useThemeContext();
  const [formData, setFormData] = useState<GuildFormData>({
    name: '',
    description: '',
    isPrivate: false,
    maxMembers: 30,
    requirements: {
      minLevel: 1,
      minPower: 0,
    },
    tags: [],
  });
  const [newTag, setNewTag] = useState('');

  const handleCreateGuild = () => {
    if (!formData.name.trim()) {
      Alert.alert('Błąd', 'Nazwa gildii jest wymagana');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Błąd', 'Opis gildii jest wymagany');
      return;
    }
    if (formData.tags.length === 0) {
      Alert.alert('Błąd', 'Dodaj przynajmniej jeden tag');
      return;
    }

    onCreateGuild(formData);
    setFormData({
      name: '',
      description: '',
      isPrivate: false,
      maxMembers: 30,
      requirements: {
        minLevel: 1,
        minPower: 0,
      },
      tags: [],
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const availableTags = [
    'PvE', 'PvP', 'Elite', 'Casual', 'Magic', 'Warrior', 'Rogue', 'Mage',
    'Dragon', 'Ancient', 'Stealth', 'Research', 'Trading', 'Exploration'
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors?.background?.primary || '#F5F3FF' }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors?.background?.card || '#FFFFFF' }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors?.text?.primary || '#4C1D95'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors?.text?.primary || '#4C1D95' }]}>
            Stwórz Gildię
          </Text>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors?.primary?.[600] || '#6D28D9' }]}
            onPress={handleCreateGuild}
          >
            <Text style={[styles.createButtonText, { color: colors?.text?.inverse || '#FFFFFF' }]}>
              Stwórz
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={[styles.section, { backgroundColor: colors?.background?.card || '#FFFFFF' }]}>
            <Text style={[styles.sectionTitle, { color: colors?.text?.primary || '#4C1D95' }]}>
              Podstawowe informacje
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors?.text?.primary || '#4C1D95' }]}>
                Nazwa gildii *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors?.background?.primary || '#F5F3FF',
                    borderColor: colors?.border?.primary || '#C4B5FD',
                    color: colors?.text?.primary || '#4C1D95',
                  }
                ]}
                placeholder="Wprowadź nazwę gildii"
                placeholderTextColor={colors?.text?.secondary || '#6B7280'}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                maxLength={30}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors?.text?.primary || '#4C1D95' }]}>
                Opis gildii *
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors?.background?.primary || '#F5F3FF',
                    borderColor: colors?.border?.primary || '#C4B5FD',
                    color: colors?.text?.primary || '#4C1D95',
                  }
                ]}
                placeholder="Opisz cel i charakter gildii"
                placeholderTextColor={colors?.text?.secondary || '#6B7280'}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
                maxLength={200}
              />
            </View>

            <View style={styles.switchGroup}>
              <View style={styles.switchLabel}>
                <Text style={[styles.inputLabel, { color: colors?.text?.primary || '#4C1D95' }]}>
                  Gildia prywatna
                </Text>
                <Text style={[styles.switchDescription, { color: colors?.text?.secondary || '#6B7280' }]}>
                  Tylko zaproszenia, brak publicznych aplikacji
                </Text>
              </View>
              <Switch
                value={formData.isPrivate}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isPrivate: value }))}
                trackColor={{ false: colors?.secondary?.[300] || '#CBD5E1', true: colors?.primary?.[300] || '#A78BFA' }}
                thumbColor={formData.isPrivate ? colors?.primary?.[600] || '#6D28D9' : colors?.secondary?.[500] || '#64748B'}
              />
            </View>
          </View>

          {/* Settings */}
          <View style={[styles.section, { backgroundColor: colors?.background?.card || '#FFFFFF' }]}>
            <Text style={[styles.sectionTitle, { color: colors?.text?.primary || '#4C1D95' }]}>
              Ustawienia
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors?.text?.primary || '#4C1D95' }]}>
                Maksymalna liczba członków
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors?.background?.primary || '#F5F3FF',
                    borderColor: colors?.border?.primary || '#C4B5FD',
                    color: colors?.text?.primary || '#4C1D95',
                  }
                ]}
                placeholder="30"
                placeholderTextColor={colors?.text?.secondary || '#6B7280'}
                value={formData.maxMembers.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 30;
                  setFormData(prev => ({ ...prev, maxMembers: Math.min(100, Math.max(5, num)) }));
                }}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors?.text?.primary || '#4C1D95' }]}>
                Minimalny poziom gracza
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors?.background?.primary || '#F5F3FF',
                    borderColor: colors?.border?.primary || '#C4B5FD',
                    color: colors?.text?.primary || '#4C1D95',
                  }
                ]}
                placeholder="1"
                placeholderTextColor={colors?.text?.secondary || '#6B7280'}
                value={formData.requirements.minLevel.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 1;
                  setFormData(prev => ({
                    ...prev,
                    requirements: { ...prev.requirements, minLevel: Math.max(1, num) }
                  }));
                }}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors?.text?.primary || '#4C1D95' }]}>
                Minimalna siła gracza
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors?.background?.primary || '#F5F3FF',
                    borderColor: colors?.border?.primary || '#C4B5FD',
                    color: colors?.text?.primary || '#4C1D95',
                  }
                ]}
                placeholder="0"
                placeholderTextColor={colors?.text?.secondary || '#6B7280'}
                value={formData.requirements.minPower.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setFormData(prev => ({
                    ...prev,
                    requirements: { ...prev.requirements, minPower: Math.max(0, num) }
                  }));
                }}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Tags */}
          <View style={[styles.section, { backgroundColor: colors?.background?.card || '#FFFFFF' }]}>
            <Text style={[styles.sectionTitle, { color: colors?.text?.primary || '#4C1D95' }]}>
              Tagi gildii *
            </Text>

            <View style={styles.tagInputContainer}>
              <TextInput
                style={[
                  styles.tagInput,
                  {
                    backgroundColor: colors?.background?.primary || '#F5F3FF',
                    borderColor: colors?.border?.primary || '#C4B5FD',
                    color: colors?.text?.primary || '#4C1D95',
                  }
                ]}
                placeholder="Dodaj tag..."
                placeholderTextColor={colors?.text?.secondary || '#6B7280'}
                value={newTag}
                onChangeText={setNewTag}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity
                style={[styles.addTagButton, { backgroundColor: colors?.primary?.[600] || '#6D28D9' }]}
                onPress={addTag}
              >
                <Ionicons name="add" size={20} color={colors?.text?.inverse || '#FFFFFF'} />
              </TouchableOpacity>
            </View>

            <View style={styles.tagsContainer}>
              {formData.tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.tag, { backgroundColor: colors?.primary?.[100] || '#EDE9FE' }]}
                  onPress={() => removeTag(tag)}
                >
                  <Text style={[styles.tagText, { color: colors?.primary?.[600] || '#6D28D9' }]}>
                    {tag}
                  </Text>
                  <Ionicons name="close" size={16} color={colors?.primary?.[600] || '#6D28D9'} />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.availableTagsLabel, { color: colors?.text?.secondary || '#6B7280' }]}>
              Dostępne tagi:
            </Text>
            <View style={styles.availableTagsContainer}>
              {availableTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.availableTag,
                    {
                      backgroundColor: formData.tags.includes(tag)
                        ? colors?.primary?.[100] || '#EDE9FE'
                        : colors?.secondary?.[100] || '#F1F5F9',
                      borderColor: formData.tags.includes(tag)
                        ? colors?.primary?.[600] || '#6D28D9'
                        : colors?.border?.primary || '#C4B5FD',
                    }
                  ]}
                  onPress={() => {
                    if (formData.tags.includes(tag)) {
                      removeTag(tag);
                    } else if (formData.tags.length < 5) {
                      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                    }
                  }}
                  disabled={!formData.tags.includes(tag) && formData.tags.length >= 5}
                >
                  <Text
                    style={[
                      styles.availableTagText,
                      {
                        color: formData.tags.includes(tag)
                          ? colors?.primary?.[600] || '#6D28D9'
                          : colors?.text?.secondary || '#6B7280',
                      }
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  switchDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addTagButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableTagsLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  availableTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  availableTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  availableTagText: {
    fontSize: 11,
    fontWeight: '500',
  },
});