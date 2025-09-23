import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { RootState } from '@/types';
import { updateUserProfile } from '@/store/slices/userSlice';
import FadeInView from '@/components/FadeInView';
import AvatarIconSelector from '@/components/AvatarIconSelector';

export default function EditProfileScreen() {
  const dispatch = useDispatch();
  const { colors, isLoaded } = useThemeContext();
  
  // Separate selectors to prevent unnecessary rerenders
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.user?.loading || false);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    avatar_icon: user?.avatar_icon || 'person',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        avatar_icon: user.avatar_icon || 'person',
      });
    }
  }, [user]);


  const saveProfile = React.useCallback(async (updates: any) => {
    if (updates.username && updates.username.length < 3) return;
    
    setIsSaving(true);
    try {
      await dispatch(updateUserProfile(updates) as any);
    } catch (error: any) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  }, [dispatch]);

  const handleInputChange = React.useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Auto-save dla nazwy użytkownika i ikonki awatara
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const updates: any = {};
      
      if (formData.username.trim() && formData.username !== user?.username) {
        updates.username = formData.username.trim();
      }
      
      if (formData.avatar_icon && formData.avatar_icon !== user?.avatar_icon) {
        updates.avatar_icon = formData.avatar_icon;
      }
      
      if (Object.keys(updates).length > 0) {
        saveProfile(updates);
      }
    }, 500); // Zmniejszono timeout do 500ms dla lepszej wydajności

    return () => clearTimeout(timeoutId);
  }, [formData.username, formData.avatar_icon, user?.username, user?.avatar_icon, saveProfile]);


  const handleIconSelect = React.useCallback((icon: string) => {
    setFormData(prev => ({
      ...prev,
      avatar_icon: icon,
    }));
  }, []);

  const handleBack = React.useCallback(() => {
    router.back();
  }, [router]);

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#4C1D95' }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>
            Brak danych użytkownika
          </Text>
        </View>
      </View>
    );
  }

  return (
    <FadeInView duration={400}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background.primary }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background.card }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Edytuj profil
          </Text>
          <View style={styles.headerRight}>
            {isSaving && (
              <View style={styles.savingIndicator}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary[600]} />
                <Text style={[styles.savingText, { color: colors.primary[600] }]}>
                  Zapisano
                </Text>
              </View>
            )}
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Data Section */}
          <View style={[styles.section, { backgroundColor: colors.background.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Dane profilu
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>
                Nazwa użytkownika
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.background.secondary,
                  color: colors.text.primary,
                  borderColor: colors.border.primary,
                }]}
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                placeholder="Wprowadź nazwę użytkownika"
                placeholderTextColor={colors.text.tertiary}
                maxLength={50}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

          </View>

          {/* Avatar Icon Section */}
          <View style={[styles.section, { backgroundColor: colors.background.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Ikonka awatara
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.text.secondary }]}>
              Wybierz ikonkę, która będzie wyświetlana jako Twój awatar w aplikacji
            </Text>
            <AvatarIconSelector
              selectedIcon={formData.avatar_icon}
              onIconSelect={handleIconSelect}
            />
          </View>

          {/* Info Section */}
          <View style={[styles.infoSection, { backgroundColor: colors.background.secondary }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary[600]} />
            <Text style={[styles.infoText, { color: colors.text.secondary }]}>
              Zmiany są zapisywane automatycznie.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FadeInView>
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
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingTop: 60, // Dodaj padding-top żeby nie nakładało się z TopPanel
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  savingText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
});
