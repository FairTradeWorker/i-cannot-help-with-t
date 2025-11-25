import { useColorScheme } from 'react-native';

export const colors = {
  light: {
    background: '#ffffff',
    foreground: '#0f172a',
    card: 'rgba(255, 255, 255, 0.8)',
    cardBorder: 'rgba(226, 232, 240, 0.5)',
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    secondary: '#22c55e',
    secondaryForeground: '#ffffff',
    accent: '#f97316',
    accentForeground: '#ffffff',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  dark: {
    background: '#0f172a',
    foreground: '#f8fafc',
    card: 'rgba(30, 41, 59, 0.8)',
    cardBorder: 'rgba(51, 65, 85, 0.5)',
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    secondary: '#22c55e',
    secondaryForeground: '#ffffff',
    accent: '#f97316',
    accentForeground: '#ffffff',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#334155',
    input: '#334155',
    ring: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return {
    colors: isDark ? colors.dark : colors.light,
    isDark,
    spacing,
    borderRadius,
    typography,
    shadows,
  };
}

export type ThemeColors = typeof colors.light;
export type Theme = ReturnType<typeof useTheme>;
