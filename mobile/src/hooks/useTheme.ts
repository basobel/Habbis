import { useState, useEffect, useMemo } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    card: string;
    surface: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    placeholder: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
    error: string;
    subtle: string;
  };
  input?: {
    background: string;
    border: string;
    text: string;
    placeholder: string;
  };
  primary: {
    500: string;
    600: string;
    700: string;
  };
  secondary: {
    400: string;
    500: string;
    600: string;
  };
  error: {
    500: string;
    600: string;
    700: string;
  };
  accent: {
    gold: string;
    silver: string;
    bronze: string;
  };
}

const THEME_STORAGE_KEY = '@habbis_theme_mode';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
          setThemeMode(storedTheme as ThemeMode);
        }
      } catch (e) {
        console.error("Failed to load theme from storage", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (theme: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      setThemeMode(theme);
    } catch (e) {
      console.error("Failed to save theme to storage", e);
    }
  };

  const actualTheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  const colors = useMemo((): ThemeColors | null => {
    if (!isLoaded) {
      return null;
    }

    if (actualTheme === 'dark') {
      return {
        background: Colors.dark.background,
        text: Colors.dark.text,
        border: Colors.dark.border,
        input: Colors.dark.input,
        primary: Colors.primary,
        secondary: Colors.secondary,
        error: Colors.error,
        accent: Colors.accent,
      };
    }

    return {
      background: Colors.background,
      text: Colors.text,
      border: Colors.border,
      input: {
        background: '#FFFFFF',
        border: Colors.border.primary,
        text: Colors.text.primary,
        placeholder: Colors.text.placeholder,
      },
      primary: Colors.primary,
      secondary: Colors.secondary,
      error: Colors.error,
      accent: Colors.accent,
    };
  }, [actualTheme, isLoaded]);

  // Get all colors (including primary, secondary, etc.)
  const allColors = useMemo(() => {
    if (!colors) {
      return Colors;
    }
    return {
      ...Colors,
      ...colors,
    };
  }, [colors]);

  return {
    themeMode,
    actualTheme,
    colors,
    allColors,
    isLoaded,
    setTheme,
    isDark: actualTheme === 'dark',
    isLight: actualTheme === 'light',
  };
};
