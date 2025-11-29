// Custom hook for notifications
// Real-time notification management

import { useState, useEffect, useCallback } from 'react';
import { dataStore } from '@fairtradeworker/shared';
import type { Notification, User as UserType } from '@/types';

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
      // Poll for new notifications every 5 seconds
      const interval = setInterval(loadNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const loadUser = async () => {
    try {
      const user = await dataStore.getCurrentUser();
      setCurrentUser(user);
      if (!user && userId) {
        // If userId provided but no current user, use the provided one
        // This allows using the hook with a specific userId
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load user'));
    }
  };

  const loadNotifications = useCallback(async () => {
    const userIdToUse = currentUser?.id || userId;
    if (!userIdToUse) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userNotifications = await dataStore.getNotifications(userIdToUse);
      const sorted = userNotifications.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load notifications'));
    } finally {
      setLoading(false);
    }
  }, [currentUser, userId]);

  const markAsRead = useCallback(async (notificationId: string) => {
    const userIdToUse = currentUser?.id || userId;
    if (!userIdToUse) return;

    try {
      await dataStore.markNotificationRead(userIdToUse, notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, [currentUser, userId]);

  const markAllAsRead = useCallback(async () => {
    const userIdToUse = currentUser?.id || userId;
    if (!userIdToUse) return;

    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      await Promise.all(
        unreadIds.map(id => dataStore.markNotificationRead(userIdToUse, id))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, [currentUser, userId, notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    refresh: loadNotifications,
    markAsRead,
    markAllAsRead,
  };
}

