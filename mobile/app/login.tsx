import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { login } from '@/store/slices/authSlice';
import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import ThemeToggle from '@/components/ThemeToggle';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { colors, isLoaded } = useThemeContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Show loading if theme is not loaded
  if (!isLoaded || !colors) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      await (dispatch(login(formData) as any)).unwrap();
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error?.errors) {
        setErrors(error.errors);
      } else {
        Alert.alert('Login Failed', error?.message || 'Please check your credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors?.background?.primary || '#F5F3FF' }]} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <ThemeToggle size="small" showLabel={false} style={styles.themeToggle} />
      </View>
      <Text style={[styles.title, { color: colors?.text?.primary || '#4C1D95' }]}>Welcome Back</Text>
      <Text style={[styles.subtitle, { color: colors?.text?.secondary || '#64748B' }]}>Sign in to continue your journey</Text>

      <View style={styles.form}>
        <FormInput
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => {
            // Focus next input (password)
            // This will be handled by ref in FormInput
          }}
          error={errors.email}
          required
        />

        <FormInput
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          error={errors.password}
          required
        />

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={handleForgotPassword}
        >
          <Text style={[styles.forgotPasswordText, { color: colors?.primary?.[600] || '#7C3AED' }]}>Forgot Password?</Text>
        </TouchableOpacity>

        <FormButton
          title="Sign In"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        />

        <FormButton
          title="Don't have an account? Sign Up"
          onPress={() => router.replace('/register')}
          variant="secondary"
          style={styles.linkButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  themeToggle: {
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    marginBottom: 16,
  },
  linkButton: {
    marginTop: 8,
  },
});