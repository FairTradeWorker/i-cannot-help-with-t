// Authentication Service
// User authentication and session management

import { apiClient, dataStore } from '@fairtradeworker/shared';
import type { User } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'homeowner' | 'contractor' | 'operator';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Set auth token in API client
      apiClient.setAuthToken(response.token);
      
      // Store token
      await this.storeToken(response.token);
      if (response.refreshToken) {
        await this.storeRefreshToken(response.refreshToken);
      }
      
      // Store user
      await dataStore.setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      const message = error instanceof Error ? error.message : 'Invalid email or password';
      throw new Error(message);
    }
  }

  /**
   * Signup new user
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', data);
      
      // Set auth token in API client
      apiClient.setAuthToken(response.token);
      
      // Store token
      await this.storeToken(response.token);
      if (response.refreshToken) {
        await this.storeRefreshToken(response.refreshToken);
      }
      
      // Store user
      await dataStore.setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Signup failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
      throw new Error(message);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Clear auth token from API client
      apiClient.setAuthToken(null);
      
      // Call logout API (if exists)
      try {
        await apiClient.post('/auth/logout', {});
      } catch (error) {
        console.warn('Logout API call failed:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      await this.clearToken();
      await dataStore.setCurrentUser(null as any);
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      if (response) {
        await dataStore.setCurrentUser(response);
        return response;
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await apiClient.post<{ token: string }>('/auth/refresh', {
        refreshToken,
      });

      await this.storeToken(response.token);
      return response.token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;

    // Set token in API client
    apiClient.setAuthToken(token);

    // Try to get current user to validate token
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  }

  async initializeAuth(): Promise<void> {
    const token = await this.getToken();
    if (token) {
      apiClient.setAuthToken(token);
      // Try to refresh user data
      await this.getCurrentUser();
    }
  }

  /**
   * Store auth token
   */
  private async storeToken(token: string): Promise<void> {
    // TODO: Store in secure storage
    // For now, using AsyncStorage
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  }

  /**
   * Get auth token
   */
  private async getToken(): Promise<string | null> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  /**
   * Store refresh token
   */
  private async storeRefreshToken(token: string): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('refresh_token', token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  /**
   * Get refresh token
   */
  private async getRefreshToken(): Promise<string | null> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem('refresh_token');
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear auth tokens
   */
  private async clearToken(): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }
}

export const authService = new AuthService();

