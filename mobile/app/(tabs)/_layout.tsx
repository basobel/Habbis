import React from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import CircularMenu from '@/components/CircularMenu';
import TopPanel from '@/components/TopPanel';
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
  {
    id: 'profile',
    title: 'Profil',
    icon: 'person' as const,
    route: '/(tabs)/profile',
    color: '#8B5CF6',
  },
];

export default function TabLayout() {
  const { colors, isLoaded } = useThemeContext();
  const router = useRouter();

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <TopPanel onNavigate={handleNavigate} />
      
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
