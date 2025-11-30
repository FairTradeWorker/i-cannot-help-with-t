// Main App Entry Point
// Sets up NativeWind, SafeAreaProvider, Navigation, and Error Boundaries

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeWindStyleSheet } from 'nativewind';
import { AppNavigator } from './navigation/AppNavigator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { authService } from './services/auth.service';

// Initialize NativeWind
NativeWindStyleSheet.setOutput({ default: 'native' });

export default function App() {
  useEffect(() => {
    // Initialize auth on app start
    authService.initializeAuth().catch(console.error);
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
