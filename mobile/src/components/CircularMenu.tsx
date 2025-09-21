import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color?: string;
}

interface CircularMenuProps {
  items: MenuItem[];
  onItemPress?: (item: MenuItem) => void;
  size?: number;
  radius?: number;
  position?: 'bottom-center' | 'bottom-right' | 'bottom-left';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CircularMenu({
  items,
  onItemPress,
  size = 60,
  radius = 120,
  position = 'bottom-center',
}: CircularMenuProps) {
  const { colors, isDark } = useThemeContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  
  // Animacje
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimations = useRef(
    items.map(() => new Animated.Value(0))
  ).current;
  const closeButtonAnimation = useRef(new Animated.Value(0)).current;

  // Pozycjonowanie menu z uwzględnieniem SafeArea
  const getMenuPosition = () => {
    const bottomMargin = Math.max(insets.bottom + 20, 30); // Minimum 30px, ale uwzględnij SafeArea
    const sideMargin = Math.max(insets.left + 20, 20); // Minimum 20px, ale uwzględnij SafeArea
    
    switch (position) {
      case 'bottom-center':
        return {
          bottom: bottomMargin,
          left: screenWidth / 2 - size / 2,
        };
      case 'bottom-right':
        return {
          bottom: bottomMargin,
          right: sideMargin,
        };
      case 'bottom-left':
        return {
          bottom: bottomMargin,
          left: sideMargin,
        };
      default:
        return {
          bottom: bottomMargin,
          left: screenWidth / 2 - size / 2,
        };
    }
  };

  // Oblicz pozycje przycisków po łuku nad głównym przyciskiem
  const getButtonPositions = () => {
    // Kąt początkowy (lewa strona) i końcowy (prawa strona) - tylko górna połowa okręgu
    const startAngle = Math.PI; // 180 stopni (lewa strona)
    const endAngle = 0; // 0 stopni (prawa strona)
    const angleStep = (endAngle - startAngle) / (items.length - 1);
    
    return items.map((_, index) => {
        const angle = startAngle + angleStep * index;
      
        const x = Math.cos(angle) * (radius * 0.7); // Zmniejszony radius
        const y = -Math.sin(angle) * (radius * 0.7); // Mniejsze przesunięcie w górę
      
        return { x, y };
      });
  };

  const buttonPositions = getButtonPositions();

  // Animacja otwierania menu
  const openMenu = () => {
    setIsOpen(true);
    
    // Animacja głównego przycisku (obrót)
    Animated.timing(menuAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Animacja przycisków (wysuwanie od lewa do prawa)
    buttonAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        delay: index * 80, // Zwiększone opóźnienie dla lepszego efektu
        useNativeDriver: true,
      }).start();
    });

    // Animacja przycisku zamknięcia
    Animated.timing(closeButtonAnimation, {
      toValue: 1,
      duration: 200,
      delay: items.length * 80 + 100,
      useNativeDriver: true,
    }).start();
  };

  // Animacja zamykania menu
  const closeMenu = () => {
    // Animacja przycisku zamknięcia
    Animated.timing(closeButtonAnimation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();

    // Animacja przycisków (chowanie od prawa do lewa)
    buttonAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 150,
        delay: (items.length - index - 1) * 60, // Od prawa do lewa
        useNativeDriver: true,
      }).start();
    });

    // Animacja głównego przycisku
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 300,
      delay: 100,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
    });
  };

  // Obsługa kliknięcia w element menu
  const handleItemPress = (item: MenuItem) => {
    closeMenu();
    
    if (onItemPress) {
      onItemPress(item);
    } else {
      router.push(item.route as any);
    }
  };


  const menuPosition = getMenuPosition();

  return (
    <>
      {/* Główny przycisk menu */}
      <Animated.View
        style={[
          styles.menuButton,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isOpen ? '#EF4444' : colors.primary[600], // Czerwone gdy otwarte
            ...menuPosition,
            transform: [
              {
                rotate: menuAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg'],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.menuButtonContent}
          onPress={isOpen ? closeMenu : openMenu}
          activeOpacity={0.8}
        >
          <Animated.View
            style={{
              opacity: menuAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }}
          >
            <Ionicons
              name="menu"
              size={size * 0.4}
              color={colors.text.inverse}
            />
          </Animated.View>
          
          <Animated.View
            style={[
              styles.closeButton,
              {
                opacity: closeButtonAnimation,
                transform: [
                  {
                    scale: closeButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name="add"
              size={size * 0.4}
              color={colors.text.inverse}
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Przyciski menu */}
      {isOpen && (
        <View style={[styles.menuItemsContainer, menuPosition]}>
          {items.map((item, index) => {
            const position = buttonPositions[index];
            const buttonAnimation = buttonAnimations[index];
            
            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.menuItem,
                  {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: item.color || colors.primary[500],
                    transform: [
                      {
                        translateX: buttonAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, position.x],
                        }),
                      },
                      {
                        translateY: buttonAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-50, position.y - 50],
                        }),
                      },
                      {
                        scale: buttonAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                    opacity: buttonAnimation,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.menuItemContent}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={item.icon}
                    size={size * 0.3}
                    color={colors.text.inverse}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    zIndex: 1001,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  menuButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemsContainer: {
    position: 'absolute',
    zIndex: 1002,
    width: 0,
    height: 0,
  },
  menuItem: {
    position: 'absolute',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuItemContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
