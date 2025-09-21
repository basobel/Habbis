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
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

function ThemedStack() {
  const { colors, isDark, isLoaded } = useThemeContext();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

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
        <Stack.Screen name="settings" />
        <Stack.Screen name="premium" />
        <Stack.Screen name="statistics" />
        <Stack.Screen name="help" />
        <Stack.Screen name="about" />
      </Stack>
    );
  }

  // If user is authenticated, show main app with circular menu
  if (isAuthenticated) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="achievements" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="premium" />
        <Stack.Screen name="statistics" />
        <Stack.Screen name="help" />
        <Stack.Screen name="about" />
      </Stack>
    );
  }

  // If user is not authenticated, show login/register screens
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
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
