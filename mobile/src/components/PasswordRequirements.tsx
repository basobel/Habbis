import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

interface PasswordRequirementsProps {
  password: string;
}

interface Requirement {
  text: string;
  met: boolean;
}

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const { colors, isLoaded } = useThemeContext();

  const requirements: Requirement[] = [
    {
      text: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      text: 'Contains uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      text: 'Contains lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      text: 'Contains number',
      met: /[0-9]/.test(password),
    },
    {
      text: 'Contains special character',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
        <Text style={[styles.title, { color: '#4C1D95' }]}>Password Requirements</Text>
        {requirements.map((req, index) => (
          <View key={index} style={styles.requirement}>
            <Text style={[styles.icon, { color: req.met ? '#10B981' : '#EF4444' }]}>
              {req.met ? '✓' : '✗'}
            </Text>
            <Text style={[styles.text, { 
              color: req.met ? '#10B981' : '#EF4444' 
            }]}>
              {req.text}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.background.secondary, 
      borderColor: colors.border.secondary 
    }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Password Requirements</Text>
      {requirements.map((req, index) => (
        <View key={index} style={styles.requirement}>
          <Text style={[styles.icon, { 
            color: req.met ? colors.success[500] : colors.error[500] 
          }]}>
            {req.met ? '✓' : '✗'}
          </Text>
          <Text style={[styles.text, { 
            color: req.met ? colors.success[600] : colors.error[600] 
          }]}>
            {req.text}
          </Text>
        </View>
      ))}
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    flex: 1,
  },
});