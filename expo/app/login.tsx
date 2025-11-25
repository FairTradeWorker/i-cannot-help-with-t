import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '@/theme';
import { Card, Button, Input, Badge } from '@/components/ui';
import { dataStore } from '@/lib/store';
import type { User } from '@/types';

type AuthMode = 'login' | 'signup';
type UserRole = 'homeowner' | 'contractor';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('homeowner');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert('Biometric Auth', 'Biometric authentication is not available on this device.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to continue',
      fallbackLabel: 'Use password',
    });

    if (result.success) {
      // Check if we have a saved user
      const existingUser = await dataStore.getCurrentUser();
      if (existingUser) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('No Account', 'Please sign in with email first.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter your email and password.');
      return;
    }

    if (mode === 'signup' && !name) {
      Alert.alert('Missing Information', 'Please enter your name.');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: `user-${Date.now()}`,
        role: role,
        email: email,
        name: mode === 'signup' ? name : email.split('@')[0],
        createdAt: new Date(),
        contractorProfile: role === 'contractor' ? {
          userId: `user-${Date.now()}`,
          contractorType: 'general_contractor',
          rating: 4.8,
          completedJobs: 0,
          skills: [],
          serviceRadius: 25,
          location: { lat: 0, lng: 0, address: '' },
          hourlyRate: 75,
          availability: 'available',
          verified: false,
          licenses: [],
          insurance: { provider: '', policyNumber: '', expiryDate: new Date(), coverageAmount: 0, verified: false },
        } : undefined,
      };

      await dataStore.setCurrentUser(newUser);
      await dataStore.saveUser(newUser);

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Logo */}
            <Animated.View entering={FadeIn.delay(100)} style={styles.logoSection}>
              <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
                <Ionicons name="home" size={40} color="#fff" />
              </View>
              <Text style={[styles.logoText, { color: colors.foreground }]}>ServiceHub</Text>
              <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
                Your home service marketplace
              </Text>
            </Animated.View>

            {/* Auth Card */}
            <Animated.View entering={FadeInUp.delay(200)}>
              <Card variant="glass" style={styles.authCard}>
                {/* Mode Toggle */}
                <View style={[styles.modeToggle, { backgroundColor: colors.muted, borderRadius: borderRadius.full }]}>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      mode === 'login' && { backgroundColor: colors.card },
                      { borderRadius: borderRadius.full },
                    ]}
                    onPress={() => setMode('login')}
                  >
                    <Text
                      style={[
                        styles.modeButtonText,
                        { color: mode === 'login' ? colors.foreground : colors.mutedForeground },
                      ]}
                    >
                      Sign In
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      mode === 'signup' && { backgroundColor: colors.card },
                      { borderRadius: borderRadius.full },
                    ]}
                    onPress={() => setMode('signup')}
                  >
                    <Text
                      style={[
                        styles.modeButtonText,
                        { color: mode === 'signup' ? colors.foreground : colors.mutedForeground },
                      ]}
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Role Selection (Signup only) */}
                {mode === 'signup' && (
                  <Animated.View entering={FadeInDown} style={styles.roleSection}>
                    <Text style={[styles.roleLabel, { color: colors.foreground }]}>I am a...</Text>
                    <View style={styles.roleButtons}>
                      <TouchableOpacity
                        style={[
                          styles.roleButton,
                          {
                            backgroundColor: role === 'homeowner' ? colors.primary : colors.muted,
                            borderRadius: borderRadius.lg,
                          },
                        ]}
                        onPress={() => setRole('homeowner')}
                      >
                        <Ionicons
                          name="home"
                          size={24}
                          color={role === 'homeowner' ? '#fff' : colors.foreground}
                        />
                        <Text
                          style={[
                            styles.roleButtonText,
                            { color: role === 'homeowner' ? '#fff' : colors.foreground },
                          ]}
                        >
                          Homeowner
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.roleButton,
                          {
                            backgroundColor: role === 'contractor' ? colors.primary : colors.muted,
                            borderRadius: borderRadius.lg,
                          },
                        ]}
                        onPress={() => setRole('contractor')}
                      >
                        <Ionicons
                          name="hammer"
                          size={24}
                          color={role === 'contractor' ? '#fff' : colors.foreground}
                        />
                        <Text
                          style={[
                            styles.roleButtonText,
                            { color: role === 'contractor' ? '#fff' : colors.foreground },
                          ]}
                        >
                          Contractor
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                )}

                {/* Form Fields */}
                {mode === 'signup' && (
                  <Input
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="John Smith"
                    autoCapitalize="words"
                    icon={<Ionicons name="person-outline" size={20} color={colors.mutedForeground} />}
                  />
                )}

                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Ionicons name="mail-outline" size={20} color={colors.mutedForeground} />}
                />

                <View>
                  <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    icon={<Ionicons name="lock-closed-outline" size={20} color={colors.mutedForeground} />}
                  />
                  <TouchableOpacity
                    style={styles.showPasswordButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>

                {mode === 'login' && (
                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Submit Button */}
                <Button onPress={handleSubmit} loading={loading} style={styles.submitButton}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>

                {/* Biometric Auth */}
                <TouchableOpacity
                  style={[styles.biometricButton, { borderColor: colors.border, borderRadius: borderRadius.lg }]}
                  onPress={handleBiometricAuth}
                >
                  <Ionicons name="finger-print" size={24} color={colors.primary} />
                  <Text style={[styles.biometricText, { color: colors.foreground }]}>
                    Use Biometric Login
                  </Text>
                </TouchableOpacity>
              </Card>
            </Animated.View>

            {/* Terms */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.termsSection}>
              <Text style={[styles.termsText, { color: colors.mutedForeground }]}>
                By continuing, you agree to our{' '}
                <Text style={{ color: colors.primary }}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={{ color: colors.primary }}>Privacy Policy</Text>
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 14,
    marginTop: 4,
  },
  authCard: {
    padding: 24,
    marginBottom: 24,
  },
  modeToggle: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  roleSection: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 16,
    top: 42,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    marginBottom: 16,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  biometricText: {
    fontSize: 15,
    fontWeight: '500',
  },
  termsSection: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
