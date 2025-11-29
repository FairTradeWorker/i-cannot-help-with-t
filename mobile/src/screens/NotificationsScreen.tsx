// Enhanced Notifications Screen
// Real-time notification management

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationCard } from '@/components/NotificationCard';
import { dataStore } from '@fairtradeworker/shared';
import type { Notification, User as UserType } from '@/types';

export default function NotificationsScreen() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    // Poll for new notifications every 5 seconds
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await dataStore.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        await loadNotifications();
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadNotifications = async () => {
    if (!currentUser) return;

    try {
      const userNotifications = await dataStore.getNotifications(currentUser.id);
      // Sort by date (newest first)
      const sorted = userNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!currentUser) return;

    try {
      // Mark as read
      if (!notification.read) {
        await dataStore.markNotificationRead(currentUser.id, notification.id);
        await loadNotifications();
      }

      // Navigate based on notification type
      if (notification.link) {
        // Handle navigation to link
        console.log('Navigate to:', notification.link);
      }
    } catch (error) {
      console.error('Failed to handle notification:', error);
    }
  };

  const handleDismiss = async (notificationId: string) => {
    // TODO: Implement dismiss/delete notification
    console.log('Dismiss notification:', notificationId);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading notifications...</Text>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center px-6">
        <Text className="text-gray-600 text-lg text-center">
          Please sign in to view notifications
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-gray-900">Notifications</Text>
        {unreadCount > 0 && (
          <View className="bg-primary-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">
              {unreadCount} new
            </Text>
          </View>
        )}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onPress={() => handleNotificationPress(item)}
            onDismiss={() => handleDismiss(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center py-12 px-6">
            <Text className="text-gray-500 text-lg mb-2">No notifications</Text>
            <Text className="text-gray-400 text-sm text-center">
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
