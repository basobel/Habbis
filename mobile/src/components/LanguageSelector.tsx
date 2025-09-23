import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';

interface LanguageSelectorProps {
  onClose?: () => void;
}

export default function LanguageSelector({ onClose }: LanguageSelectorProps) {
  const { colors } = useThemeContext();
  const { currentLanguage, changeLanguage, t } = useI18n();

  const languages = [
    { code: 'en', name: t('languages.en'), flag: '🇺🇸' },
    { code: 'pl', name: t('languages.pl'), flag: '🇵🇱' },
  ];

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      onClose?.();
    } catch (error) {
      console.log('Error changing language:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {t('settings.language')}
        </Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.languageList}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageItem,
              {
                backgroundColor: currentLanguage === language.code 
                  ? colors.primary[50] 
                  : 'transparent',
                borderColor: currentLanguage === language.code 
                  ? colors.primary[500] 
                  : colors.border.primary,
              }
            ]}
            onPress={() => handleLanguageChange(language.code)}
            activeOpacity={0.7}
          >
            <View style={styles.languageInfo}>
              <Text style={styles.flag}>{language.flag}</Text>
              <Text style={[styles.languageName, { color: colors.text.primary }]}>
                {language.name}
              </Text>
            </View>
            
            {currentLanguage === language.code && (
              <Ionicons name="checkmark" size={20} color={colors.primary[600]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    gap: 8,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 24,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
});
