import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useNavigation } from '@/hooks/useNavigation';
import SharedHeader from '@/components/SharedHeader';
import HamburgerMenu from '@/components/HamburgerMenu';

export default function GuildScreen() {
  const { colors, isLoaded } = useThemeContext();
  const { handleNavigate } = useNavigation();
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState(false);

  if (!isLoaded || !colors) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <SharedHeader
          title="Gildie"
          subtitle="Coming soon..."
          onHamburgerPress={() => setIsHamburgerMenuVisible(true)}
        />
        <View style={styles.content}>
          <Text style={[styles.title, { color: '#4C1D95' }]}>Gildie</Text>
          <Text style={[styles.subtitle, { color: '#6B7280' }]}>Coming soon...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <SharedHeader
        title="Gildie"
        subtitle="Dołącz do gildii i walcz razem z przyjaciółmi"
        onHamburgerPress={() => setIsHamburgerMenuVisible(true)}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Gildie</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Coming soon...</Text>
      </View>

      {/* Hamburger Menu */}
      <HamburgerMenu
        isVisible={isHamburgerMenuVisible}
        onClose={() => setIsHamburgerMenuVisible(false)}
        onNavigate={handleNavigate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
