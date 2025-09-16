import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

interface EmailVerificationBannerProps {
  email: string;
  onResendVerification: () => void;
  onDismiss?: () => void;
}

export default function EmailVerificationBanner({ 
  email, 
  onResendVerification, 
  onDismiss 
}: EmailVerificationBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.message}>
          Please check your email ({email}) and click the verification link to activate your account.
        </Text>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={onResendVerification}
          >
            <Text style={styles.buttonText}>Resend Email</Text>
          </TouchableOpacity>
          
          {onDismiss && (
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={onDismiss}
            >
              <Text style={styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.warning[50],
    borderWidth: 1,
    borderColor: Colors.warning[100],
    borderRadius: 8,
    margin: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.warning[700],
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.warning[700],
    lineHeight: 20,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: Colors.warning[500],
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: Colors.text.inverse,
    fontSize: 14,
    fontWeight: '600',
  },
  dismissButton: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dismissText: {
    color: Colors.warning[700],
    fontSize: 14,
    fontWeight: '500',
  },
});
