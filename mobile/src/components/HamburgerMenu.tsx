import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

interface HamburgerMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HamburgerMenu({ isVisible, onClose, onNavigate }: HamburgerMenuProps) {
  const { colors, isDark } = useThemeContext();
  const dispatch = useDispatch();
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenWidth,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    // Najpierw uruchom animację zamykania
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
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

  const handleLogout = () => {
    dispatch(logout() as any);
    handleClose();
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

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.primary }]}>
            <View style={styles.headerContent}>
              <View style={styles.userInfo}>
                <View style={[styles.avatar, { backgroundColor: colors.primary[500] }]}>
                  <Ionicons name="person" size={24} color={colors.text.inverse} />
                </View>
                <View style={styles.userDetails}>
                  <Text style={[styles.userName, { color: colors.text.primary }]}>
                    Użytkownik
                  </Text>
                  <Text style={[styles.userEmail, { color: colors.text.secondary }]}>
                    user@example.com
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuItems}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  { borderBottomColor: colors.border.primary },
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <View
                      style={[
                        styles.menuItemIcon,
                        {
                          backgroundColor: item.isPremium
                            ? colors.accent.gold
                            : colors.primary[100],
                        },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={item.isPremium ? colors.text.inverse : colors.primary[600]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.menuItemText,
                        {
                          color: item.isPremium
                            ? colors.accent.gold
                            : colors.text.primary,
                          fontWeight: item.isPremium ? '600' : '400',
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                  {item.isPremium && (
                    <View style={[styles.premiumBadge, { backgroundColor: colors.accent.gold }]}>
                      <Text style={[styles.premiumBadgeText, { color: colors.text.inverse }]}>
                        PRO
                      </Text>
                    </View>
                  )}
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.text.secondary}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border.primary }]}>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: colors.error[50] }]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.error[600]} />
              <Text style={[styles.logoutText, { color: colors.error[600] }]}>
                Wyloguj się
              </Text>
            </TouchableOpacity>
          </View>
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
    zIndex: 1000,
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
    width: screenWidth * 0.85,
    height: screenHeight,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
  },
  closeButton: {
    padding: 8,
  },
  menuItems: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
  },
  premiumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
