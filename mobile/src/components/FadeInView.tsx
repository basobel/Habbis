import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface FadeInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export default function FadeInView({ 
  children, 
  duration = 300,
  delay = 0 
}: FadeInViewProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim, duration, delay]);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
      }}
    >
      {children}
    </Animated.View>
  );
}
