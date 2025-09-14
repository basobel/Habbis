import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmailVerificationInfo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Verification Required</Text>
      
      <View style={styles.step}>
        <Text style={styles.stepNumber}>1</Text>
        <Text style={styles.stepText}>Check your email inbox</Text>
      </View>
      
      <View style={styles.step}>
        <Text style={styles.stepNumber}>2</Text>
        <Text style={styles.stepText}>Click the verification link</Text>
      </View>
      
      <View style={styles.step}>
        <Text style={styles.stepNumber}>3</Text>
        <Text style={styles.stepText}>Return to the app and log in</Text>
      </View>
      
      <Text style={styles.note}>
        Don't see the email? Check your spam folder or try resending.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 16,
    textAlign: 'center',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E40AF',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#1E40AF',
    flex: 1,
  },
  note: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
