import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SuccessMessageProps {
  message: string;
  visible?: boolean;
}

export default function SuccessMessage({ message, visible = true }: SuccessMessageProps) {
  if (!visible || !message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    color: '#166534',
    textAlign: 'center',
    lineHeight: 20,
  },
});
