import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeFallback } from '@/hooks/useThemeFallback';

interface SuccessMessageProps {
  message: string;
  visible?: boolean;
}

export default function SuccessMessage({ message, visible = true }: SuccessMessageProps) {
  const { getTextColor, getBackgroundColor, getBorderColor, getSuccessColor } = useThemeFallback();

  if (!visible || !message) {
    return null;
  }

  return (
    <View style={[styles.container, {
      backgroundColor: getBackgroundColor('secondary'),
      borderColor: getBorderColor('primary'),
    }]}>
      <Text style={[styles.message, { color: getSuccessColor() }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
