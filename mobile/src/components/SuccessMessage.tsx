import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

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
    backgroundColor: Colors.success[50],
    borderWidth: 1,
    borderColor: Colors.success[100],
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    color: Colors.success[700],
    textAlign: 'center',
    lineHeight: 20,
  },
});
