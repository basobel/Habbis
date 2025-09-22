import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import CircularMenu from '@/components/CircularMenu';
import TopPanel from '@/components/TopPanel';
import ErrorBoundary from '@/components/ErrorBoundary';
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
  const [isTopPanelExpanded, setIsTopPanelExpanded] = useState(false);
  
  // Check if user is authenticated
  const { isAuthenticated } = useSelector((state: RootState) => state.auth || { isAuthenticated: false });
  
  // Don't render TopPanel if user is not authenticated

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

  // Callbacki do wzajemnego zamykania komponentów
  const handleCloseTopPanel = () => {
    setIsTopPanelExpanded(false);
  };

  const handleTopPanelToggle = () => {
    setIsTopPanelExpanded(!isTopPanelExpanded);
  };

  return (
    <ErrorBoundary>
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {isAuthenticated && (
          <TopPanel 
            onNavigate={handleNavigate}
            isExpanded={isTopPanelExpanded}
            onToggle={handleTopPanelToggle}
            onClose={handleCloseTopPanel}
          />
        )}
        
        {/* Overlay dla zamykania TopPanel */}
        {isTopPanelExpanded && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPressIn={handleCloseTopPanel}
          />
        )}
        
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
          <Stack.Screen name="settings" />
          <Stack.Screen name="premium" />
          <Stack.Screen name="statistics" />
          <Stack.Screen name="help" />
          <Stack.Screen name="about" />
        </Stack>
        
        <CircularMenu
          items={menuItems}
          size={50}
          radius={120}
          position="bottom-center"
          onItemPress={(item) => {
            router.push(item.route as any);
          }}
          onClose={handleCloseTopPanel}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
