// Auth Guard Component
// Protects routes that require authentication

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export function AuthGuard({ 
  children, 
  requireAuth = true,
  fallback 
}: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
      </View>
    );
  }

  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View className="flex-1 items-center justify-center bg-gray-100 px-6">
        <Text className="text-xl font-bold text-gray-900 mb-4 text-center">
          Sign In Required
        </Text>
        <Text className="text-gray-600 mb-8 text-center">
          Please sign in to access this feature.
        </Text>
        <TouchableOpacity
          className="bg-primary-500 px-8 py-3 rounded-full"
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

