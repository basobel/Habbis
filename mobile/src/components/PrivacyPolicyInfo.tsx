import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PrivacyPolicyInfoProps {
  onPrivacyPress?: () => void;
  onTermsPress?: () => void;
}

export default function PrivacyPolicyInfo({ onPrivacyPress, onTermsPress }: PrivacyPolicyInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy & Security</Text>
      
      <Text style={styles.description}>
        We take your privacy and security seriously. Your data is encrypted and protected.
      </Text>
      
      <View style={styles.links}>
        <TouchableOpacity onPress={onPrivacyPress} style={styles.linkButton}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onTermsPress} style={styles.linkButton}>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.note}>
        By using Habbis, you agree to our terms and privacy policy.
      </Text>
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
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  linkButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  linkText: {
    fontSize: 12,
    color: '#1E40AF',
    textDecorationLine: 'underline',
  },
  note: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
