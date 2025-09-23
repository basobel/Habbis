import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useThemeContext } from '@/contexts/ThemeContext';
import { Colors } from '../src/constants/colors';
import { View, Text, ActivityIndicator } from 'react-native';
import { setGlobalStore } from '@/services/authInterceptor';
import { useEffect } from 'react';

function ThemedStack() {
  const { colors, isDark, isLoaded } = useThemeContext();

  // Don't render until theme is loaded
  if (!isLoaded || !colors) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="achievements" />
      </Stack>
    );
  }

  // Always show all screens - let index.tsx handle navigation logic
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="achievements" />
    </Stack>
  );
}

// Loading component for PersistGate
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F3FF' }}>
      <ActivityIndicator size="large" color="#7C3AED" />
      <Text style={{ marginTop: 16, color: '#4C1D95', fontSize: 16 }}>Loading Habbis...</Text>
    </View>
  );
}

export default function RootLayout() {
  // Initialize auth interceptor with store
  useEffect(() => {
    setGlobalStore(store);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <StatusBar style="auto" />
              <ThemedStack />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
