import './src/global.css';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';
import { AppNavigator } from './src/navigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// Theme colors for dark and light modes
const themes = {
  dark: {
    background: '#1a1a2e',
    foreground: '#f8fafc',
    card: '#25253a',
    primary: '#00c3ff',
    secondary: '#00e6a8',
    accent: '#9900ff',
  },
  light: {
    background: '#f8fafc',
    foreground: '#0f172a',
    card: '#ffffff',
    primary: '#00c3ff',
    secondary: '#00e6a8',
    accent: '#9900ff',
  },
};

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = isDarkMode ? themes.dark : themes.light;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <AppNavigator />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
