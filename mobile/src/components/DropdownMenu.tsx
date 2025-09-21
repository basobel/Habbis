import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface DropdownItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  onPress: () => void;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  isVisible: boolean;
  onClose: () => void;
  position?: 'top-left' | 'top-right' | 'top-center';
}

export default function DropdownMenu({ 
  items, 
  isVisible, 
  onClose, 
  position = 'top-right' 
}: DropdownMenuProps) {
  const { colors, isLoaded } = useThemeContext();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Animacje
  const expandAnimation = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef(
    items.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (isVisible) {
      setIsExpanded(true);
      Animated.parallel([
        Animated.timing(expandAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        ...itemAnimations.map((anim, index) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            delay: index * 50,
            useNativeDriver: true,
          })
        ),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(expandAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        ...itemAnimations.map((anim) =>
          Animated.timing(anim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          })
        ),
      ]).start(() => {
        setIsExpanded(false);
      });
    }
  }, [isVisible]);

  const getMenuPosition = () => {
    const topMargin = 60; // Wysokość TopPanel
    const sideMargin = 16;
    
    switch (position) {
      case 'top-left':
        return {
          top: topMargin,
          left: sideMargin,
        };
      case 'top-center':
        return {
          top: topMargin,
          left: screenWidth / 2 - 100, // Szerokość menu / 2
        };
      case 'top-right':
      default:
        return {
          top: topMargin,
          right: sideMargin,
        };
    }
  };

  const handleItemPress = (item: DropdownItem) => {
    item.onPress();
    onClose();
  };

  if (!isLoaded || !colors || !isExpanded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      
      {/* Menu */}
      <Animated.View
        style={[
          styles.menu,
          {
            backgroundColor: colors.background.card,
            borderColor: colors.border.primary,
            ...getMenuPosition(),
            opacity: expandAnimation,
            transform: [
              {
                scale: expandAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
              {
                translateY: expandAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        {items.map((item, index) => (
          <Animated.View
            key={item.id}
            style={{
              opacity: itemAnimations[index],
              transform: [
                {
                  translateX: itemAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity
              style={[
                styles.menuItem,
                {
                  borderBottomColor: colors.border.primary,
                },
                index === items.length - 1 && styles.lastMenuItem,
              ]}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[
                    styles.menuItemIcon,
                    {
                      backgroundColor: item.color || colors.primary[600],
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={16}
                    color={colors.text.inverse}
                  />
                </View>
                <Text style={[styles.menuItemText, { color: colors.text.primary }]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
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
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menu: {
    position: 'absolute',
    width: 200,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
