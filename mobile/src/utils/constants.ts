// Mobile app constants
// Shared constants and configuration

export const APP_NAME = 'FairTradeWorker';
export const APP_VERSION = '1.0.0';

export const COLORS = {
  primary: '#0ea5e9',
  primaryDark: '#0284c7',
  primaryLight: '#38bdf8',
  secondary: '#8b5cf6',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const FIRST_300_TOTAL = 300;

export const REFRESH_INTERVALS = {
  notifications: 5000, // 5 seconds
  jobs: 10000, // 10 seconds
  messages: 2000, // 2 seconds
  territories: 30000, // 30 seconds
} as const;

export const API_ENDPOINTS = {
  jobs: '/api/jobs',
  territories: '/api/territories',
  messages: '/api/messages',
  notifications: '/api/notifications',
  users: '/api/users',
  bids: '/api/bids',
  payments: '/api/payments',
  first300: '/api/first300',
} as const;

export const STORAGE_KEYS = {
  currentUser: 'current_user',
  authToken: 'auth_token',
  preferences: 'user_preferences',
  cachedJobs: 'cached_jobs',
  cachedTerritories: 'cached_territories',
} as const;

export const LIMITS = {
  maxBidAmount: 1000000,
  minBidAmount: 1,
  maxJobTitleLength: 100,
  maxJobDescriptionLength: 2000,
  maxMessageLength: 1000,
  maxFileNameLength: 255,
  maxFileSize: 10 * 1024 * 1024, // 10 MB
} as const;

export const DATE_FORMATS = {
  short: 'MMM d, yyyy',
  long: 'MMMM d, yyyy',
  time: 'h:mm a',
  datetime: 'MMM d, yyyy h:mm a',
} as const;

