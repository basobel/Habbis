import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function AboutScreen() {
  const { colors, isLoaded } = useThemeContext();

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#4C1D95' }]}>O aplikacji</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#6B7280' }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const appInfo = {
    name: 'Habbis',
    version: '1.0.0',
    build: '2024.01.01',
    description: 'Aplikacja do budowania nawyków z elementami grywalizacji',
  };

  const features = [
    {
      icon: 'checkmark-circle-outline',
      title: 'Śledzenie nawyków',
      description: 'Monitoruj swoje codzienne nawyki i postępy',
    },
    {
      icon: 'trophy-outline',
      title: 'System osiągnięć',
      description: 'Odbieraj nagrody za konsekwentne działanie',
    },
    {
      icon: 'people-outline',
      title: 'Gildie i społeczność',
      description: 'Dołącz do gildii i motywuj się z innymi',
    },
    {
      icon: 'stats-chart-outline',
      title: 'Szczegółowe statystyki',
      description: 'Analizuj swoje postępy i trendy',
    },
    {
      icon: 'diamond-outline',
      title: 'Funkcje Premium',
      description: 'Rozszerzone możliwości dla zaawansowanych użytkowników',
    },
  ];

  const links = [
    {
      title: 'Polityka prywatności',
      icon: 'shield-outline',
      url: 'https://habbis.com/privacy',
    },
    {
      title: 'Regulamin',
      icon: 'document-text-outline',
      url: 'https://habbis.com/terms',
    },
    {
      title: 'Strona internetowa',
      icon: 'globe-outline',
      url: 'https://habbis.com',
    },
    {
      title: 'GitHub',
      icon: 'logo-github',
      url: 'https://github.com/habbis',
    },
  ];

  const team = [
    {
      name: 'Zespół Habbis',
      role: 'Twórcy aplikacji',
      description: 'Pasjonaci technologii i rozwoju osobistego',
    },
  ];

  const handleLinkPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>O aplikacji</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={[styles.appInfoCard, { backgroundColor: colors.background.card }]}>
          <View style={[styles.appIcon, { backgroundColor: colors.primary[600] }]}>
            <Ionicons name="checkmark-circle" size={48} color={colors.text.inverse} />
          </View>
          <Text style={[styles.appName, { color: colors.text.primary }]}>
            {appInfo.name}
          </Text>
          <Text style={[styles.appVersion, { color: colors.text.secondary }]}>
            Wersja {appInfo.version}
          </Text>
          <Text style={[styles.appDescription, { color: colors.text.secondary }]}>
            {appInfo.description}
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Funkcje aplikacji
          </Text>
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <View
                key={index}
                style={[styles.featureItem, { backgroundColor: colors.background.card }]}
              >
                <View style={[styles.featureIcon, { backgroundColor: colors.primary[100] }]}>
                  <Ionicons name={feature.icon as any} size={24} color={colors.primary[600]} />
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: colors.text.primary }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: colors.text.secondary }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Zespół
          </Text>
          <View style={[styles.teamCard, { backgroundColor: colors.background.card }]}>
            <View style={[styles.teamAvatar, { backgroundColor: colors.primary[100] }]}>
              <Ionicons name="people" size={32} color={colors.primary[600]} />
            </View>
            <Text style={[styles.teamName, { color: colors.text.primary }]}>
              {team[0].name}
            </Text>
            <Text style={[styles.teamRole, { color: colors.text.secondary }]}>
              {team[0].role}
            </Text>
            <Text style={[styles.teamDescription, { color: colors.text.secondary }]}>
              {team[0].description}
            </Text>
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Przydatne linki
          </Text>
          <View style={styles.linksList}>
            {links.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.linkItem, { backgroundColor: colors.background.card }]}
                onPress={() => handleLinkPress(link.url)}
                activeOpacity={0.7}
              >
                <View style={styles.linkLeft}>
                  <View style={[styles.linkIcon, { backgroundColor: colors.primary[100] }]}>
                    <Ionicons name={link.icon as any} size={20} color={colors.primary[600]} />
                  </View>
                  <Text style={[styles.linkTitle, { color: colors.text.primary }]}>
                    {link.title}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Copyright */}
        <View style={[styles.copyrightCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.copyrightText, { color: colors.text.secondary }]}>
            © 2024 Habbis. Wszystkie prawa zastrzeżone.
          </Text>
          <Text style={[styles.copyrightText, { color: colors.text.secondary }]}>
            Zbudowane z ❤️ dla lepszych nawyków.
          </Text>
        </View>
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
  appInfoCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
  teamCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  teamAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 14,
    marginBottom: 8,
  },
  teamDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  linksList: {
    gap: 12,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  copyrightCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  copyrightText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});
