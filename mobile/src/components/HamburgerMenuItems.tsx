import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeFallback } from '@/hooks/useThemeFallback';

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
  const { getTextColor, getPrimaryColor, getBorderColor, getBackgroundColor } = useThemeFallback();

  return (
    <View style={styles.menuItems}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.menuItem,
            { borderBottomColor: getBorderColor('primary') },
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
                      ? '#F59E0B' // Gold color for premium
                      : getBackgroundColor('secondary'),
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.isPremium ? getTextColor('inverse') : getPrimaryColor()}
                />
              </View>
              <Text
                style={[
                  styles.menuItemText,
                  {
                    color: item.isPremium
                      ? '#F59E0B' // Gold color for premium
                      : getTextColor('primary'),
                    fontWeight: item.isPremium ? '600' : '400',
                  },
                ]}
              >
                {item.title}
              </Text>
            </View>
            {item.isPremium && (
              <View style={[styles.premiumBadge, { backgroundColor: '#F59E0B' }]}>
                <Text style={[styles.premiumBadgeText, { color: getTextColor('inverse') }]}>
                  PRO
                </Text>
              </View>
            )}
            <Ionicons
              name="chevron-forward"
              size={16}
              color={getTextColor('secondary')}
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
});
