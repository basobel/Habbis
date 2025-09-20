import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

interface SecurityInfoProps {
  type: 'password' | 'email' | 'account';
  variant?: 'tips' | 'requirements' | 'strength' | 'info';
}

interface SecurityTip {
  icon: string;
  text: string;
}

const securityContent: Record<string, Record<string, SecurityTip[]>> = {
  password: {
    tips: [
      { icon: '🔒', text: 'Use at least 8 characters' },
      { icon: '🔤', text: 'Include uppercase and lowercase letters' },
      { icon: '🔢', text: 'Add numbers and special characters' },
      { icon: '🚫', text: 'Avoid common words or personal info' },
      { icon: '🔄', text: 'Don\'t reuse passwords from other accounts' },
    ],
    requirements: [
      { icon: '🔒', text: 'Use a unique password for each account' },
      { icon: '🔤', text: 'Include a mix of letters, numbers, and symbols' },
      { icon: '🚫', text: 'Avoid personal information like names or birthdays' },
      { icon: '🔄', text: 'Change your password regularly' },
      { icon: '💾', text: 'Use a password manager to store passwords securely' },
    ],
    info: [
      { icon: '🔒', text: 'Use a unique password for each account' },
      { icon: '🔤', text: 'Include a mix of letters, numbers, and symbols' },
      { icon: '🚫', text: 'Avoid personal information like names or birthdays' },
      { icon: '🔄', text: 'Change your password regularly' },
      { icon: '💾', text: 'Use a password manager to store passwords securely' },
    ],
  },
  email: {
    info: [
      { icon: '📧', text: 'Use a professional email address' },
      { icon: '🔐', text: 'Enable two-factor authentication' },
      { icon: '🛡️', text: 'Keep your email account secure' },
      { icon: '📱', text: 'Use a secure email provider' },
    ],
  },
  account: {
    info: [
      { icon: '🔐', text: 'Enable two-factor authentication' },
      { icon: '🔒', text: 'Use strong, unique passwords' },
      { icon: '📱', text: 'Keep your device secure' },
      { icon: '🛡️', text: 'Regularly review account settings' },
    ],
  },
};

const getTitle = (type: string, variant: string): string => {
  const titles: Record<string, Record<string, string>> = {
    password: {
      tips: 'Password Security Tips',
      requirements: 'Password Requirements',
      info: 'Password Security',
      strength: 'Password Strength',
    },
    email: {
      info: 'Email Security',
    },
    account: {
      info: 'Account Security',
    },
  };
  return titles[type]?.[variant] || 'Security Information';
};

export default function SecurityInfo({ type, variant = 'info' }: SecurityInfoProps) {
  const { colors, isLoaded } = useThemeContext();

  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
        <Text style={[styles.title, { color: '#4C1D95' }]}>
          {getTitle(type, variant)}
        </Text>
        <Text style={[styles.loadingText, { color: '#64748B' }]}>Loading security information...</Text>
      </View>
    );
  }

  const tips = securityContent[type]?.[variant] || [];
  const title = getTitle(type, variant);

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.background.secondary, 
      borderColor: colors.border.secondary 
    }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        {title}
      </Text>
      
      {tips.map((tip, index) => (
        <View key={index} style={styles.tip}>
          <Text style={styles.tipIcon}>{tip.icon}</Text>
          <Text style={[styles.tipText, { color: colors.text.secondary }]}>
            {tip.text}
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
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});