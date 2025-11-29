// FairTradeWorker Mobile App
// Root component with error boundary and providers

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import AppNavigator from '@/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

