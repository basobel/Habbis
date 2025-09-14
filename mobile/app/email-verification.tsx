import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import FormButton from '@/components/FormButton';
import { RootState } from '@/store';

export default function EmailVerificationScreen() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (user?.email_verified_at) {
      router.replace('/(tabs)');
    }
  }, [user]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;

    try {
      // TODO: Implement resend verification API call
      Alert.alert(
        'Verification Email Sent',
        'Please check your email for the verification link.',
        [{ text: 'OK' }]
      );
      setResendCooldown(60); // 60 seconds cooldown
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification email. Please try again.');
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification link to{'\n'}
          <Text style={styles.email}>{user?.email}</Text>
        </Text>
        
        <Text style={styles.description}>
          Please check your email and click the verification link to activate your account.
        </Text>

        <View style={styles.actions}>
          <FormButton
            title={resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
            onPress={handleResendVerification}
            disabled={resendCooldown > 0 || isLoading}
            loading={isLoading}
            style={styles.button}
          />

          <FormButton
            title="Sign Out"
            onPress={handleLogout}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <Text style={styles.helpText}>
          Didn't receive the email? Check your spam folder or try resending.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    fontWeight: '600',
    color: '#1E40AF',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
  helpText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
});
