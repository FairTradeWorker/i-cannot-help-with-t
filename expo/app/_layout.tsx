import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View, ActivityIndicator, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/theme';
import { initializeDemoData } from '@/lib/demo-data';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize demo data
        await initializeDemoData();
      } catch (error) {
        console.error('Failed to initialize:', error);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    };

    initialize();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={{ color: themeColors.mutedForeground, marginTop: 16 }}>Loading ServiceHub...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: themeColors.background },
            animation: 'slide_from_right',
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}
