import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function ForgotPasswordScreen() {
  const { colors, isLoaded } = useThemeContext();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleSendResetEmail = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: Implement forgot password API call
      // const response = await apiClient.post('/password/email', { email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsEmailSent(true);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        Alert.alert('Error', 'Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/login');
  };

  // Show loading if theme is not loaded
  if (!isLoaded || !colors) {
    return (
      <View style={[styles.container, { backgroundColor: '#F5F3FF' }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: '#4C1D95' }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (isEmailSent) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background.primary }]} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Check Your Email</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            We've sent a password reset link to{'\n'}
            <Text style={[styles.email, { color: colors.primary[600] }]}>{email}</Text>
          </Text>
          
          <Text style={[styles.description, { color: colors.text.muted }]}>
            Please check your email and follow the instructions to reset your password.
          </Text>

          <FormButton
            title="Back to Login"
            onPress={handleBackToLogin}
            style={styles.button}
          />

          <Text style={[styles.helpText, { color: colors.text.muted }]}>
            Didn't receive the email? Check your spam folder or try again.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.primary }]} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Forgot Password?</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          No worries! Enter your email address and we'll send you a link to reset your password.
        </Text>

        <View style={styles.form}>
          <FormInput
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            required
          />

          <FormButton
            title="Send Reset Link"
            onPress={handleSendResetEmail}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          />

          <FormButton
            title="Back to Login"
            onPress={handleBackToLogin}
            variant="secondary"
            style={styles.button}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor will be set dynamically
  },
  scrollContent: {
    flexGrow: 1,
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
    // color will be set dynamically
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    // color will be set dynamically
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    fontWeight: '600',
    // color will be set dynamically
  },
  description: {
    fontSize: 14,
    // color will be set dynamically
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  button: {
    marginBottom: 16,
  },
  helpText: {
    fontSize: 12,
    // color will be set dynamically
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
});
