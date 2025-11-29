// Custom hook for push notifications
// Manages notification permissions and setup

import { useState, useEffect, useRef } from 'react';
import { notificationService } from '@/services/notifications.service';
import * as Notifications from 'expo-notifications';

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const notificationListener = useRef<{ remove: () => void } | null>(null);
  const responseListener = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    registerForPushNotifications();

    // Set up notification listeners
    notificationListener.current = notificationService.setupListeners(
      notification => {
        setNotification(notification);
      },
      response => {
        console.log('Notification tapped:', response);
        // Handle navigation based on notification data
      }
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const registerForPushNotifications = async () => {
    setLoading(true);
    try {
      const granted = await notificationService.requestPermissions();
      setPermissionGranted(granted);

      if (granted) {
        const token = await notificationService.getPushToken();
        setExpoPushToken(token);
      }
    } catch (error) {
      console.error('Failed to register for push notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendLocalNotification = async (title: string, body: string) => {
    if (permissionGranted) {
      await notificationService.scheduleLocalNotification(title, body);
    }
  };

  const clearBadge = async () => {
    await notificationService.clearBadge();
  };

  return {
    expoPushToken,
    notification,
    permissionGranted,
    loading,
    sendLocalNotification,
    clearBadge,
    requestPermissions: registerForPushNotifications,
  };
}

