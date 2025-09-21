import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import CircularMenu from '@/components/CircularMenu';
import TopPanel from '@/components/TopPanel';
import DropdownMenu from '@/components/DropdownMenu';
import { useRouter } from 'expo-router';

const menuItems = [
  {
    id: 'habits',
    title: 'Nawyki',
    icon: 'checkmark-circle' as const,
    route: '/(tabs)/',
    color: '#7C3AED',
  },
  {
    id: 'pets',
    title: 'Zwierzęta',
    icon: 'paw' as const,
    route: '/(tabs)/pets',
    color: '#F59E0B',
  },
  {
    id: 'battle',
    title: 'Bitwy',
    icon: 'flash' as const,
    route: '/(tabs)/battle',
    color: '#EF4444',
  },
  {
    id: 'guild',
    title: 'Gildia',
    icon: 'people' as const,
    route: '/(tabs)/guild',
    color: '#10B981',
  },
];

export default function TabLayout() {
  const { colors, isLoaded } = useThemeContext();
  const router = useRouter();
  const [isDropdownMenuVisible, setIsDropdownMenuVisible] = useState(false);

  // Don't render if theme is not loaded
  if (!isLoaded || !colors) {
    return (
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="pets" />
          <Stack.Screen name="battle" />
          <Stack.Screen name="guild" />
          <Stack.Screen name="profile" />
        </Stack>
      </View>
    );
  }

  const handleNavigate = (screen: string) => {
    router.push(screen as any);
  };

  const dropdownItems = [
    {
      id: 'settings',
      title: 'Ustawienia',
      icon: 'settings' as const,
      color: '#6B7280',
      onPress: () => handleNavigate('/settings'),
    },
    {
      id: 'profile',
      title: 'Profil',
      icon: 'person' as const,
      color: '#8B5CF6',
      onPress: () => handleNavigate('/(tabs)/profile'),
    },
    {
      id: 'premium',
      title: 'Premium',
      icon: 'diamond' as const,
      color: '#F59E0B',
      onPress: () => handleNavigate('/premium'),
    },
    {
      id: 'statistics',
      title: 'Statystyki',
      icon: 'bar-chart' as const,
      color: '#10B981',
      onPress: () => handleNavigate('/statistics'),
    },
    {
      id: 'help',
      title: 'Pomoc',
      icon: 'help-circle' as const,
      color: '#3B82F6',
      onPress: () => handleNavigate('/help'),
    },
    {
      id: 'about',
      title: 'O aplikacji',
      icon: 'information-circle' as const,
      color: '#8B5CF6',
      onPress: () => handleNavigate('/about'),
    },
    {
      id: 'logout',
      title: 'Wyloguj',
      icon: 'log-out' as const,
      color: '#EF4444',
      onPress: () => {
        // TODO: Implement logout
        console.log('Logout');
        handleNavigate('/login');
      },
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <TopPanel 
        onNavigate={handleNavigate} 
        onHamburgerPress={() => setIsDropdownMenuVisible(true)}
      />
      
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="pets" />
        <Stack.Screen name="battle" />
        <Stack.Screen name="guild" />
        <Stack.Screen name="profile" />
      </Stack>
      
      <CircularMenu
        items={menuItems}
        size={50}
        radius={120}
        position="bottom-center"
        onItemPress={(item) => {
          router.push(item.route as any);
        }}
      />

      <DropdownMenu
        items={dropdownItems}
        isVisible={isDropdownMenuVisible}
        onClose={() => setIsDropdownMenuVisible(false)}
        position="top-right"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
