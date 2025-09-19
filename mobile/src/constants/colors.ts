/**
 * Centralna paleta kolorów aplikacji Habbis
 * Zgodna z zasadami DRY i modularności
 */

export const Colors = {
  // Kolory podstawowe - paleta fioletowa (przyciemniona)
  primary: {
    50: '#F5F3FF',   // Bardzo jasny fiolet
    100: '#EDE9FE',  // Jasny fiolet
    200: '#DDD6FE',  // Średnio jasny fiolet
    300: '#C4B5FD',  // Średni fiolet
    400: '#A78BFA',  // Średnio ciemny fiolet
    500: '#7C3AED',  // Główny fiolet (zoptymalizowany)
    600: '#6D28D9',  // Ciemny fiolet
    700: '#5B21B6',  // Bardzo ciemny fiolet
    800: '#4C1D95',  // Najciemniejszy fiolet
    900: '#3B1A7A',  // Ultra ciemny fiolet
  },

  // Kolory pomocnicze
  secondary: {
    50: '#F8FAFC',   // Bardzo jasny szary
    100: '#F1F5F9',  // Jasny szary
    200: '#E2E8F0',  // Średnio jasny szary
    300: '#CBD5E1',  // Średni szary
    400: '#94A3B8',  // Średnio ciemny szary
    500: '#64748B',  // Ciemny szary
    600: '#475569',  // Bardzo ciemny szary
    700: '#334155',  // Najciemniejszy szary
    800: '#1E293B',  // Ultra ciemny szary
    900: '#0F172A',  // Czarny szary
  },

  // Kolory stanów
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },

  warning: {
    50: '#FEF3C7',
    100: '#FDE68A',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  // Kolory akcentowe
  accent: {
    gold: '#F59E0B',      // Złoty dla Premium
    silver: '#94A3B8',    // Srebrny
    bronze: '#CD7F32',    // Brązowy
  },

  // Kolory tła (zoptymalizowane dla spójności)
  background: {
    primary: '#F5F3FF',    // Bardzo jasny fiolet
    secondary: '#F8FAFC',  // Bardzo jasny szary
    card: '#FFFFFF',       // Biały
    surface: '#FFFFFF',    // Powierzchnia
    overlay: 'rgba(124, 58, 237, 0.1)', // Overlay w kolorze fioletu
  },

  // Kolory tekstu (zoptymalizowane dla spójności)
  text: {
    primary: '#4C1D95',    // Ultra ciemny fiolet
    secondary: '#6D28D9',  // Ciemny fiolet (zoptymalizowany)
    muted: '#8B5CF6',      // Średni fiolet
    inverse: '#FFFFFF',    // Biały
    placeholder: '#A78BFA', // Fioletowy placeholder
  },

  // Kolory obramowań (zoptymalizowane dla spójności)
  border: {
    primary: '#C4B5FD',    // Średni fiolet (zoptymalizowany)
    secondary: '#DDD6FE',  // Średnio jasny fiolet
    focus: '#7C3AED',      // Główny fiolet (zoptymalizowany)
    error: '#EF4444',      // Czerwony błąd
    subtle: '#EDE9FE',     // Bardzo jasny fiolet
  },

  // Dark Mode - Kolory tła (zoptymalizowane dla lepszej czytelności i przyjemności)
  dark: {
    background: {
      primary: '#1E1B2E',    // Ciemny fiolet z niebieskim odcieniem (jaśniejszy)
      secondary: '#2A2D3A',  // Ciemny szary z fioletowym odcieniem
      card: '#2A2D3A',       // Ciemna karta z szarym odcieniem
      surface: '#2A2D3A',    // Powierzchnia z harmonijnym szarym
      overlay: 'rgba(30, 27, 46, 0.9)', // Overlay w kolorze tła
    },
    text: {
      primary: '#E2E8F0',    // Bardzo jasny szary (lepszy kontrast)
      secondary: '#94A3B8',  // Średni szary (lepsza czytelność)
      muted: '#64748B',      // Ciemniejszy szary
      inverse: '#1E1B2E',    // Ciemny fiolet (zaktualizowany)
      placeholder: '#64748B', // Szary placeholder (lepszy kontrast)
    },
    border: {
      primary: '#475569',    // Ciemny szary (lepszy kontrast)
      secondary: '#64748B',  // Średni szary
      focus: '#7C3AED',      // Główny fiolet (zoptymalizowany)
      error: '#F87171',      // Jasny czerwony (bez zmian)
      subtle: '#334155',     // Bardzo subtelny szary
    },
    input: {
      background: '#2A2D3A', // Ciemne tło z szarym odcieniem
      border: '#475569',     // Szara ramka (lepszy kontrast)
      text: '#E2E8F0',       // Jasny tekst
      placeholder: '#64748B', // Szary placeholder (lepszy kontrast)
    },
    accent: {
      gold: '#F59E0B',      // Złoty dla Premium
      silver: '#94A3B8',    // Srebrny
      bronze: '#CD7F32',    // Brązowy
    },
  },
} as const;

// Eksporty dla łatwiejszego dostępu
export const PrimaryColors = Colors.primary;
export const SecondaryColors = Colors.secondary;
export const SuccessColors = Colors.success;
export const WarningColors = Colors.warning;
export const ErrorColors = Colors.error;
export const BackgroundColors = Colors.background;
export const TextColors = Colors.text;
export const BorderColors = Colors.border;
