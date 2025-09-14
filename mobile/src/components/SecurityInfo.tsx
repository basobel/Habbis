import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SecurityInfoProps {
  type: 'password' | 'email' | 'account';
}

export default function SecurityInfo({ type }: SecurityInfoProps) {
  const getInfo = () => {
    switch (type) {
      case 'password':
        return {
          title: 'Password Security Tips',
          tips: [
            'Use at least 8 characters',
            'Include uppercase and lowercase letters',
            'Add numbers and special characters',
            'Avoid common words or personal info',
            'Don\'t reuse passwords from other accounts',
          ],
        };
      case 'email':
        return {
          title: 'Email Security Tips',
          tips: [
            'Use a valid email address you can access',
            'Check your spam folder for verification emails',
            'Keep your email account secure',
            'Don\'t share verification links with others',
            'Contact support if you don\'t receive emails',
          ],
        };
      case 'account':
        return {
          title: 'Account Security Tips',
          tips: [
            'Choose a unique username',
            'Keep your login credentials private',
            'Log out from shared devices',
            'Report suspicious activity immediately',
            'Enable two-factor authentication when available',
          ],
        };
      default:
        return { title: '', tips: [] };
    }
  };

  const { title, tips } = getInfo();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {tips.map((tip, index) => (
        <Text key={index} style={styles.tip}>
          • {tip}
        </Text>
      ))}
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
    marginBottom: 8,
  },
  tip: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 16,
  },
});
