import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/ThemeContext';

interface PetAnimationProps {
  type: 'feed' | 'play' | 'happy' | 'sad';
  isActive: boolean;
  onComplete?: () => void;
}

export default function PetAnimation({ type, isActive, onComplete }: PetAnimationProps) {
  const { colors } = useThemeContext();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Start animation
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 100,
          friction: 3,
        }),
        Animated.timing(translateYAnim, {
          toValue: -20,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Fade out
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onComplete?.();
        });
      });
    } else {
      // Reset animation
      scaleAnim.setValue(1);
      opacityAnim.setValue(0);
      translateYAnim.setValue(0);
    }
  }, [isActive]);

  const getAnimationIcon = () => {
    switch (type) {
      case 'feed': return 'restaurant';
      case 'play': return 'happy';
      case 'happy': return 'heart';
      case 'sad': return 'sad';
      default: return 'star';
    }
  };

  const getAnimationColor = () => {
    switch (type) {
      case 'feed': return colors.accent.gold;
      case 'play': return colors.success[500];
      case 'happy': return colors.error[500];
      case 'sad': return colors.text.muted;
      default: return colors.primary[500];
    }
  };

  if (!isActive) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: getAnimationColor() }]}>
        <Ionicons
          name={getAnimationIcon() as any}
          size={24}
          color={colors.text.inverse}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    zIndex: 1000,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
