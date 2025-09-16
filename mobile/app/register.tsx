import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { register } from '@/store/slices/authSlice';
import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import PetSpeciesSelector from '@/components/PetSpeciesSelector';
import { Colors } from '../src/constants/colors';

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    pet_name: '',
    pet_species: 'dragon',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must be less than 20 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, dashes and underscores';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
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

    // Password confirmation validation
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    // Pet name validation
    if (formData.pet_name && formData.pet_name.length > 20) {
      newErrors.pet_name = 'Pet name must be less than 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await dispatch(register(formData)).unwrap();
      
      if (result.email_verified === false) {
        Alert.alert(
          'Registration Successful!',
          'Please check your email to verify your account before logging in.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login'),
            },
          ]
        );
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        Alert.alert('Registration Failed', error.message || 'Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Habbis and start building better habits!</Text>

      <View style={styles.form}>
        <FormInput
          label="Username"
          placeholder="Enter your username"
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
          autoCapitalize="none"
          returnKeyType="next"
          error={errors.username}
          required
        />

        <FormInput
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          error={errors.email}
          required
        />

        <FormInput
          label="Password"
          placeholder="Create a strong password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          returnKeyType="next"
          error={errors.password}
          required
        />
        
        <PasswordStrengthIndicator password={formData.password} />

        <FormInput
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.password_confirmation}
          onChangeText={(text) => setFormData({ ...formData, password_confirmation: text })}
          secureTextEntry
          returnKeyType="next"
          error={errors.password_confirmation}
          required
        />

        <FormInput
          label="Pet Name (Optional)"
          placeholder="Give your pet a name"
          value={formData.pet_name}
          onChangeText={(text) => setFormData({ ...formData, pet_name: text })}
          returnKeyType="done"
          onSubmitEditing={handleRegister}
          error={errors.pet_name}
        />

        <PetSpeciesSelector
          selectedSpecies={formData.pet_species}
          onSpeciesChange={(species) => setFormData({ ...formData, pet_species: species })}
        />

        <FormButton
          title="Create Account"
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        />

        <FormButton
          title="Already have an account? Sign In"
          onPress={() => router.replace('/login')}
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
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary[600],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    marginBottom: 16,
  },
  linkButton: {
    marginTop: 8,
  },
});
