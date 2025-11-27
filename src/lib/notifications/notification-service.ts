/**
 * Notification Service
 * 
 * This module provides real-time notification functionality
 * including WebSocket/SSE connections, notification preferences,
 * and push notification support.
 */

import { z } from 'zod';

// ============================================================================
// Types
// ============================================================================

/**
 * Notification types
 */
export type NotificationType = 
  | 'job_posted'
  | 'bid_received'
  | 'bid_accepted'
  | 'bid_rejected'
  | 'message'
  | 'milestone_completed'
  | 'payment_received'
  | 'payment_sent'
  | 'rating_received'
  | 'territory_available'
  | 'territory_claimed'
  | 'system'
  | 'warning'
  | 'success';

/**
 * Notification priority
 */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Notification channel
 */
export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push';

/**
 * Notification data structure
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: string;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  channels: Record<NotificationType, NotificationChannel[]>;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
    timezone: string;
  };
  emailDigest: 'none' | 'daily' | 'weekly';
  pushEnabled: boolean;
}

/**
 * Connection state
 */
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

// ============================================================================
// Validation Schemas
// ============================================================================

export const notificationPreferencesSchema = z.object({
  channels: z.record(z.array(z.enum(['in_app', 'email', 'sms', 'push']))),
  quietHours: z.object({
    enabled: z.boolean(),
    start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    timezone: z.string(),
  }),
  emailDigest: z.enum(['none', 'daily', 'weekly']),
  pushEnabled: z.boolean(),
});

// ============================================================================
// Constants
// ============================================================================

const NOTIFICATIONS_STORAGE_KEY = 'ftw_notifications';
const PREFERENCES_STORAGE_KEY = 'ftw_notification_prefs';
const MAX_STORED_NOTIFICATIONS = 100;
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

// ============================================================================
// State Management
// ============================================================================

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  connectionState: ConnectionState;
  preferences: NotificationPreferences;
}

let state: NotificationState = {
  notifications: [],
  unreadCount: 0,
  connectionState: 'disconnected',
  preferences: getDefaultPreferences(),
};

const listeners: Set<(state: NotificationState) => void> = new Set();

/**
 * Get default notification preferences
 */
function getDefaultPreferences(): NotificationPreferences {
  return {
    channels: {
      job_posted: ['in_app', 'email'],
      bid_received: ['in_app', 'email', 'push'],
      bid_accepted: ['in_app', 'email', 'push'],
      bid_rejected: ['in_app', 'email'],
      message: ['in_app', 'push'],
      milestone_completed: ['in_app', 'email'],
      payment_received: ['in_app', 'email', 'push'],
      payment_sent: ['in_app', 'email'],
      rating_received: ['in_app', 'email'],
      territory_available: ['in_app', 'email'],
      territory_claimed: ['in_app', 'email'],
      system: ['in_app'],
      warning: ['in_app', 'email'],
      success: ['in_app'],
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    emailDigest: 'daily',
    pushEnabled: false,
  };
}

/**
 * Notify listeners of state change
 */
function notifyListeners(): void {
  listeners.forEach(listener => listener({ ...state }));
}

/**
 * Subscribe to notification state changes
 */
export function subscribeToNotifications(
  listener: (state: NotificationState) => void
): () => void {
  listeners.add(listener);
  listener({ ...state });
  return () => listeners.delete(listener);
}

/**
 * Get current notification state
 */
export function getNotificationState(): NotificationState {
  return { ...state };
}

/**
 * Update notification state
 */
function updateState(updates: Partial<NotificationState>): void {
  state = { ...state, ...updates };
  notifyListeners();
}

// ============================================================================
// Storage
// ============================================================================

/**
 * Load notifications from storage
 */
function loadStoredNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
  return [];
}

/**
 * Save notifications to storage
 */
function saveNotifications(notifications: Notification[]): void {
  try {
    const toStore = notifications.slice(0, MAX_STORED_NOTIFICATIONS);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
}

/**
 * Load preferences from storage
 */
function loadStoredPreferences(): NotificationPreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load preferences:', error);
  }
  return getDefaultPreferences();
}

/**
 * Save preferences to storage
 */
function savePreferences(preferences: NotificationPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}

// ============================================================================
// WebSocket/SSE Connection
// ============================================================================

let eventSource: EventSource | null = null;
let reconnectAttempts = 0;

/**
 * Connect to notification stream
 */
export function connect(userId: string): void {
  if (state.connectionState === 'connected' || state.connectionState === 'connecting') {
    return;
  }

  updateState({ connectionState: 'connecting' });

  try {
    // Use Server-Sent Events for simplicity
    const url = `/api/notifications/stream?userId=${encodeURIComponent(userId)}`;
    eventSource = new EventSource(url);

    eventSource.onopen = () => {
      reconnectAttempts = 0;
      updateState({ connectionState: 'connected' });
    };

    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data) as Notification;
        addNotification(notification);
      } catch (error) {
        console.error('Failed to parse notification:', error);
      }
    };

    eventSource.onerror = () => {
      handleConnectionError();
    };
  } catch (error) {
    console.error('Failed to connect to notification stream:', error);
    handleConnectionError();
  }
}

