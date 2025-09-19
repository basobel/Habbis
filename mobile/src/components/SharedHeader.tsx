import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

interface SharedHeaderProps {
  title: string;
  subtitle?: string;
  onHamburgerPress: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
}

export default function SharedHeader({ 
  title, 
  subtitle, 
  onHamburgerPress, 
  rightAction 
}: SharedHeaderProps) {
  const { colors, isLoaded } = useThemeContext();

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#4C1D95' }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background?.card || '#FFFFFF' }]}>
      <View style={styles.content}>
        {/* Left side - Hamburger Menu */}
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={onHamburgerPress}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        {/* Center - Title and Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right side - Action Button */}
        <View style={styles.rightContainer}>
          {rightAction ? (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary?.[600] || '#6D28D9' }]}
              onPress={rightAction.onPress}
              activeOpacity={0.8}
            >
              <Ionicons name={rightAction.icon as any} size={20} color={colors.text.inverse} />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hamburgerButton: {
    padding: 8,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  placeholder: {
    width: 36,
    height: 36,
  },
});
