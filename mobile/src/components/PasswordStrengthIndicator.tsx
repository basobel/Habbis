import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    return { score, checks };
  };

  const { score, checks } = getPasswordStrength(password);
  const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score] || 'Very Weak';
  const color = [Colors.error[500], Colors.warning[500], Colors.warning[500], Colors.success[500], Colors.success[600]][score] || Colors.error[500];

  if (!password) return null;

  return (
    <View style={styles.container}>
      <View style={styles.strengthBar}>
        <View style={[styles.strengthFill, { width: `${(score / 5) * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.strengthText, { color }]}>
        Password Strength: {strength}
      </Text>
      <View style={styles.checks}>
        <Text style={[styles.check, checks.length && styles.checkPassed]}>
          ✓ At least 8 characters
        </Text>
        <Text style={[styles.check, checks.lowercase && styles.checkPassed]}>
          ✓ Lowercase letter
        </Text>
        <Text style={[styles.check, checks.uppercase && styles.checkPassed]}>
          ✓ Uppercase letter
        </Text>
        <Text style={[styles.check, checks.numbers && styles.checkPassed]}>
          ✓ Number
        </Text>
        <Text style={[styles.check, checks.symbols && styles.checkPassed]}>
          ✓ Special character
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: Colors.border.secondary,
    borderRadius: 2,
    marginBottom: 8,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  checks: {
    gap: 4,
  },
  check: {
    fontSize: 12,
    color: Colors.secondary[400],
  },
  checkPassed: {
    color: Colors.success[500],
  },
});