/**
 * Handle connection errors and attempt reconnection
 */
function handleConnectionError(): void {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }

  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    updateState({ connectionState: 'reconnecting' });
    
    setTimeout(() => {
      // In a real implementation, you'd reconnect here
      console.log(`Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
    }, RECONNECT_DELAY * reconnectAttempts);
  } else {
    updateState({ connectionState: 'disconnected' });
  }
}

/**
 * Disconnect from notification stream
 */
export function disconnect(): void {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  updateState({ connectionState: 'disconnected' });
}

// ============================================================================
// Notification Management
// ============================================================================

/**
 * Add a new notification
 */
export function addNotification(notification: Notification): void {
  const notifications = [notification, ...state.notifications].slice(0, MAX_STORED_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  updateState({ notifications, unreadCount });
  saveNotifications(notifications);
  
  // Trigger browser notification if enabled
  if (state.preferences.pushEnabled && !notification.read) {
    showBrowserNotification(notification);
  }
}

/**
 * Mark notification as read
 */
export function markAsRead(notificationId: string): void {
  const notifications = state.notifications.map(n =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  const unreadCount = notifications.filter(n => !n.read).length;
  
  updateState({ notifications, unreadCount });
  saveNotifications(notifications);
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead(): void {
  const notifications = state.notifications.map(n => ({ ...n, read: true }));
  
  updateState({ notifications, unreadCount: 0 });
  saveNotifications(notifications);
}

/**
 * Delete a notification
 */
export function deleteNotification(notificationId: string): void {
  const notifications = state.notifications.filter(n => n.id !== notificationId);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  updateState({ notifications, unreadCount });
  saveNotifications(notifications);
}

/**
 * Clear all notifications
 */
export function clearAllNotifications(): void {
  updateState({ notifications: [], unreadCount: 0 });
  saveNotifications([]);
}

/**
 * Get notifications filtered by type or read status
 */
export function getNotifications(
  options?: { type?: NotificationType; unreadOnly?: boolean }
): Notification[] {
  let filtered = [...state.notifications];
  
  if (options?.type) {
    filtered = filtered.filter(n => n.type === options.type);
  }
  
  if (options?.unreadOnly) {
    filtered = filtered.filter(n => !n.read);
  }
  
  return filtered;
}

// ============================================================================
// Browser Notifications
// ============================================================================

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Show browser notification
 */
function showBrowserNotification(notification: Notification): void {
  if (Notification.permission !== 'granted') {
    return;
  }

  // Check quiet hours
  if (isInQuietHours()) {
    return;
  }

  const browserNotification = new Notification(notification.title, {
    body: notification.message,
    icon: '/icons/notification-icon.png',
    tag: notification.id,
    data: notification,
  });

  browserNotification.onclick = () => {
    window.focus();
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    markAsRead(notification.id);
    browserNotification.close();
  };
}

/**
 * Check if current time is in quiet hours
 */
function isInQuietHours(): boolean {
  const { quietHours } = state.preferences;
  
  if (!quietHours.enabled) {
    return false;
  }

  const now = new Date();
  const [startHour, startMin] = quietHours.start.split(':').map(Number);
  const [endHour, endMin] = quietHours.end.split(':').map(Number);
  
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}

// ============================================================================
// Preferences Management
// ============================================================================

/**
 * Get notification preferences
 */
export function getPreferences(): NotificationPreferences {
  return { ...state.preferences };
}

/**
 * Update notification preferences
 */
export function updatePreferences(
  updates: Partial<NotificationPreferences>
): NotificationPreferences {
  const preferences = { ...state.preferences, ...updates };
  
  updateState({ preferences });
  savePreferences(preferences);
  
  return preferences;
}

/**
 * Enable/disable push notifications
 */
export async function togglePushNotifications(enabled: boolean): Promise<boolean> {
  if (enabled) {
    const granted = await requestNotificationPermission();
    if (!granted) {
      return false;
    }
  }
  
  updatePreferences({ pushEnabled: enabled });
  return true;
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize the notification service
 */
export function initialize(): void {
  const notifications = loadStoredNotifications();
  const preferences = loadStoredPreferences();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  updateState({
    notifications,
    unreadCount,
    preferences,
  });
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initialize();
}

// ============================================================================
// React Hook
// ============================================================================

/**
 * React hook for notifications
 */
export function useNotifications() {
  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    connectionState: state.connectionState,
    preferences: state.preferences,
    connect,
    disconnect,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotifications,
    updatePreferences,
    togglePushNotifications,
    requestNotificationPermission,
  };
}

export default {
  initialize,
  connect,
  disconnect,
  subscribeToNotifications,
  getNotificationState,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getNotifications,
  getPreferences,
  updatePreferences,
  togglePushNotifications,
  requestNotificationPermission,
  useNotifications,
};
