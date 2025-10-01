import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
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
  onCloseOther?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function CircularMenu(props: CircularMenuProps, ref: React.Ref<{ close: () => void }>) {
  const {
    items,
    onItemPress,
    size = 60,
    radius = 120,
    position = 'bottom-center',
    onCloseOther,
  } = props;
  const { colors, isDark } = useThemeContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  
  // Ref do śledzenia czy animacja jest w trakcie
  const isAnimating = useRef(false);
  
  // Expose close method to parent
  useImperativeHandle(ref, () => ({
    close: () => closeMenu()
  }));
  
  // Animacje
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimations = useRef(
    items.map(() => new Animated.Value(0))
  ).current;
  const closeButtonAnimation = useRef(new Animated.Value(0)).current;

  // Animacje są resetowane automatycznie w openMenu/closeMenu

  // Pozycjonowanie menu z uwzględnieniem SafeArea - memoized
  const menuPosition = React.useMemo(() => {
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
  }, [insets.bottom, insets.left, position, size]);

  // Oblicz pozycje przycisków po łuku nad głównym przyciskiem - memoized
  const buttonPositions = React.useMemo(() => {
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
  }, [items.length, radius]);

  // Animacja otwierania menu
  const openMenu = () => {
    if (isAnimating.current) return;
    
    isAnimating.current = true;
    setIsOpen(true);
    // Zamknij TopPanel gdy otwieramy CircularMenu
    onCloseOther?.();
    
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
        delay: index * 80,
        useNativeDriver: true,
      }).start();
    });

    // Animacja przycisku zamknięcia
    Animated.timing(closeButtonAnimation, {
      toValue: 1,
      duration: 200,
      delay: items.length * 80 + 100,
      useNativeDriver: true,
    }).start(() => {
      isAnimating.current = false;
    });
  };

  // Animacja zamykania menu
  const closeMenu = () => {
    if (isAnimating.current) return;
    
    isAnimating.current = true;
    
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
        delay: (items.length - index - 1) * 60,
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
      isAnimating.current = false;
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



  // menuPosition is now memoized above

  return (
    <>
      {/* Główny przycisk menu */}
      <Animated.View
        style={[
          styles.menuButton,
          {
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
        
        {/* Główny przycisk */}
        <Animated.View
          style={[
            styles.mainButton,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: isOpen ? '#EF4444' : colors.primary[600],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.menuButtonContent}
            onPressIn={isOpen ? closeMenu : openMenu}
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
      </Animated.View>

      {/* Overlay */}
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressIn={closeMenu}
        />
      )}

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
                
                {/* Główny przycisk */}
                <Animated.View
                  style={[
                    styles.menuItemButton,
                    {
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      backgroundColor: item.color || colors.primary[500],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.menuItemContent}
                    onPressIn={() => handleItemPress(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={item.icon}
                      size={size * 0.3}
                      color={colors.text.inverse}
                    />
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            );
          })}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1003,
  },
  menuButton: {
    position: 'absolute',
    zIndex: 1004,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    elevation: 12,
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
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
    zIndex: 1005,
    width: 0,
    height: 0,
  },
  menuItem: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemButton: {
    elevation: 8,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  menuItemContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.forwardRef(CircularMenu);
