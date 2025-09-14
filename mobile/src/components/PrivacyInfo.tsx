import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PrivacyInfoProps {
  onPrivacyPress?: () => void;
  onTermsPress?: () => void;
}

export default function PrivacyInfo({ onPrivacyPress, onTermsPress }: PrivacyInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        By creating an account, you agree to our{' '}
        <TouchableOpacity onPress={onTermsPress}>
          <Text style={styles.link}>Terms of Service</Text>
        </TouchableOpacity>
        {' '}and{' '}
        <TouchableOpacity onPress={onPrivacyPress}>
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>
        .
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  link: {
    color: '#1E40AF',
    textDecorationLine: 'underline',
  },
});
