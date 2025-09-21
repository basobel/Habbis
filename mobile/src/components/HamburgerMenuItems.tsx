import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  isPremium?: boolean;
}

interface HamburgerMenuItemsProps {
  menuItems: MenuItem[];
}

export default function HamburgerMenuItems({ menuItems }: HamburgerMenuItemsProps) {
  const { colors, isLoaded } = useThemeContext();

  if (!isLoaded || !colors) {
    return (
      <View style={styles.menuItems}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { borderBottomColor: '#E5E7EB' }]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[
                    styles.menuItemIcon,
                    {
                      backgroundColor: item.isPremium ? '#F59E0B' : '#F3F4F6',
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={item.isPremium ? 'white' : '#7C3AED'}
                  />
                </View>
                <Text
                  style={[
                    styles.menuItemText,
                    {
                      color: item.isPremium ? '#F59E0B' : '#1F2937',
                      fontWeight: item.isPremium ? '600' : '400',
                    },
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              {item.isPremium && (
                <View style={[styles.premiumBadge, { backgroundColor: '#F59E0B' }]}>
                  <Text style={[styles.premiumBadgeText, { color: 'white' }]}>PRO</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
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
                      ? '#F59E0B'
                      : colors.background.secondary,
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
                      ? '#F59E0B'
                      : colors.text.primary,
                    fontWeight: item.isPremium ? '600' : '400',
                  },
                ]}
              >
                {item.title}
              </Text>
            </View>
            {item.isPremium && (
              <View style={[styles.premiumBadge, { backgroundColor: '#F59E0B' }]}>
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
  );
}

const styles = StyleSheet.create({
  menuItems: {
    flex: 1,
    paddingTop: 4,
  },
  menuItem: {
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 14,
    flex: 1,
  },
  premiumBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  premiumBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
});
