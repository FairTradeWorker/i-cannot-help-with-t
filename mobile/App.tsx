import './src/global.css';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';
import { vars } from 'nativewind';
import { AppNavigator } from './src/navigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// Dark mode theme variables for NativeWind
const darkTheme = vars({
  '--color-background': '#1a1a2e',
  '--color-foreground': '#f8fafc',
  '--color-card': '#25253a',
  '--color-primary': '#00c3ff',
  '--color-secondary': '#00e6a8',
  '--color-accent': '#9900ff',
  '--color-muted': '#3a3a52',
  '--color-border': '#4a4a68',
});

const lightTheme = vars({
  '--color-background': '#f8fafc',
  '--color-foreground': '#0f172a',
  '--color-card': '#ffffff',
  '--color-primary': '#00c3ff',
  '--color-secondary': '#00e6a8',
  '--color-accent': '#9900ff',
  '--color-muted': '#f1f5f9',
  '--color-border': '#e2e8f0',
});

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <GestureHandlerRootView style={[{ flex: 1 }, isDarkMode ? darkTheme : lightTheme]}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <AppNavigator />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
