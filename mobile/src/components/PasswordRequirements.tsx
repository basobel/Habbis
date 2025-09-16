import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

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
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
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
    color: Colors.success[500],
  },
  checkmarkUnmet: {
    color: Colors.secondary[400],
  },
  requirementText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  requirementMet: {
    color: Colors.success[500],
  },
  requirementUnmet: {
    color: Colors.text.secondary,
  },
  successText: {
    fontSize: 12,
    color: Colors.success[500],
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});
