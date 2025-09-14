import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';

export default function ChangePasswordScreen() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
    }

    if (!formData.password) {
      newErrors.password = 'New password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your new password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    if (formData.current_password === formData.password) {
      newErrors.password = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: Implement change password API call
      // const response = await apiClient.post('/password/change', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Password Changed',
        'Your password has been changed successfully. Please log in again.',
        [
          {
            text: 'OK',
            onPress: () => {
              // TODO: Implement logout
              router.replace('/login');
            },
          },
        ]
      );
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        Alert.alert('Error', 'Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>
          Enter your current password and choose a new secure password.
        </Text>

        <View style={styles.form}>
          <FormInput
            label="Current Password"
            placeholder="Enter your current password"
            value={formData.current_password}
            onChangeText={(text) => setFormData({ ...formData, current_password: text })}
            secureTextEntry
            error={errors.current_password}
            required
          />

          <FormInput
            label="New Password"
            placeholder="Enter your new password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            error={errors.password}
            required
          />
          
          <PasswordStrengthIndicator password={formData.password} />

          <FormInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={formData.password_confirmation}
            onChangeText={(text) => setFormData({ ...formData, password_confirmation: text })}
            secureTextEntry
            error={errors.password_confirmation}
            required
          />

          <FormButton
            title="Change Password"
            onPress={handleChangePassword}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          />

          <FormButton
            title="Cancel"
            onPress={() => router.back()}
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
    backgroundColor: '#F8FAFC',
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
    color: '#1E40AF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  button: {
    marginBottom: 16,
  },
});
