// Authentication Service
// User authentication and session management

import { apiClient } from '@fairtradeworker/shared';
import { dataStore } from '@fairtradeworker/shared';
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
      
      // Store token
      await this.storeToken(response.token);
      
      // Store user
      await dataStore.setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid email or password');
    }
  }

  /**
   * Signup new user
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', data);
      
      // Store token
      await this.storeToken(response.token);
      
      // Store user
      await dataStore.setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Failed to create account. Please try again.');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout API
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
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
      await dataStore.setCurrentUser(response);
      return response;
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

    // TODO: Validate token expiration
    return true;
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

