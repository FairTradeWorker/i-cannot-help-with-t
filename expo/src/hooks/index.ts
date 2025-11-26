import { useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import { dataStore } from '@/lib/store';
import type { User, Notification } from '@/types';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Hook to get and manage the current user
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setLoading(true);
    const currentUser = await dataStore.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    await dataStore.setCurrentUser(updatedUser);
    await dataStore.saveUser(updatedUser);
    setUser(updatedUser);
  }, [user]);

  const logout = useCallback(async () => {
    await dataStore.clearCurrentUser();
    setUser(null);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return { user, loading, loadUser, updateUser, logout };
}

/**
 * Hook to manage push notifications
 */
export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const registerForPushNotifications = useCallback(async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    setExpoPushToken(token);
    await dataStore.setPushToken(token);
    return token;
  }, []);

  const loadNotifications = useCallback(async (userId: string) => {
    const userNotifications = await dataStore.getNotifications(userId);
    setNotifications(userNotifications);
    setUnreadCount(userNotifications.filter((n) => !n.read).length);
  }, []);

  const markAsRead = useCallback(async (userId: string, notificationId: string) => {
    await dataStore.markNotificationRead(userId, notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  return {
    expoPushToken,
    notifications,
    unreadCount,
    registerForPushNotifications,
    loadNotifications,
    markAsRead,
  };
}

/**
 * Hook to get and watch the user's location
 */
export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<Location.LocationGeocodedAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission not granted');
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      const [addr] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setAddress(addr);

      return { location: loc, address: addr };
    } catch (err) {
      setError('Failed to get location');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, address, loading, error, getLocation };
}

/**
 * Hook to monitor network connectivity
 */
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
      setConnectionType(state.type);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, connectionType };
}

/**
 * Hook to manage offline queue
 */
export function useOfflineQueue() {
  const [queue, setQueue] = useState<{ type: string; payload: any }[]>([]);
  const { isConnected } = useNetworkStatus();

  const loadQueue = useCallback(async () => {
    const storedQueue = await dataStore.getOfflineQueue();
    setQueue(storedQueue);
  }, []);

  const addToQueue = useCallback(async (action: { type: string; payload: any }) => {
    await dataStore.addToOfflineQueue(action);
    setQueue((prev) => [...prev, action]);
  }, []);

  const processQueue = useCallback(async () => {
    if (!isConnected || queue.length === 0) return;

    // Process each action in the queue
    for (const action of queue) {
      try {
        // Here you would dispatch the action to your API
        console.log('Processing queued action:', action);
      } catch (error) {
        console.error('Failed to process action:', error);
        return; // Stop processing on error
      }
    }

    // Clear the queue after successful processing
    await dataStore.clearOfflineQueue();
    setQueue([]);
  }, [isConnected, queue]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    if (isConnected && queue.length > 0) {
      processQueue();
    }
  }, [isConnected, queue.length, processQueue]);

  return { queue, addToQueue, processQueue };
}

/**
 * Hook to track app state changes
 */
export function useAppState() {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState);
    return () => subscription.remove();
  }, []);

  return appState;
}

/**
 * Hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
