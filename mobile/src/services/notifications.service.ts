// Push Notifications Service
// Expo notifications integration

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return false;
    }

    // Get push token
    const token = await this.getPushToken();
    if (token) {
      // TODO: Send token to backend
      console.log('Push token:', token);
    }

    return finalStatus === 'granted';
  }

  /**
   * Get Expo push token
   */
  async getPushToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#0ea5e9',
        });
      }

      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // TODO: Replace with actual project ID
      });

      return token;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  }

  /**
   * Schedule local notification
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: trigger || { seconds: 1 },
    });
  }

  /**
   * Cancel notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Set up notification listeners
   */
  setupListeners(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationTapped: (response: Notifications.NotificationResponse) => void
  ) {
    // Listener for notifications received while app is foregrounded
    const receivedListener = Notifications.addNotificationReceivedListener(
      onNotificationReceived
    );

    // Listener for when user taps notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      onNotificationTapped
    );

    return {
      remove: () => {
        receivedListener.remove();
        responseListener.remove();
      },
    };
  }

  /**
   * Get badge count
   */
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Clear badge
   */
  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }
}

export const notificationService = new NotificationService();

