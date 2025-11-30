// Mobile Loading Spinner Component
// Consistent loading states across the app

import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { AnimatedLoader } from './AnimatedLoader';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message,
  size = 'medium',
  fullScreen = false
}: LoadingSpinnerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const content = (
    <View style={[
      styles.container,
      fullScreen && styles.fullScreen,
      fullScreen && (isDark ? styles.fullScreenDark : styles.fullScreenLight)
    ]}>
      <AnimatedLoader size={size} />
      {message && (
        <Text style={[
          styles.message,
          isDark ? styles.messageDark : styles.messageLight
        ]}>
          {message}
        </Text>
      )}
    </View>
  );

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  fullScreen: {
    flex: 1,
  },
  fullScreenLight: {
    backgroundColor: '#f3f4f6',
  },
  fullScreenDark: {
    backgroundColor: '#111827',
  },
  message: {
    marginTop: 24,
    fontSize: 16,
    textAlign: 'center',
  },
  messageLight: {
    color: '#6b7280',
  },
  messageDark: {
    color: '#d1d5db',
  },
});

