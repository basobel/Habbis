import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { colors, isLoaded } = useThemeContext();

  const getStrength = (password: string): { level: number; label: string; color: string } => {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    const levels = [
      { level: 0, label: 'Very Weak', color: '#EF4444' },
      { level: 1, label: 'Weak', color: '#F59E0B' },
      { level: 2, label: 'Fair', color: '#F59E0B' },
      { level: 3, label: 'Good', color: '#10B981' },
      { level: 4, label: 'Strong', color: '#10B981' },
      { level: 5, label: 'Very Strong', color: '#059669' },
    ];
    
    return levels[Math.min(score, 5)];
  };

  const strength = getStrength(password);
  const percentage = (strength.level / 5) * 100;

  if (!isLoaded || !colors) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.label, { color: '#4C1D95' }]}>Password Strength</Text>
          <Text style={[styles.strength, { color: strength.color }]}>{strength.label}</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: '#E2E8F0' }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: strength.color,
                width: `${percentage}%`
              }
            ]} 
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.text.primary }]}>Password Strength</Text>
        <Text style={[styles.strength, { color: strength.color }]}>{strength.label}</Text>
      </View>
      <View style={[styles.progressBar, { backgroundColor: colors.border.primary }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              backgroundColor: strength.color,
              width: `${percentage}%`
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  strength: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});