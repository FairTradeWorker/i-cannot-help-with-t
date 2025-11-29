// Authentication Hook
// Manages user authentication state and operations

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { dataStore } from '@fairtradeworker/shared';
import type { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await dataStore.getCurrentUser();
      const isAuthenticated = await authService.isAuthenticated();

      if (isAuthenticated && !currentUser) {
        // Try to fetch user from API
        const apiUser = await authService.getCurrentUser();
        setUser(apiUser);
      } else {
        setUser(currentUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to check authentication'));
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      setError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'homeowner' | 'contractor' | 'operator';
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.signup(data);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Signup failed');
      setError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refresh: checkAuth,
  };
}

