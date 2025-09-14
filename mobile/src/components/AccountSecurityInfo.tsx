import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AccountSecurityInfo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Security</Text>
      
      <View style={styles.feature}>
        <Text style={styles.featureIcon}>🔐</Text>
        <Text style={styles.featureText}>Secure password requirements</Text>
      </View>
      
      <View style={styles.feature}>
        <Text style={styles.featureIcon}>📧</Text>
        <Text style={styles.featureText}>Email verification required</Text>
      </View>
      
      <View style={styles.feature}>
        <Text style={styles.featureIcon}>🛡️</Text>
        <Text style={styles.featureText}>Rate limiting protection</Text>
      </View>
      
      <View style={styles.feature}>
        <Text style={styles.featureIcon}>🔒</Text>
        <Text style={styles.featureText}>Encrypted data storage</Text>
      </View>
      
      <View style={styles.feature}>
        <Text style={styles.featureIcon}>🚨</Text>
        <Text style={styles.featureText}>Suspicious activity monitoring</Text>
      </View>
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
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 16,
    textAlign: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#166534',
    flex: 1,
    lineHeight: 16,
  },
});
