import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PasswordSecurityTips() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Security Tips</Text>
      
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>🔒</Text>
        <Text style={styles.tipText}>Use at least 8 characters</Text>
      </View>
      
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>🔤</Text>
        <Text style={styles.tipText}>Include uppercase and lowercase letters</Text>
      </View>
      
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>🔢</Text>
        <Text style={styles.tipText}>Add numbers and special characters</Text>
      </View>
      
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>🚫</Text>
        <Text style={styles.tipText}>Avoid common words or personal info</Text>
      </View>
      
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>🔄</Text>
        <Text style={styles.tipText}>Don't reuse passwords from other accounts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    lineHeight: 16,
  },
});
