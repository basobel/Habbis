import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PasswordRequirementsProps {
  password: string;
}

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = [
    {
      text: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      text: 'One lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      text: 'One uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      text: 'One number',
      met: /\d/.test(password),
    },
    {
      text: 'One special character',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const allMet = requirements.every(req => req.met);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Requirements</Text>
      
      {requirements.map((requirement, index) => (
        <View key={index} style={styles.requirement}>
          <Text style={[
            styles.checkmark,
            requirement.met ? styles.checkmarkMet : styles.checkmarkUnmet
          ]}>
            {requirement.met ? '✓' : '○'}
          </Text>
          <Text style={[
            styles.requirementText,
            requirement.met ? styles.requirementMet : styles.requirementUnmet
          ]}>
            {requirement.text}
          </Text>
        </View>
      ))}
      
      {allMet && (
        <Text style={styles.successText}>
          Great! Your password meets all requirements.
        </Text>
      )}
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
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkmark: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  checkmarkMet: {
    color: '#22C55E',
  },
  checkmarkUnmet: {
    color: '#94A3B8',
  },
  requirementText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  requirementMet: {
    color: '#22C55E',
  },
  requirementUnmet: {
    color: '#6B7280',
  },
  successText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});
