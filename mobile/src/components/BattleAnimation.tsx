import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface BattleAnimationProps {
  type: 'attack' | 'defend' | 'heal' | 'special' | 'victory' | 'defeat';
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
  onComplete?: () => void;
}

export default function BattleAnimation({
  type,
  intensity = 'medium',
  duration = 1000,
  onComplete,
}: BattleAnimationProps) {
  const { colors, isLoaded } = useThemeContext();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  // Fallback colors
  const primaryColor = colors?.primary?.[500] || '#7C3AED';
  const success500 = colors?.success?.[500] || '#22C55E';
  const error500 = colors?.error?.[500] || '#EF4444';
  const warning500 = colors?.warning?.[500] || '#F59E0B';
  const accentGold = colors?.accent?.gold || '#F59E0B';
  const textInverse = colors?.text?.inverse || '#FFFFFF';

  useEffect(() => {
    if (!isLoaded || !colors) return;

    // Start animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: duration * 0.3,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: duration * 0.2,
        useNativeDriver: true,
      }),
    ]).start();

    // Middle animation based on type
    setTimeout(() => {
      switch (type) {
        case 'attack':
          Animated.sequence([
            Animated.timing(translateYAnim, {
              toValue: -20,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
          break;
        case 'defend':
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
          break;
        case 'heal':
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
          break;
        case 'special':
          Animated.loop(
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.3,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              }),
            ]),
            { iterations: 3 }
          ).start();
          break;
        case 'victory':
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.5,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
          break;
        case 'defeat':
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 0.5,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
          break;
      }
    }, duration * 0.3);

    // End animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: duration * 0.3,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: duration * 0.3,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete?.();
      });
    }, duration * 0.7);
  }, [type, intensity, duration, onComplete]);

  const getAnimationConfig = () => {
    const baseConfig = {
      icon: 'flash',
      color: primaryColor,
      text: 'Action!',
    };

    switch (type) {
      case 'attack':
        return {
          icon: 'flash',
          color: error500,
          text: intensity === 'high' ? 'CRITICAL HIT!' : 'ATTACK!',
        };
      case 'defend':
        return {
          icon: 'shield',
          color: primaryColor,
          text: 'DEFEND!',
        };
      case 'heal':
        return {
          icon: 'heart',
          color: success500,
          text: 'HEAL!',
        };
      case 'special':
        return {
          icon: 'star',
          color: accentGold,
          text: 'SPECIAL!',
        };
      case 'victory':
        return {
          icon: 'trophy',
          color: accentGold,
          text: 'VICTORY!',
        };
      case 'defeat':
        return {
          icon: 'skull',
          color: error500,
          text: 'DEFEAT!',
        };
      default:
        return baseConfig;
    }
  };

  const getIntensityMultiplier = () => {
    switch (intensity) {
      case 'low': return 0.8;
      case 'medium': return 1;
      case 'high': return 1.3;
      default: return 1;
    }
  };

  const config = getAnimationConfig();
  const multiplier = getIntensityMultiplier();

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!isLoaded || !colors) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.animationContainer,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
              { rotate: rotateInterpolate },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${config.color}20`,
              width: 80 * multiplier,
              height: 80 * multiplier,
              borderRadius: 40 * multiplier,
            },
          ]}
        >
          <Ionicons
            name={config.icon as any}
            size={40 * multiplier}
            color={config.color}
          />
        </View>
        <Text
          style={[
            styles.animationText,
            {
              color: config.color,
              fontSize: 16 * multiplier,
            },
          ]}
        >
          {config.text}
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  animationText: {
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
