import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PasswordSecurityInfo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Security</Text>
      
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>🔒</Text>
        <Text style={styles.tipText}>Use a unique password for each account</Text>
      </View>
      
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>🔤</Text>
        <Text style={styles.tipText}>Include a mix of letters, numbers, and symbols</Text>
      </View>
      
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>🚫</Text>
        <Text style={styles.tipText}>Avoid personal information like names or birthdays</Text>
      </View>
      
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>🔄</Text>
        <Text style={styles.tipText}>Change your password regularly</Text>
      </View>
      
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>💾</Text>
        <Text style={styles.tipText}>Use a password manager to store passwords securely</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
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
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
});