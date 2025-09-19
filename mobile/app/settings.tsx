import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsScreen() {
  const { colors, isLoaded } = useThemeContext();
  const { themeMode, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [hapticEnabled, setHapticEnabled] = React.useState(true);

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#4C1D95' }]}>Ustawienia</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#6B7280' }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const settingsSections = [
    {
      title: 'Wygląd',
      items: [
        {
          id: 'theme',
          title: 'Motyw',
          subtitle: themeMode === 'system' ? 'Systemowy' : themeMode === 'dark' ? 'Ciemny' : 'Jasny',
          icon: 'color-palette-outline',
          onPress: () => {
            const newTheme = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
            setTheme(newTheme);
          },
        },
      ],
    },
    {
      title: 'Powiadomienia',
      items: [
        {
          id: 'notifications',
          title: 'Powiadomienia',
          subtitle: 'Otrzymuj przypomnienia o nawykach',
          icon: 'notifications-outline',
          type: 'switch',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'sound',
          title: 'Dźwięk',
          subtitle: 'Odtwarzaj dźwięki powiadomień',
          icon: 'volume-high-outline',
          type: 'switch',
          value: soundEnabled,
          onToggle: setSoundEnabled,
        },
        {
          id: 'haptic',
          title: 'Wibracje',
          subtitle: 'Wibracje przy powiadomieniach',
          icon: 'phone-portrait-outline',
          type: 'switch',
          value: hapticEnabled,
          onToggle: setHapticEnabled,
        },
      ],
    },
    {
      title: 'Konto',
      items: [
        {
          id: 'profile',
          title: 'Edytuj profil',
          subtitle: 'Zmień dane osobowe',
          icon: 'person-outline',
          onPress: () => console.log('Edit profile'),
        },
        {
          id: 'privacy',
          title: 'Prywatność',
          subtitle: 'Ustawienia prywatności',
          icon: 'shield-outline',
          onPress: () => console.log('Privacy settings'),
        },
        {
          id: 'security',
          title: 'Bezpieczeństwo',
          subtitle: 'Hasło i uwierzytelnianie',
          icon: 'lock-closed-outline',
          onPress: () => console.log('Security settings'),
        },
      ],
    },
    {
      title: 'Aplikacja',
      items: [
        {
          id: 'about',
          title: 'O aplikacji',
          subtitle: 'Wersja 1.0.0',
          icon: 'information-circle-outline',
          onPress: () => console.log('About app'),
        },
        {
          id: 'help',
          title: 'Pomoc i wsparcie',
          subtitle: 'FAQ i kontakt',
          icon: 'help-circle-outline',
          onPress: () => console.log('Help'),
        },
        {
          id: 'feedback',
          title: 'Wyślij opinię',
          subtitle: 'Pomóż nam ulepszyć aplikację',
          icon: 'chatbubble-outline',
          onPress: () => console.log('Send feedback'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Ustawienia</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionContent, { backgroundColor: colors.background.card }]}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    { borderBottomColor: colors.border.primary },
                    itemIndex === section.items.length - 1 && styles.lastItem,
                  ]}
                  onPress={item.onPress}
                  disabled={item.type === 'switch'}
                >
                  <View style={styles.settingItemLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: colors.primary[100] }]}>
                      <Ionicons name={item.icon as any} size={20} color={colors.primary[600]} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                        {item.title}
                      </Text>
                      {item.subtitle && (
                        <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.settingItemRight}>
                    {item.type === 'switch' ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: colors.border.primary, true: colors.primary[300] }}
                        thumbColor={item.value ? colors.primary[600] : colors.text.muted}
                      />
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  settingItemRight: {
    marginLeft: 12,
  },
});
