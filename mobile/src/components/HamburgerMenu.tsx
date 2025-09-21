import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { logout } from '@/store/slices/authSlice';
import { useThemeContext } from '@/contexts/ThemeContext';
import HamburgerMenuHeader from './HamburgerMenuHeader';
import HamburgerMenuItems from './HamburgerMenuItems';

interface HamburgerMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const menuWidth = screenWidth * 0.75; // 75% szerokości ekranu - bardziej kompaktowe

export default function HamburgerMenu({ isVisible, onClose, onNavigate }: HamburgerMenuProps) {
  const dispatch = useDispatch();
  const { colors, isLoaded } = useThemeContext();
  const slideAnim = useRef(new Animated.Value(-menuWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -menuWidth,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    // Najpierw uruchom animację zamykania
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -menuWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Po zakończeniu animacji wywołaj callback
      onClose();
    });
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout() as any);
      handleClose();
      // Przekieruj do strony logowania
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Nawet jeśli wystąpi błąd, wyczyść stan lokalny
      handleClose();
      router.replace('/login');
    }
  };

  const menuItems = [
    {
      id: 'profile',
      title: 'Profil',
      icon: 'person-outline',
      onPress: () => {
        onNavigate('profile');
        handleClose();
      },
    },
    {
      id: 'settings',
      title: 'Ustawienia',
      icon: 'settings-outline',
      onPress: () => {
        onNavigate('settings');
        handleClose();
      },
    },
    {
      id: 'premium',
      title: 'Premium',
      icon: 'diamond-outline',
      onPress: () => {
        onNavigate('premium');
        handleClose();
      },
      isPremium: true,
    },
    {
      id: 'achievements',
      title: 'Osiągnięcia',
      icon: 'trophy-outline',
      onPress: () => {
        onNavigate('achievements');
        handleClose();
      },
    },
    {
      id: 'statistics',
      title: 'Statystyki',
      icon: 'bar-chart-outline',
      onPress: () => {
        onNavigate('statistics');
        handleClose();
      },
    },
    {
      id: 'help',
      title: 'Pomoc',
      icon: 'help-circle-outline',
      onPress: () => {
        onNavigate('help');
        handleClose();
      },
    },
    {
      id: 'about',
      title: 'O aplikacji',
      icon: 'information-circle-outline',
      onPress: () => {
        onNavigate('about');
        handleClose();
      },
    },
  ];

  if (!isVisible || !isLoaded || !colors) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.5)" />
      
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      {/* Menu */}
      <Animated.View
        style={[
          styles.menu,
          {
            backgroundColor: colors.background.primary,
            transform: [
              { translateX: slideAnim },
              { scale: scaleAnim }
            ],
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <HamburgerMenuHeader onClose={handleClose} onLogout={handleLogout} />
          <HamburgerMenuItems menuItems={menuItems} />
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTouchable: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: menuWidth,
    height: screenHeight,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  safeArea: {
    flex: 1,
  },
});
