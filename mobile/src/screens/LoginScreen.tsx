// Authentication Login Screen
// User login and signup

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react-native';
import { validateEmail, validateRequired } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import type { User as UserType } from '@/types';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, signup, loading: authLoading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    }

    if (isSignup) {
      if (!validateRequired(formData.name)) {
        newErrors.name = 'Name is required';
      }

      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigation.goBack();
      Alert.alert('Success', 'Logged in successfully!');
    } else {
      Alert.alert('Login Failed', result.error || 'Invalid email or password');
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
      role: 'homeowner',
    });

    if (result.success) {
      navigation.goBack();
      Alert.alert('Success', 'Account created successfully!');
    } else {
      Alert.alert('Signup Failed', result.error || 'Failed to create account');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top', 'bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-12">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text className="text-gray-600 text-center">
              {isSignup
                ? 'Join FairTradeWorker to connect with contractors'
                : 'Sign in to continue'}
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {isSignup && (
              <View>
                <View className="flex-row items-center mb-2">
                  <User size={20} color="#6b7280" />
                  <Text className="text-sm font-semibold text-gray-700 ml-2">Full Name</Text>
                </View>
                <TextInput
                  className="bg-white rounded-lg px-4 py-3 text-base border border-gray-200"
                  placeholder="John Doe"
                  value={formData.name}
                  onChangeText={text => setFormData({ ...formData, name: text })}
                  autoCapitalize="words"
                />
                {errors.name && (
                  <Text className="text-red-600 text-xs mt-1">{errors.name}</Text>
                )}
              </View>
            )}

            <View>
              <View className="flex-row items-center mb-2">
                <Mail size={20} color="#6b7280" />
                <Text className="text-sm font-semibold text-gray-700 ml-2">Email</Text>
              </View>
              <TextInput
                className="bg-white rounded-lg px-4 py-3 text-base border border-gray-200"
                placeholder="you@example.com"
                value={formData.email}
                onChangeText={text => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Text className="text-red-600 text-xs mt-1">{errors.email}</Text>
              )}
            </View>

            {isSignup && (
              <View>
                <View className="flex-row items-center mb-2">
                  <Phone size={20} color="#6b7280" />
                  <Text className="text-sm font-semibold text-gray-700 ml-2">Phone (Optional)</Text>
                </View>
                <TextInput
                  className="bg-white rounded-lg px-4 py-3 text-base border border-gray-200"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChangeText={text => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>
            )}

            <View>
              <View className="flex-row items-center mb-2">
                <Lock size={20} color="#6b7280" />
                <Text className="text-sm font-semibold text-gray-700 ml-2">Password</Text>
              </View>
              <View className="relative">
                <TextInput
                  className="bg-white rounded-lg px-4 py-3 text-base border border-gray-200 pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={text => setFormData({ ...formData, password: text })}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  className="absolute right-4 top-3"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-600 text-xs mt-1">{errors.password}</Text>
              )}
            </View>

            {isSignup && (
              <View>
                <View className="flex-row items-center mb-2">
                  <Lock size={20} color="#6b7280" />
                  <Text className="text-sm font-semibold text-gray-700 ml-2">Confirm Password</Text>
                </View>
                <TextInput
                  className="bg-white rounded-lg px-4 py-3 text-base border border-gray-200"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChangeText={text => setFormData({ ...formData, confirmPassword: text })}
                  secureTextEntry={!showPassword}
                />
                {errors.confirmPassword && (
                  <Text className="text-red-600 text-xs mt-1">{errors.confirmPassword}</Text>
                )}
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={isSignup ? handleSignup : handleLogin}
            disabled={authLoading}
            className={`mt-8 py-4 rounded-xl items-center ${
              authLoading ? 'bg-gray-300' : 'bg-primary-500'
            }`}
          >
            {authLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                {isSignup ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle Signup/Login */}
          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-gray-600">
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
              <Text className="text-primary-500 font-semibold">
                {isSignup ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-500 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social Login */}
          <View className="space-y-3">
            <TouchableOpacity className="bg-white rounded-lg px-4 py-3 flex-row items-center justify-center border border-gray-200">
              <Text className="text-gray-900 font-semibold">Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white rounded-lg px-4 py-3 flex-row items-center justify-center border border-gray-200">
              <Text className="text-gray-900 font-semibold">Continue with Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

