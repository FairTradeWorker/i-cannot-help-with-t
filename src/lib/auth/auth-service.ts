/**
 * Authentication Service
 * 
 * This module provides authentication and authorization functionality
 * including JWT management, OAuth, and session handling.
 */

import { z } from 'zod';

// ============================================================================
// Types
// ============================================================================

/**
 * User roles for RBAC
 */
export type UserRole = 'homeowner' | 'contractor' | 'subcontractor' | 'operator' | 'admin';

/**
 * Auth tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * Authenticated user
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Registration data
 */
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

/**
 * OAuth provider types
 */
export type OAuthProvider = 'google' | 'apple';

/**
 * Auth state
 */
interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================================================
// Validation Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['homeowner', 'contractor', 'subcontractor', 'operator']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const newPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ============================================================================
// Constants
// ============================================================================

const AUTH_STORAGE_KEY = 'ftw_auth';
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

// ============================================================================
// Auth State Management
// ============================================================================

let authState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
};

const listeners: Set<(state: AuthState) => void> = new Set();

/**
 * Notify all listeners of state change
 */
function notifyListeners(): void {
  listeners.forEach(listener => listener({ ...authState }));
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuth(listener: (state: AuthState) => void): () => void {
  listeners.add(listener);
  listener({ ...authState });
  return () => listeners.delete(listener);
}

/**
 * Get current auth state
 */
export function getAuthState(): AuthState {
  return { ...authState };
}

/**
 * Update auth state
 */
function updateAuthState(updates: Partial<AuthState>): void {
  authState = { ...authState, ...updates };
  notifyListeners();
}

// ============================================================================
// Token Management
// ============================================================================

/**
 * Store tokens securely
 */
function storeTokens(tokens: AuthTokens): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Failed to store auth tokens:', error);
  }
}

/**
 * Retrieve stored tokens
 */
function getStoredTokens(): AuthTokens | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to retrieve auth tokens:', error);
  }
  return null;
}

/**
 * Clear stored tokens
 */
function clearStoredTokens(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth tokens:', error);
  }
}

/**
 * Check if tokens need refresh
 */
function shouldRefreshTokens(tokens: AuthTokens): boolean {
  return tokens.expiresAt - Date.now() < TOKEN_REFRESH_THRESHOLD;
}

/**
 * Decode JWT token (without verification - for client-side use only)
 */
function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// ============================================================================
// Auth Methods
// ============================================================================

/**
 * Initialize auth from stored tokens
 */
export async function initializeAuth(): Promise<void> {
  updateAuthState({ isLoading: true });
  
  const tokens = getStoredTokens();
  
  if (tokens && !shouldRefreshTokens(tokens)) {
    // Tokens are valid, decode user from access token
    const payload = decodeToken(tokens.accessToken);
    if (payload) {
      const user: AuthUser = {
        id: payload.sub as string,
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as UserRole,
        emailVerified: payload.email_verified as boolean,
        createdAt: payload.created_at as string,
      };
      
      updateAuthState({
        user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }
  } else if (tokens && shouldRefreshTokens(tokens)) {
    // Try to refresh tokens
    try {
      await refreshTokens(tokens.refreshToken);
      updateAuthState({ isLoading: false });
      return;
    } catch {
      clearStoredTokens();
    }
  }
  
  updateAuthState({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
  });
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  // Validate credentials
  const validated = loginSchema.parse(credentials);
  
  // In production, this would call the API
  // For now, we'll simulate a successful login
  const mockTokens: AuthTokens = {
    accessToken: 'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now(),
    expiresAt: Date.now() + 3600000, // 1 hour
  };
  
  const mockUser: AuthUser = {
    id: 'user_' + Date.now(),
    email: validated.email,
    name: validated.email.split('@')[0],
    role: 'homeowner',
    emailVerified: true,
    createdAt: new Date().toISOString(),
  };
  
  storeTokens(mockTokens);
  updateAuthState({
    user: mockUser,
    tokens: mockTokens,
    isAuthenticated: true,
  });
  
  return mockUser;
}

/**
 * Register a new user
 */
export async function register(data: RegistrationData): Promise<AuthUser> {
  // Validate data
  const validated = registrationSchema.parse({
    ...data,
    confirmPassword: data.password,
  });
  
  // In production, this would call the API
  const mockTokens: AuthTokens = {
    accessToken: 'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now(),
    expiresAt: Date.now() + 3600000,
  };
  
  const mockUser: AuthUser = {
    id: 'user_' + Date.now(),
    email: validated.email,
    name: validated.name,
    role: validated.role,
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };
  
  storeTokens(mockTokens);
  updateAuthState({
    user: mockUser,
    tokens: mockTokens,
    isAuthenticated: true,
  });
  
  return mockUser;
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  clearStoredTokens();
  updateAuthState({
    user: null,
    tokens: null,
    isAuthenticated: false,
  });
}

/**
 * Refresh access token
 */
export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  // In production, this would call the API
  const newTokens: AuthTokens = {
    accessToken: 'refreshed_access_token_' + Date.now(),
    refreshToken: 'refreshed_refresh_token_' + Date.now(),
    expiresAt: Date.now() + 3600000,
  };
  
  storeTokens(newTokens);
  updateAuthState({ tokens: newTokens });
  
  return newTokens;
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const validated = passwordResetSchema.parse({ email });
  // In production, this would call the API
  console.log('Password reset requested for:', validated.email);
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const validated = newPasswordSchema.parse({
    password: newPassword,
    confirmPassword: newPassword,
    token,
  });
  // In production, this would call the API
  console.log('Password reset with token:', validated.token);
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<void> {
  // In production, this would call the API
  if (authState.user) {
    updateAuthState({
      user: { ...authState.user, emailVerified: true },
    });
  }
}

/**
 * Login with OAuth provider
 */
export async function loginWithOAuth(provider: OAuthProvider): Promise<void> {
  // In production, this would redirect to the OAuth provider
  const authUrl = provider === 'google'
    ? '/api/auth/oauth/google'
    : '/api/auth/oauth/apple';
  
  window.location.href = authUrl;
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  return authState.tokens?.accessToken ?? null;
}

/**
 * Check if user has required role
 */
export function hasRole(role: UserRole | UserRole[]): boolean {
  if (!authState.user) return false;
  
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(authState.user.role);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return authState.isAuthenticated;
}

// ============================================================================
// React Hook
// ============================================================================

/**
 * React hook for auth state
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   // ...
 * }
 * ```
 */
export function useAuth() {
  // Note: In a real React app, you'd use useState and useEffect
  // to subscribe to auth state changes
  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    loginWithOAuth,
    hasRole,
    getAccessToken,
  };
}

// Initialize auth on module load
if (typeof window !== 'undefined') {
  initializeAuth();
}

export default {
  initializeAuth,
  login,
  register,
  logout,
  refreshTokens,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  loginWithOAuth,
  getAccessToken,
  hasRole,
  isAuthenticated,
  subscribeToAuth,
  getAuthState,
  useAuth,
};
