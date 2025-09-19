import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { colors, isLoaded } = useThemeContext();

  // Don't render if theme is not loaded
  if (!isLoaded || !colors) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#7C3AED',
          tabBarInactiveTintColor: '#A78BFA',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#DDD6FE',
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          headerStyle: {
            backgroundColor: '#7C3AED',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Habits',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="checkmark-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pets"
          options={{
            title: 'Pets',
            headerShown: false, // Ukryj header - używamy SharedHeader
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="paw" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="battle"
          options={{
            title: 'Battle',
            headerShown: false, // Ukryj header - używamy SharedHeader
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flash" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="guild"
          options={{
            title: 'Guild',
            headerShown: false, // Ukryj header - używamy SharedHeader
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null, // Ukryj z dolnego paska nawigacji
          }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          backgroundColor: colors.primary[600],
          borderTopWidth: 0,
          paddingBottom: 4,
          paddingTop: 4,
          height: 50,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerStyle: {
          backgroundColor: colors.primary[600],
        },
        headerTintColor: colors.text.inverse,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Habits',
          headerShown: false, // Ukryj header dla głównego ekranu
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Pets',
          headerShown: false, // Ukryj header - używamy SharedHeader
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="battle"
        options={{
          title: 'Battle',
          headerShown: false, // Ukryj header - używamy SharedHeader
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guild"
        options={{
          title: 'Guild',
          headerShown: false, // Ukryj header - używamy SharedHeader
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Ukryj z dolnego paska nawigacji
        }}
      />
    </Tabs>
  );
}
